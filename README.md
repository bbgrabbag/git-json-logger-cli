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

> **Warning**
Make sure the directory in question contains a `.git` folder and is a git repository, otherwise a script error will occur.

### API Reference

```
git-logger [--outdir <directory>] [--outfile <filename>]
```

Option | Description | Default
------ | ----------- | ------- 
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