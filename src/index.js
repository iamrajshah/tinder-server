const express = require("express");

const app = express();

app.use("/hellp", (req, res) => {
  res.send("Hello, Hello!");
});
app.use("/test", (req, res) => {
  res.send("Hello, Test!");
});

app.use("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
