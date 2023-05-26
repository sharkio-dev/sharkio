#!/usr/bin/env node

const { spawn } = require('child_process');
const net = require('net');
const axios = require('axios');
const kill = require('kill-port')
const yargs = require("yargs");
const { hideBin } = require('yargs/helpers');
const { SnifferManagerController } = require('traffic-sniffer');

let snifferManger = SnifferManagerController();

// Replace 'npm install express' with the npm command you want to run
function startDashboard() {
    const childProcess = spawn('node', ['dashboard-main.js'], {
        detached: true,
        stdio: 'ignore',
    });

    childProcess.unref();
}

async function startSniffer() {
    const isAdminPortAvailable = await checkAdminPort();
    console.log("Admin port available = " + isAdminPortAvailable);

    if (isAdminPortAvailable) {
        console.log("Port 5012 is already taken");
        return;
    }

    const childProcess = spawn('node', ['sniffer-main.js'], {
        detached: true,
        stdio: 'ignore',
    });

    childProcess.unref();
}

function checkAdminPort(port = 5012) {
    return new Promise((resolve) => {
        const tester = net.createConnection({ port }, () => {
            tester.end();
            resolve(true);
        });

        tester.on('error', () => {
            resolve(false);
        });
    });
}

async function killAdmin(port = 5012) {
    kill(port, 'tcp')
        .then(console.log)
        .catch(console.log)
}

async function killDashboard(port = 3000) {
    kill(port, 'tcp')
        .then(console.log)
        .catch(console.log)
}

yargs(hideBin(process.argv))
    .demandCommand()
    .command('dashboard start', 'Start the dashboard server', (yargs) => {
        return yargs
    }, (argv) => {
        console.log("starting to serve")
        startDashboard();
    })
    .command('dashboard kill', 'Start the dashboard server', (yargs) => {
        return yargs
    }, (argv) => {
        console.log("killing the server")
        killDashboard();
    })
    .command('manager', 'Sniffers manager')
    .parse()
