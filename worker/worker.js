const amqp = require('amqplib');
const dockerService = require('./services/dockerService');
const rabbitMQUrl = 'amqp://localhost';

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

channel.consume('codeExecutionQueue', async (msg) => {
    const job = JSON.parse(msg.content.toString());
    const { code, language, callbackQueue } = job;

    try {
        let result;
        if (language === 'python') {
            result = await dockerService.runPython(code);
        } else if (language === 'java') {
            result = await dockerService.runJava(code);
        } else if (language === 'cpp') {
            result = await dockerService.runCPlusPlus(code);
        }

        const response = { result };
        channel.sendToQueue(callbackQueue, Buffer.from(JSON.stringify(response)), { persistent: true });
        channel.ack(msg);
    } catch (error) {
        console.error('Error executing code:', error);
        channel.ack(msg);
    }
});
