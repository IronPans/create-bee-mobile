const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const ora = require('ora');
const dns = require('dns');
const spawn = require('cross-spawn');
const currentPath = path.join(__dirname, '../');
let projectName = '';
let projectType = 'ts';
let spinner = null;
let readmeExists = false;

function createApp(name, type) {
    projectName = name;
    const root = path.resolve(name);
    const appName = path.basename(root);
    projectType = type ? 'js' : 'ts';

    fs.ensureDirSync(name);

    console.log(`Creating a new app in ${chalk.green(root)}.`);

    const originalDirectory = process.cwd();
    process.chdir(root);

    createTemplate(root).then(info => {
        //spinner = ora(chalk.green('Installing Dependencies...'));
        console.log();

    updateName()
        .then(() => {
        install().then(() => {
        //spinner.stop();
            const displayedCommand = 'npm';

            console.log();
            console.log(`Success! Created ${appName} at ${chalk.green(root)}`);
            console.log('Inside that directory, you can run several commands:');
            console.log();
            console.log(chalk.cyan(`  ${displayedCommand} start`));
            console.log('    Starts the development server.');
            console.log();
            console.log(
                chalk.cyan(`  ${displayedCommand} run build:prod`)
            );
            console.log('    Bundles the app into static files for production.');
            console.log();
            console.log('We suggest that you begin by typing:');
            console.log();
            console.log(chalk.cyan('  cd'), projectName);
            console.log(`  ${chalk.cyan(`${displayedCommand} start`)}`);
            if (readmeExists) {
                console.log();
                console.log(
                    chalk.yellow(
                        'You had a `README.md` file, we renamed it to `README.old.md`'
                    )
                );
            }
            console.log();
            console.log('Happy hacking!');
            process.exit()
            }).catch(err => {
                console.error(
                `Could not install dependencies: ${chalk.red(err)}`
            );
        })

    }).catch(err => {
            console.error(
            `Could not update name: ${chalk.red(err)}`
        );
    })
        //spinner.start();
    }).catch(err => {
        const templatePath = path.join(currentPath, 'template' + `/${projectType}`);
        console.error(
            `Could not locate supplied template: ${chalk.red(templatePath)}`
        );
    })
}

function createTemplate(root) {
    return new Promise((resolve, reject) => {
        readmeExists = fs.existsSync(path.join(root, 'README.md'));
        if (readmeExists) {
            fs.renameSync(
                path.join(root, 'README.md'),
                path.join(root, 'README.old.md')
            );
        }

        const templatePath = path.join(currentPath, 'template' + `/${projectType}`);
        if (fs.existsSync(templatePath)) {
            fs.copySync(templatePath, root);
            resolve('success');
        } else {
            console.error(
                `Could not locate supplied template: ${chalk.green(templatePath)}`
            );
            reject('Could not locate supplied template.');
        }
    })
}

function updateName() {
    return new Promise((resolve, reject) => {
        const pathName = path.resolve(process.cwd(), './package.json');
        try {
            if (fs.existsSync(pathName)) {
                const packageJson = JSON.parse(fs.readFileSync(pathName));
                packageJson.name = projectName;
                fs.writeFileSync(pathName, JSON.stringify(packageJson, null, 2), 'utf-8');
            } else {
                fs.writeFileSync(pathName, JSON.stringify({
                    name: projectName
                }, null, 2));
            }
            resolve();
        } catch (e) {
            console.log(chalk.red("\n出现异常"))
            console.log(e);
            console.log(chalk.red('\n × Generation failed!'));
            reject();
            process.exit();
        }
    })
}

function install() {
    return new Promise((resolve, reject) => {
        let command = 'npm';
        let args = [
            'install'
        ];

        const child = spawn(command, args, { stdio: 'inherit' });
        child.on('close', code => {
            if (code !== 0) {
                reject({
                    command: `${command} ${args.join(' ')}`,
                });
                return;
            }
            resolve();
        });
    })
}

module.exports = {
    createApp
};

