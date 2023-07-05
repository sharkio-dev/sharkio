const express = require('express');
const app = express();

/**
 * This is just a dummy `test-server` to ensure sniffing is working properly
 */
app.get("/", (_req, res) => {
  res.json("Hello, world!");
});

app.get("/:name", (req, res) => {
  res.json(`Hello, ${req.params.name}!`);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
