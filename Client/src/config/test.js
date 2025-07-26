// Test configuration file to verify environment variables are loading correctly
import config from './index.js';

console.log('🔧 Configuration Test Results:');
console.log('📡 API URL:', config.apiUrl);
console.log('📱 App Name:', config.appName);
console.log('🔍 Environment:', config.isDevelopment ? 'Development' : 'Production');
console.log('📊 Logging Enabled:', config.enableLogging);
console.log('🔑 Storage Keys:', Object.keys(config.storageKeys));
console.log('🌐 Endpoints:', Object.keys(config.endpoints));

// Test if environment variables are loading
console.log('📋 Raw Environment Variables:');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('VITE_APP_NAME:', import.meta.env.VITE_APP_NAME);
console.log('MODE:', import.meta.env.MODE);

export default config;
