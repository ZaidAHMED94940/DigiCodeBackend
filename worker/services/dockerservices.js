const Docker = require('dockerode');
const docker = new Docker();

const runPython = (code) => {
    return new Promise((resolve, reject) => {
        const tempFilePath = '/code/temp.py';
        docker.createContainer({
            Image: 'python:3.9',
            Cmd: ['python', '/code/temp.py'],
            AttachStdout: true,
            AttachStderr: true,
            Volumes: { '/code': {} },
            HostConfig: {
                Binds: [`${tempFilePath}:/code/temp.py`],
            },
        })
            .then(container => {
                container.start()
                    .then(() => container.wait())
                    .then(() => container.logs({ follow: true, stdout: true, stderr: true }))
                    .then(logs => resolve(logs.toString()))
                    .catch(reject);
            })
            .catch(reject);
    });
};

// Similarly, implement runJava() and runCPlusPlus() methods...
module.exports={runPython}
