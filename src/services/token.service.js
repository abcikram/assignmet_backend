const jwt = require('jsonwebtoken');

const generateToken = (payload, expiresIn, secretKey) => {
    return jwt.sign(payload, secretKey, { expiresIn });
};

module.exports = { generateToken }
