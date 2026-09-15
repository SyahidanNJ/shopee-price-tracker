const crypto = require('crypto');

const accessTokenSecret = crypto.randomBytes(32).toString('hex');
const refreshTokenSecret = crypto.randomBytes(32).toString('hex');

console.log('=== JWT Secrets ===\n');
console.log('JWT_ACCESS_SECRET=' + accessTokenSecret);
console.log('JWT_REFRESH_SECRET=' + refreshTokenSecret);
