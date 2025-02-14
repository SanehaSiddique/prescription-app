const jwt = require("jsonwebtoken");

const authPatientMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Remove 'Bearer '

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS384"] });
        req.user = verified; // Attach user data to request

        // Check if the user is a doctor
        if (req.user.userType !== "patient") {
            return res.status(403).json({ message: "Access Denied. You are not Patient." });
        }

        next(); // Continue to next middleware
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

module.exports = authPatientMiddleware;