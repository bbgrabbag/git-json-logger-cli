const childProcess = require('child_process');

const execPromise = (command) => new Promise((res, rej) => {
    childProcess.exec(command, (err, stdout, stderr) => {
        if (err) return rej(err);
        if (stderr) return rej(stderr);
        return res(stdout);
    })
});

const handleError = (err) => {
    console.log(err);
    process.exit(1);
}
const trimTrailingNewline = (str) => str.replace(/\n/, '')

module.exports = {
    execPromise,
    handleError,
    trimTrailingNewline
}