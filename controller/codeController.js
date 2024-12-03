const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); // Ensure UUID is imported
const rabbitMQService = require('../services/RabbitmqService');

// POST route for running code
router.post('/run-code', async (req, res) => {
    const { code, language } = req.body;

    // Validate that code and language are provided
    if (!code || !language) {
        return res.status(400).json({ message: 'Code and language are required' });
    }

    try {
        const callbackQueue = `callback-${uuidv4()}`;
        // Send the code and language to RabbitMQ service
        await rabbitMQService.sendToQueue({ code, language, callbackQueue });

        // Listening for the result from the worker via RabbitMQ
        rabbitMQService.getChannel().consume(callbackQueue, (msg) => {
            const result = JSON.parse(msg.content.toString());
            res.json(result);
            rabbitMQService.getChannel().ack(msg); // Acknowledge that the message has been processed
        }, { noAck: false });

    } catch (error) {
        res.status(500).json({ message: 'Error processing request', error: error.message });
    }
});

module.exports = router;
