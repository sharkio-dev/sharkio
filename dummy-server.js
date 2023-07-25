const express = require("express");
const app = express();

/**
 * - 3000 port is for the dummy server to run on
 * - 5432 is a proxy
 */
let config = {
  defaultPort: 3000,
};

/**
 * This is just a dummy `test-server` to ensure sniffing is working properly
 *
 * Access this API via http://localhost:5432 through postman
 */

app.get("*", async (_req, res) => {
  try {
    res.json({ messaage: "Checkout Sniffer, API logs would be made" });
  } catch (error) {
    console.error(error.message);
    res.json({ messaage: "API call failed" });
  }
});

init = (port) => {
  app.listen(port, () => {
    console.log(`Dummy 'test-server' Server is running on port ${port}`);
  });
};

// Attempt to start the server on the default port
init(config.defaultPort);

app.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    const alternativePort = defaultPort + 1;
    console.log(
      `Port ${defaultPort} is already in use. Trying port ${alternativePort} to initialize dummy test-server...`,
    );
    init(alternativePort);
  } else {
    console.error(err);
  }
});
