const jwt=require("jsonwebtoken")
const JWT_SECRET=`${process.env.JWT_SECRET}`
const User = require('../model/UserModel');

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(403).json({ message: "Authorization token missing" });
    }
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = user;
      next();
    });
  };
  
  // Middleware for checking if user is an admin
  const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  };
  const authenticateAdmin = async (req, res, next) => {
    const token = req.cookies.authToken;  // Token should be in cookies
  
    // Log the token to check if it's correctly sent and formatted
    console.log("Token from cookies:", token);
  
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Log the decoded token for debugging
      console.log("Decoded JWT:", decoded);
  
      // Find the user associated with the decoded token
      const user = await User.findById(decoded.userId);
  
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      // Attach the user to the request object
      req.user = user; 
  
      // Proceed to the next middleware or route handler
      next(); 
    } catch (err) {
      // Log the specific JWT verification error
      console.error('JWT Verification Error:', err.message);
  
      // If the error is related to token expiration, handle it specifically
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired' });
      }
  
      // General case for malformed or invalid token
      return res.status(401).json({ message: 'Invalid token', error: err.message });
    }
  };
  
 // Make sure to export it as a function


module.exports={isAdmin,authenticateJWT,authenticateAdmin}