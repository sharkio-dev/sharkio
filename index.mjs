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

async function createSniffer() {

}

yargs(hideBin(process.argv))
    .demandCommand()
    .scriptName("")
    .command('dashboard [command]', 'Dashboard server', (yargs) => {
        return yargs
            .command("start", 'Starting dashboard server', (yargs) => {
                return yargs
            }, () => {
                console.log("Starting dashboard server");
                startDashboard();
            })
            .command('kill', 'Kill the dashboard server', (yargs) => {
                return yargs
            }, (argv) => {
                console.log("Killing the dashboard server")
                killDashboard();
            }).demandCommand()
    })
    .command('admin [command]', 'Dashboard server', (yargs) => {
        return yargs
            .command('sniffers [command]', 'Dashboard server', (yargs) => {
                return yargs
                    .command("create [port] [downstreamUrl]", 'Create a new sniffer', (yargs) => {
                        return yargs
                            .option("port")
                            .option("downstreamUrl")
                            .demandOption("port")
                            .demandOption("downstreamUrl")
                    }, (argv) => {
                        console.log("Creating a new sniffer")
                        //TODO create a sniffer
                    })
                    .command("list", 'List sniffers', (yargs) => {
                        return yargs
                    }, (argv) => {
                        console.log("Creating a new sniffer")
                        //TODO list sniffers
                    })
            },
                (argv) => {
                    console.log("Creating a new sniffera")
                }
            )
            .command("start", 'Start admin server', (yargs) => {
                return yargs
            }, () => {
                console.log("Starting admin servers");
                startAdmin();
            })
            .command('kill', 'Kill the admin server', (yargs) => {
                return yargs
            }, (argv) => {
                console.log("Killing the admin server");
                killAdmin();
            }).demandCommand()
            .demandCommand()
    })
    .parse()
