#!/usr/bin/env node
import { spawn } from 'child_process';
import net from 'net';
import kill from 'kill-port';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import open from "open";

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

async function startAdmin() {
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

async function killAdmin(port = 5012) {
    kill(port, 'tcp')
        .then(console.log)
        .catch(console.log)
}

function openDashboard() {
    open("http://localhost:3000");
}

function startDashboard() {
    const childProcess = spawn('node', ['dashboard-main.js'], {
        detached: true,
        stdio: 'ignore',
    });

    childProcess.unref();
}

async function killDashboard(port = 3000) {
    kill(port, 'tcp')
        .then(console.log)
        .catch(console.log)
}

yargs(hideBin(process.argv))
    .demandCommand()
    .scriptName("tartigraid")
    .command('dashboard [command]', 'Dashboard server', (yargs) => {
        return yargs
            .command("start", 'Start the dashboard server', (yargs) => {
                return yargs
            }, () => {
                console.log("starting to serve")
                startDashboard();
            })
            .command("show", 'Start the dashboard server', (yargs) => {
                return yargs
            }, () => {
                console.log("starting to serve")
                openDashboard();
            })
            .command('kill', 'Start the dashboard server', (yargs) => {
                return yargs
            }, (argv) => {
                console.log("killing the server")
                killDashboard();
            }).demandCommand()
    })
    .command('manager', 'Sniffer manager', (yargs) => {
        return yargs
            .command("start", (yargs) => yargs, (argv) => {
                startAdmin();
            })
            .command("kill", (yargs) => yargs, (argv) => {
                killAdmin();
            })
    })
    .parse()
