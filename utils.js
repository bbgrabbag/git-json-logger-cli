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
const trimTrailingNewline = (str) => str.replace(/\n/, '');
const extractAttrFromLog = (log, attr) => {
    const lines = log.split(`\n`);
    const line = lines.find(line => line.includes(attr));
    return line.split(' ').slice(1).join(' ').trim();
}
const parseRemoteRepos = (str) => {
    if (!str) return [];
    return str.trim().split('\n').map(s => {
        const [name, url] = s.split('\t');
        return { name, url };
    });
}

module.exports = {
    execPromise,
    handleError,
    trimTrailingNewline,
    extractAttrFromLog,
    parseRemoteRepos
}