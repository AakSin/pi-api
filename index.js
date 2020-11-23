var express = require("express");
var app = express();
const PORT = process.env.PORT || 3000;
app.get("/", function (req, res) {
  res.send("GET request to homepage");
});
app.get("/:code",function(req, res){
    res.send(req.params.code);
});


app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});
