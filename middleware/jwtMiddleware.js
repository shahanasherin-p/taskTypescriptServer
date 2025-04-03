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
            const jwtResponse = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log("JWT Response:", jwtResponse);

            // ✅ Fix: Ensure `req.user` is correctly set
            req.userId = jwtResponse.userId || jwtResponse.id;  

            console.log("Middleware userId:", req.userId);
            next();
        } catch (err) {
            console.error("JWT Verification Error:", err);
            return res.status(401).json("Authorization failed... please login");
        }
    } else {
        console.log("Token missing after split");
        return res.status(401).json("Authorization failed... token is missing");
    }
};

module.exports = jwtMiddleware;
