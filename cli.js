#!/usr/bin/env node

/* eslint-disable strict */

'use strict';

const Command = require('commander').Command;
const clc = require('cli-color');
const pkg = require('./package.json');
const installPeerDeps = require('./installPeerDeps');

const program = new Command('install-peerdeps');
const errorText = clc.red.bold('ERR');
const successText = clc.green.bold('SUCCESS');

const name = pkg.name;
const version = pkg.version;

function printPackageFormatError() {
  console.log(`${errorText} Please specify the package to install with peerDeps in the form of \`package\` or \`package@n.n.n\``);
  console.log(`${errorText} At this time you must provide the full semver version of the package.`);
  console.log(`${errorText} Alternatively, omit it to automatically install the latest version of the package.`);
}

program
  .version(version)
  .description('Installs the specified package along with correct peerDeps.')
  .option('-d, --dev', 'Install the package as a devDependency')
  .usage('<package>[@<version>], default version is \'latest\'')
  .parse(process.argv);

console.log(clc.bold(`${name} v${version}`));

if (program.args.length > 1) {
  console.log(`${errorText} Please specify only one package at a time to install with peerDeps.`);
  process.exit(1);
}

if (program.args.length === 0) {
  console.log(`${errorText} Please specify a package to install with peerDeps.`);
  program.help();
  process.exit(1);
}

const packageString = program.args[0];
// eslint-disable-next-line no-useless-escape
const parsed = packageString.match(/^@?([\/\w-]+)(@([\d\.\w]+))?$/);
let packageName;
if (packageString[0] === '@') {
  packageName = `@${parsed[1]}`;
} else {
  packageName = parsed[1];
}
const packageVersion = parsed[3];

if (!packageName) {
  printPackageFormatError();
  process.exit(1);
}

installPeerDeps(packageName, packageVersion || 'latest', program.dev, (err) => {
  if (err) {
    console.log(`${errorText} ${err.message}`);
    process.exit(1);
  }
  console.log(`${successText} ${packageName} and its peerDeps were installed successfully.`);
  process.exit(0);
});
