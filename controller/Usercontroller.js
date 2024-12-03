const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../model/UserModel"); // Assuming userModel.js is in the 'models' folder
const router = express.Router();
const jwt=require("jsonwebtoken")
const {authenticateJWT,isAdmin}=require("../middleware/authorization")
const JWT_SECRET=`${process.env.JWT_SECRET}`

router.post("/admin/register", authenticateJWT, isAdmin, async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user (admin or user based on role passed)
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role, // Set to admin or user based on input
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  console.log("Request Body:", req.body); // Log incoming request data

  if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
  }

  try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      console.log("Existing User:", existingUser); // Log existing user
      if (existingUser) {
        console.log("User already exists, sending response");
        return res.status(404).json({ message: "User already exists" });
      }

      // Hash the password and create new user
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
          name,
          email,
          password: hashedPassword,
          role: "user"
      });

      await user.save();

      res.status(201).json({ message: "User created successfully" });
  } catch (err) {
      console.error("Error while registering user:", err);
      res.status(500).json({ message: "Server error" });
  }
});


  router.get("/all",async(req,res)=>{
    try {
      const users = await User.find(); // Fetch all users
      res.status(200).json(users);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
      const user = await User.findById(id);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
      const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;
      
      const updatedUser = await User.findByIdAndUpdate(
          id,
          { name, email, password: hashedPassword || undefined },
          { new: true } // Return the updated user
      );

      if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;  // The user ID is passed as part of the URL, not as a query string
  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/admin", authenticateJWT, isAdmin, (req, res) => {
  res.status(200).json({ message: "Welcome, Admin!" });
});

// Initialize the database with a default admin user if none exists


module.exports = router;
