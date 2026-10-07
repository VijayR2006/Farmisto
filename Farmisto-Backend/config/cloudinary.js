const cloudinary = require('cloudinary').v2;
require('dotenv').config();

/**
 * Configures Cloudinary with credentials from environment variables.
 * Supports both legacy names and current names without crashing the app.
 * @returns {Object|null} The cloudinary instance when configured, otherwise null.
 */
const connectCloudinary = () => {
  const env = process.env;
  const cloudName = (env.CLOUDINARY_CLOUD_NAME || env.CLOUD_NAME || '').trim();
  const apiKey = (env.CLOUDINARY_API_KEY || env.API_KEY || '').trim();
  const apiSecret = (env.CLOUDINARY_API_SECRET || env.API_SECRET || '').trim();

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('Cloudinary environment variables are not configured. Image uploads will be unavailable until valid credentials are added to the backend .env file.');
    return null;
  }

  try {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    console.log('Cloudinary configured successfully');
    return cloudinary;
  } catch (error) {
    console.error('Failed to configure Cloudinary:', error.message);
    return null;
  }
};

module.exports = connectCloudinary;