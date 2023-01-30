const express = require("express");
// var path = require("path");
const app = express();
var userRouter = require("./routes/user");
var db = require("./config/connection");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "hbs");

app.use("/", userRouter);

db.connect((err) => {
  if (err) console.log("connection error");
  else console.log("database connected");
});
app.listen(3001, () => console.log("server running at port 3001"));
