const { spawn } = require("child_process");
const exec = require("util").promisify(require("child_process").exec);
const psTree = require("ps-tree");

// Check if a command is provided as an argument
if (process.argv.length < 3) {
  console.log("Usage: node run-command.js <command>");
  process.exit(1);
}

// Get the command from the command-line arguments
const command = process.argv.slice(2).join(" ");

// Run the command as a child process
const childProcess = spawn(command, {
  shell: true, // Use the system shell to execute the command
  stdio: "inherit", //'inherit' // Use the same stdio as the parent process (console)
});

console.log("the subprocess pid is " + childProcess.pid);
console.log("the current process pid is " + process.pid);

async function isPortOpen(childPid) {
  try {
    const { stdout } = await exec(`lsof | grep LISTEN | grep ${childPid}`);
    const includes = stdout.includes(`${childPid}`);

    if (includes) {
      const ports = Array.from(stdout.matchAll(/:(\d+)/g)).map((m) => +m[1]);
      console.log(ports);
    }

    return includes;
  } catch (error) {
    return false;
  }
}

// Handle child process events
childProcess.on("exit", (code) => {
  console.log(`Child process exited with code ${code}`);
});

childProcess.on("error", (err) => {
  console.error("Child process error:", err);
});

// Example usage:
const targetPid = process.pid; // Get the target PID from the command line arguments

const interval = setInterval(async () => {
  psTree(targetPid, async (err, children) => {
    if (err) {
      console.error("Error:", err);
      return;
    }

    const childrenWithPort = await Promise.all(
      children.map(async (child) => {
        return {
          isOpen: await isPortOpen(child.PID),
          pid: child.PID,
        };
      }),
    );

    const openChildrenWithPort = childrenWithPort.filter(
      (child) => child.isOpen,
    );
    console.log(JSON.stringify(openChildrenWithPort));
  });
}, 1000);
