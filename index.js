var express = require("express");
var app = express();
var fs = require("fs");
const { spawn } = require("child_process");
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


const PORT = process.env.PORT || 3000;
app.get("/", function (req, res) {
  res.send("GET request to homepage");
});
app.post("/", function (req, res) {
  fs.writeFile("temp.py", req.body.code, function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
  var dataToSend;
  // spawn new child process to call the python script
  const python = spawn("python", ["temp.py"]);
  // collect data from script
  python.stdout.on("data", function (data) {
    console.log("Pipe data from python script ...");
    dataToSend = data.toString();
  });
  // in close event we are sure that stream from child process is closed
  python.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.send(dataToSend);
  });
});

app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});
