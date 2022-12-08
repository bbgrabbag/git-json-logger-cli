#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');
const { execPromise, handleError, trimTrailingNewline, extractAttrFromLog } = require('./utils');
const config = require('./config');
const { readdirSync } = require('fs');

const [, , ...args] = process.argv;

const writeOutputFile = async (data, dir, filename) => {
    try {
        await fs.writeFile(dir + '/' + filename, data);
        console.log(`'${filename}' created in ${dir}`);
        return true;
    } catch (err) {
        handleError(err)
    }
}

const validateArgs = async () => {

    const validateOutDirFlag = (dir) => {
        if (!dir)
            throw `Error: no directory path provided with option ${config.OUTPUT_DIR_FLAG}`;
        const files = readdirSync(dir);
        if (!files)
            throw `Error: Directory ${dir} not found`;
        return path.resolve(dir);
    };

    const validateOutFilenameFlag = (filename) => {
        if (!filename)
            throw `Error: no filename provided with option ${config.OUTPUT_FILE_FLAG}`;
        return filename;
    };

    const handleHelpFlag = () => {
        console.log(`
        git-log options 
        ---------------

        --outfile <filename>       Name of file to be created
        --outdir <directory path>  Location of directory where output file will be created
        `)
    }

    const flags = args.filter(arg => config.FLAGS.includes(arg));
    let outdir = config.OUTPUT_DIRECTORY;
    let outfilename = config.OUTPUT_FILENAME;

    flags.forEach(flag => {
        try {
            const indexOfFlag = args.indexOf(flag);
            const flagValue = args[indexOfFlag + 1];
            switch (flag) {
                case config.OUTPUT_DIR_FLAG:
                    outdir = validateOutDirFlag(flagValue);
                    return;
                case config.OUTPUT_FILE_FLAG:
                    outfilename = validateOutFilenameFlag(flagValue);
                    return;
                case config.HELP_FLAG:
                    handleHelpFlag();
                    process.exit(1);
                default:
                    process.exit(1);
            }
        } catch (err) {
            console.log(err);
            process.exit(1);
        }
    })
    return {
        outdir,
        outfilename
    }
}

const validateGit = async () => {
    try {
        const gitVersion = await execPromise('git --version');
        console.log('Found: ' + gitVersion);
        return true;
    } catch (err) {
        handleError(err)
    }
}

const getMetadata = async () => {
    const getUserName = async () => {
        try {
            const username = trimTrailingNewline(await execPromise('git config --get user.name'));
            const email = trimTrailingNewline(await execPromise('git config --get user.email'));
            return `${username} <${email}>`

        } catch (err) {
            handleError(err);
        }
    }

    const getCurrentBranch = async () => {
        try {
            const branch = await execPromise(`git branch --show-current`)
            return trimTrailingNewline(branch);
        } catch (err) {
            handleError(err);
        }
    }

    const getCommitHash = async () => {
        try {
            const log = await execPromise(`git log --max-count=1`);
            return extractAttrFromLog(log, 'commit');
        } catch (err) {
            handleError(err);
        }
    }

    const getCommitDate = async () => {
        try {
            const log = await execPromise(`git log --max-count=1`);
            return new Date(extractAttrFromLog(log, 'Date')).toISOString();
        } catch (err) {
            handleError(err);
        }
    }

    const getRemotes = async () => {
        try{
            const remotes = await execPromise('git remote -v')
            return remotes || [];
        } catch(err){
            handleError(err)
        }
    }

    const user = await getUserName();
    const branch = await getCurrentBranch();
    const commit = await getCommitHash();
    const date = await getCommitDate();
    const remotes = await getRemotes();

    return {
        user,
        branch,
        commit,
        date, 
        remotes
    }
}

(async () => {
    await validateGit();
    const { outdir, outfilename } = await validateArgs();
    const data = await getMetadata();
    await writeOutputFile(JSON.stringify(data), outdir, outfilename);
})()
