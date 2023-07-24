#!/usr/bin/env node
import axios from "axios";
import { spawn } from "child_process";
import kill from "kill-port";
import net from "net";
import open from "open";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const snifferManagerAxios = axios.create({ baseURL: "http://localhost:5012" });

function checkAdminPort(port = 5012) {
  return new Promise((resolve) => {
    const tester = net.createConnection({ port }, () => {
      tester.end();
      resolve(true);
    });

    tester.on("error", () => {
      resolve(false);
    });
  });
}

async function startAdmin() {
  const isAdminPortAvailable = await checkAdminPort();
  console.log("Admin port available: " + isAdminPortAvailable);

  if (isAdminPortAvailable) {
    console.log("Port 5012 is already taken");
    return;
  }

  const childProcess = spawn("npm", ["run", "sniffer"], {
    detached: true,
    stdio: "ignore",
  });

  childProcess.unref();
}

async function killAdmin(port = 5012) {
  kill(port, "tcp")
    .then(() => console.log("Admin is killed"))
    .catch((e) => {
      console.log("Failed to kill admin");
      console.error(e.message);
    });
}

function startDashboard() {
  const childProcess = spawn("node", ["dashboard-main.mjs"], {
    detached: true,
    stdio: "ignore",
  });

  childProcess.unref();
}

function openDashboard(port = 3000) {
  open(`http://localhost:${port}`);
}

async function killDashboard(port = 3000) {
  kill(port, "tcp")
    .then(() => console.log("Dashboard is killed"))
    .catch((e) => {
      console.log("Failed to kill the dashboard");
      console.error(e.message);
    });
}

async function createSniffer(port, downstreamUrl, name) {
  const sniffers = await snifferManagerAxios
    .post(
      "/sharkio/sniffer",
      {
        name,
        port,
        downstreamUrl,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
    .then((res) => res.data);

  console.log(JSON.stringify(sniffers));
}

async function listSniffers() {
  await snifferManagerAxios.get("/sharkio/sniffer").then((res) => {
    console.log(JSON.stringify(res.data));
  });
}

async function startSniffer(port) {
  await snifferManagerAxios
    .post(`sharkio/sniffer/${port}/actions/start`)
    .then((res) => {
      console.log(JSON.stringify(res.data));
    })
    .catch((e) => {
      console.error("Failed to start sniffer");
    });
}

async function stopSniffer(port) {
  await snifferManagerAxios
    .post(`sharkio/sniffer/${port}/actions/stop`)
    .then((res) => {
      console.log(JSON.stringify(res.data));
    })
    .catch((e) => {
      console.error("Failed to stop sniffer");
    });
}

async function removeSniffer(port) {
  await snifferManagerAxios
    .delete(`sharkio/sniffer/${port}`)
    .then((res) => {
      console.log(JSON.stringify(res.data));
    })
    .catch((e) => {
      console.error("Failed to remove sniffer");
    });
}

yargs(hideBin(process.argv))
  .demandCommand()
  .scriptName("")
  .command(
    "start",
    "Start dashboard and proxy manager",
    (yargs) => {
      return yargs;
    },
    async (argv) => {
      await startAdmin();
      await startDashboard();
      await openDashboard();
    },
  )
  .command("dashboard [command]", "Dashboard server", (yargs) => {
    return yargs
      .command(
        "start",
        "Starting dashboard server",
        (yargs) => {
          return yargs;
        },
        () => {
          console.log("Starting dashboard server");
          startDashboard();
        },
      )
      .command(
        "open",
        "Open the dashboard",
        (yargs) => {
          return yargs;
        },
        () => {
          console.log("Opening dashboard server");
          openDashboard();
        },
      )
      .command(
        "kill",
        "Kill the dashboard server",
        (yargs) => {
          return yargs;
        },
        (argv) => {
          console.log("Killing the dashboard server");
          killDashboard();
        },
      )
      .demandCommand();
  })
  .command("admin [command]", "Proxy admin server", (yargs) => {
    return yargs
      .command(
        "sniffer [command]",
        "Proxy manager commands",
        (yargs) => {
          return yargs
            .command(
              "create [port] [downstreamUrl] [name]",
              "Create a new sniffer",
              (yargs) => {
                return yargs
                  .option("port")
                  .option("downstreamUrl")
                  .option("name")
                  .demandOption("port")
                  .demandOption("downstreamUrl")
                  .demandOption("name");
              },
              async (argv) => {
                console.log("Creating a new sniffer");

                await createSniffer(argv.port, argv.downstreamUrl, argv.name);
              },
            )
            .command(
              "list",
              "List sniffers",
              (yargs) => {
                return yargs;
              },
              async (argv) => {
                await listSniffers();
              },
            )
            .command(
              "start [port]",
              "Start a sniffer",
              (yargs) => {
                return yargs.option("port").demandOption("port");
              },
              async (argv) => {
                await startSniffer(argv.port);
              },
            )
            .command(
              "stop [port]",
              "Stop a sniffer",
              (yargs) => {
                return yargs.option("port").demandOption("port");
              },
              async (argv) => {
                await stopSniffer(argv.port);
              },
            )
            .command(
              "remove [port]",
              "Stop a sniffer",
              (yargs) => {
                return yargs.option("port").demandOption("port");
              },
              async (argv) => {
                await removeSniffer(argv.port);
              },
            );
        },
        (argv) => {},
      )
      .command(
        "start",
        "Start admin server",
        (yargs) => {
          return yargs;
        },
        () => {
          console.log("Starting admin servers");
          startAdmin();
        },
      )
      .command(
        "kill",
        "Kill the admin server",
        (yargs) => {
          return yargs;
        },
        (argv) => {
          console.log("Killing the admin server");
          killAdmin();
        },
      )
      .demandCommand()
      .demandCommand();
  })
  .parse();
