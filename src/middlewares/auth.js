const jwt = require('jsonwebtoken');


module.exports.authentication = function (req, res, next) {
    try {
        const token = req.headers["authorization"];

        if (!token) {
            return res.status(401).json({ status: false, message: "token must be present" });
        }

        let splitToken = token.split(" ");

        // token validation
        jwt.verify(splitToken[1], process.env.TOKEN_SECRET, function (err, data) {
            if (err) {
                return res.status(400).json({ status: false, message: err.message });
            } else {
                req.userId = data.userId;
                next();
            }
        });

    } catch (error) {
        return res.status(500).json({ status: false, error: error.message });
    }
};