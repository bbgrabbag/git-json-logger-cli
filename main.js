#!/usr/bin/env node

const childProcess = require('child_process');
const fs = require('fs/promises');
const path = require('path');
const { execPromise, handleError, trimTrailingNewline } = require('./utils');
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
    // git folder
    // git version
}


const getMetadata = async () => {
    const getUserName = async () => {
        try {
            const user = await execPromise('git config --get user.name');
            return trimTrailingNewline(user)
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
            const hash = await execPromise(`git commit`)

        } catch (err) {
            handleError(err);
        }
    }

    // commit hash
    // commit date
    // branch
    const user = await getUserName();
    const branch = await getCurrentBranch();
    return {
        user,
        branch
    }
}

(async () => {
    await validateGit();
    const { outdir, outfilename } = await validateArgs();
    const data = await getMetadata();
    await writeOutputFile(JSON.stringify(data), outdir, outfilename);
})()
