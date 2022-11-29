const OUTPUT_DIRECTORY = process.cwd();
const OUTPUT_FILENAME = 'git-metadata.json';
const OUTPUT_DIR_FLAG = '--outdir';
const OUTPUT_FILE_FLAG = '--outfile';
const HELP_FLAG = '--help';
const FLAGS = [
    OUTPUT_DIR_FLAG,
    OUTPUT_FILE_FLAG,
    HELP_FLAG
]

module.exports = {
    OUTPUT_DIRECTORY,
    OUTPUT_FILENAME,
    OUTPUT_DIR_FLAG,
    OUTPUT_FILE_FLAG,
    HELP_FLAG,
    FLAGS
}