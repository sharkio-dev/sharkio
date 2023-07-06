const express = require("express");
const app = express();
const axios = require("axios");

/**
 * - Provided 5432 as sniffer URL with assumption the sniffing is being read at this port
 * - 3000 port is for the dummy server to run on
 */
let config = {
  snifferLocalUrl: "http://localhost:5432/sharkio/sniffer/3000",
  defaultPort: 3000,
};

/**
 * This is just a dummy `test-server` to ensure sniffing is working properly
 */

app.get("*", async (_req, res) => {
  try {
    axios.get(config.snifferLocalUrl);
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
      `Port ${defaultPort} is already in use. Trying port ${alternativePort} to initialize dummy test-server...`
    );
    init(alternativePort);
  } else {
    console.error(err);
  }
});
