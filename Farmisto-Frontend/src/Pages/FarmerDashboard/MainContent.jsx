import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { PuffLoader } from "react-spinners";
import { useAuth } from "../../utils/Auth";
import axios from "../../utils/axios";

const MainContent = () => {
  const { authToken, userDetails } = useAuth();
  const [salesView, setSalesView] = useState("Weekly");
  const [salesData, setSalesData] = useState([]);
  const [location, setLocation] = useState(null);
  const [dashboardData, setDashboardData] = useState([]);

  const GetLocation = async () => {
    try {
      const response = await axios.get("/farmer/location", {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      if (response.status === 200) {
        setLocation(response.data.farmerLocation);
      } else {
        console.log("Failed to get location.");
      }
    } catch (error) {
      console.error("Error fetching location: ", error);
    }
  };

  const GetDashboard = async () => {
    try {
      const response = await axios.get("/farmer/dashboard", {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      if (response.status === 200) {
        console.log(response.data.dashboard)
        setSalesData(response.data.dashboard.salesData);
        setDashboardData(response.data.dashboard);
      }
    } catch (error) {
      console.error("Error fetching dashboard data: ", error);
    }
  };

  const salesChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [
      {
        label: `${salesView} Sales ($)`,
        data: salesData && salesData[salesView] ? salesData[salesView] : [],
        borderColor: "#405f27",
        backgroundColor: "#a8c686",
        borderWidth: 2,
      },
    ],
  };

  const isLoading = !location?.latitude;

  useEffect(() => {
    if (authToken) {
      GetLocation();
      GetDashboard();
    }
  }, [authToken, userDetails]);

  return (
    <div className="w-full p-2 sm:p-5 py-6 scrollbar-none">
      {/* Main Content */}
      <div className="flex flex-wrap gap-5 justify-center">
        {/* Sales with Toggle */}
        <div className="w-full lg:w-[48%] bg-gradient-to-r from-green-50 to-yellow-100 p-6 rounded-md">
          <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-[#405f27]">
              Sales Data
            </h3>
            <div className="flex gap-2">
              {["Weekly", "Monthly", "Yearly"].map((view) => (
                <div
                  key={view}
                  onClick={() => setSalesView(view)}
                  className={`px-4 py-2 rounded-lg text-sm cursor-pointer hover:scale-[1.08] font-semibold transition-all duration-300 ${
                    salesView === view
                      ? "bg-[#405f27] text-white"
                      : "bg-[#f6eedb] text-[#2A293E]"
                  }`}
                >
                  {view}
                </div>
              ))}
            </div>
          </div>
          <div className="sm:h-72">
            <Line data={salesChartData} />
          </div>
        </div>

        {/* User Location */}
        <div className="w-full lg:w-[48%] bg-gradient-to-r from-green-50 to-yellow-100 p-2 rounded-md transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-[#405f27] mb-2">
            Most Users
          </h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-72">
              <PuffLoader color="#65db9e" size={60} />
            </div>
          ) : (
            <div className="w-full h-80 rounded-lg overflow-hidden">
              <MapContainer
                center={[location.latitude, location.longitude]}
                zoom={13}
                attributionControl={true}
                scrollWheelZoom={true}
                style={{ width: "100%", height: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {dashboardData?.coordinates?.map((coord, index) => (
                  <Marker
                    key={index}
                    position={[
                      coord.latitude || "28.8",
                      coord.longitude || "78.3",
                    ]}
                  >
                    <Popup>{coord.name}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
