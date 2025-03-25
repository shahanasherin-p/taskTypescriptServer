const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
    console.log("Inside jwtMiddleware");

    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        console.log("Authorization header missing");
        return res.status(401).json("Authorization failed... token is missing");
    }

    const token = authHeader.split(" ")[1];
    console.log("Token:", token);

    if (token) {
        try {
            const jwtResponse = jwt.verify(token, process.env.JWTPASSWORD);
            console.log("JWT Response:", jwtResponse);
            req.userId = jwtResponse.userId;
            next();
        } catch (err) {
            console.error("JWT Verification Error:", err);
            res.status(401).json("Authorization failed... please login");
        }
    } else {
        console.log("Token missing after split");
        res.status(401).json("Authorization failed... token is missing");
    }
};

module.exports = jwtMiddleware;