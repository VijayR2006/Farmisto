const { default: axios } = require("axios");
const User = require("../models/User");
const Market = require("../models/Market");

// Reverse GeoCoding
const fetchLocation = async (lat, lng) => {
  if (!lat || !lng) {
    console.log("Latitude and Longitude are required.");
    return [];
  }

  const googleMapKey = process.env.GOOGLE_MAP_KEY || process.env.Google_Map_key;
  if (!googleMapKey) {
    console.warn("Google Maps API key is not configured. Geocoding requests will be skipped.");
    return [];
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapKey}`
    );
    if (response.data.results.length > 0) {
      return response.data.results;
    } else {
      console.log("Couldn't get location !");
    }
  } catch (error) {
    console.error("Error fetching location: ", error);
    throw error;
  }
};

// Haversine formula for calculating distance
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const Radius = 6371;
  const toRadians = (degrees) => degrees * (Math.PI / 180);

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const angular_Distance =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;
  const actual_Distance =
    2 *
    Math.atan2(Math.sqrt(angular_Distance), Math.sqrt(1 - angular_Distance));
  return Radius * actual_Distance;
};

// Nearby Farmers in a Radius of 30 Km
const fetchNearbyFarmers = async (req, res) => {
  const userLocation = req.user?.location || req.user?.userLocation;
  const lat = userLocation?.latitude;
  const lng = userLocation?.longitude;

  if (!lat || !lng) {
    return res
      .status(400)
      .json({ error: "Latitude and Longitude are required." });
  }
  try {
    const farmers = await User.find({ role: "farmer", userLocation: { $exists: true } }).lean();
    if (farmers.length === 0) {
      return res.status(404).json({ message: "No farmers found nearby" });
    }

    // Get item counts and categories for each farmer
    const farmerEmails = farmers.map(f => f.email);
    const marketItems = await Market.find({ "seller.email": { $in: farmerEmails } }).lean();

    const itemStats = {};
    marketItems.forEach(item => {
      const email = item.seller.email;
      if (!itemStats[email]) {
        itemStats[email] = { count: 0, categories: new Set() };
      }
      itemStats[email].count++;
      itemStats[email].categories.add(item.itemCategory);
    });

    const nearbyFarmers = farmers.filter((farmer) => {
      if (!farmer.userLocation?.latitude || !farmer.userLocation?.longitude) return false;
      const distance = calculateDistance(
        lat,
        lng,
        farmer.userLocation.latitude,
        farmer.userLocation.longitude
      );
      return distance <= 30;
    }).map(f => {
      const stats = itemStats[f.email] || { count: 0, categories: new Set() };
      return {
        id: f._id.toString(),
        userName: f.userName,
        farmerCity: f.farmerCity,
        farmerAddress: f.farmerAddress,
        farmerCountry: f.farmerCountry,
        farmerProfilePhoto: f.farmerProfilePhoto,
        userLocation: f.userLocation,
        itemCount: stats.count,
        categories: Array.from(stats.categories),
        distance: Math.round(calculateDistance(lat, lng, f.userLocation.latitude, f.userLocation.longitude) * 10) / 10,
      };
    }).sort((a, b) => a.distance - b.distance);

    res.status(200).json({ farmers: nearbyFarmers });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
    console.error("Error fetching nearby farmers: ", error);
  }
};

module.exports = {
  fetchLocation,
  fetchNearbyFarmers,
};
