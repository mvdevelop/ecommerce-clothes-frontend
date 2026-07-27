// Mock server - now uses secure version
require('dotenv').config();

const serverSecure = require('./src/server-secure.js');

// Re-export all handlers for compatibility
module.exports = serverSecure;

const PORT = process.env.PORT || 4000;

if (require.main === module) {
  serverSecure.listen(PORT, () => {
    console.log(`Mock Server is running on http://localhost:${PORT}`);
    console.log('Security features enabled from server-secure.js');
  });
}