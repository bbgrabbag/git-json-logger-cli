# Git JSON Logger CLI

## Easily generate metadata file containing basic git repo information
---

### Get Started
- `npm i -D git-json-logger-cli`

- `git-logger [--outdir <directory>] [--outfile <filename>]`
    - Outputs a file called `<filename>` in directory `<directory>` containing the following git repository metadata:
        - Current user
        - Current branch
        - Latest commit hash
        - Date of last commit
        - Remote url's

- It is recommended to put this script in your project's `package.json` as an npm script. It can then be used as part of a `pre-*` script as part of a React project for example:
```json
// package.json
{
    //...
    "scripts": {
        "git-logger": "git-logger",
        // generate metadata file automatically before every build:
        "prebuild": "git-logger --outfile my-git-metadata.json",
        "build": "react-scripts build"
    }
}
```
> **Warning** 
>
> Make sure the project directory in question is a git repository, otherwise a script error will occur.

### API Reference

```
git-logger [--outdir <directory>] [--outfile <filename>]
```

Option&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Default&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
--- | --- | --- 
`--outfile` | Name of metadata file to output. Will be placed in the directory defined for option `--outdir` | `git-metadata.json`
`--outdir` | Name of directory for metadata file to be placed in. | directory of current process, `process.cwd()`

#### Example Output
```json
// git-metadata.json
{
    "user": "John Doe <jdoe@email.com>",
    "branch": "master",
    "commit": "cc8e1242bf20a676d73f88024cf410b686e7c955",
    "date": "2022-12-08T19:02:03.000Z",
    "remotes": [
        {
            "name": "origin",
            "url": "<url> (fetch)"
        },
        {
            "name": "origin",
            "url": "<url> (push)"
        }
    ]
}
```