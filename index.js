const express = require("express");
const app = express();
const fs = require("fs");
const { spawn } = require("child_process");
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors())
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


const PORT = process.env.PORT || 3001;
app.get("/", function (req, res) {
  res.send("GET request to homepage");
});
app.post("/", function (req, res) {
  let variables={
    first:req.body.first,
    second:req.body.second
  }
  fs.writeFile("temp.py", req.body.code, function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
  var dataToSend;
  // spawn new child process to call the python script
  const python = spawn("python", ["temp.py",variables.first,variables.second]);
  // collect data from script
  
  python.stdout.on("data", function (data) {
    console.log("Pipe data from python script ...");
    dataToSend = data.toString();
    dataToSend=dataToSend.substring(0,dataToSend.length-1)
  });
  // in close event we are sure that stream from child process is closed
  python.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.json({output:dataToSend});
  });
});

app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});
