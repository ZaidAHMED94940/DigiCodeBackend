const express = require("express");
const Problem = require("../model/ProblemModel");
const { authenticateJWT, authenticateAdmin } = require('../middleware/authorization');
const router = express.Router();

// POST /api/problems/add
router.post('/add', authenticateAdmin,authenticateJWT, async (req, res) => {
    const { name,title, description, input, output, solution, difficulty, createdBy } = req.body;

    // Ensure all required fields are provided
    if (!name || !title || !description || !input || !output || !solution || !difficulty || !createdBy) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Create a new problem object
        const newProblem = new Problem({ 
            name,   // Ensure ProblemNumber is coming from the request body
            title,
            description,
            input,
            output,
            solution,
            difficulty,
            createdBy: req.user._id,  // req.user is set by the authentication middleware
        });

        // Save the new problem to the database
        await newProblem.save();

        // Return the newly created problem
        res.status(201).json({
            message: "Problem created successfully",  // Corrected the typo here
            problem: newProblem
        });

    } catch (err) {
        // Return error if something goes wrong
        console.error(err);  // You can log the error for debugging
        res.status(500).json({
            message: "Error creating problem", 
            error: err.message
        });
    }
});

module.exports = router;
