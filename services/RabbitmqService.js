const amqp = require('amqplib');
const rabbitMQUrl = 'amqp://localhost'; // RabbitMQ URL

let channel, connection;

async function connectToRabbitMQ() {
    try {
        connection = await amqp.connect(rabbitMQUrl);
        channel = await connection.createChannel();
        await channel.assertQueue('codeExecutionQueue', { durable: true });
        await channel.assertQueue('codeResultsQueue', { durable: true });
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        process.exit(1);
    }
}

connectToRabbitMQ();

const sendToQueue = (job) => {
    channel.sendToQueue('codeExecutionQueue', Buffer.from(JSON.stringify(job)), {
        persistent: true
    });
};

module.exports = { sendToQueue };
