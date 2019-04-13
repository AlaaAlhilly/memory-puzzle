const express = require("express");
const path = require("path");
let router = express.Router();
let mongoose = require('mongoose')
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
mongoose.Promise = Promise;

const PORT = process.env.PORT || 3001;
const app = express();
// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
app.use((req, res, next) => {
  res.header({ 'Access-Control-Allow-Origin': '*' })
  res.header({ 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE' });
  res.header({ 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept' })
  next();
});  

const DBURL = process.env.MONGODB_URI || "mongodb://localhost/high_scores";
mongoose.connect(DBURL, (err) => {
  if (err) { console.log(err); return; }
  console.log("connected to MONGO");
})
let db = mongoose.connection;

db.on("error", function(error) {
console.log(" Error: ", error);
});

db.once("open", function() {
console.log(" connected.");
});
// Use apiRoutes
require('./server/routes')(router);
app.use(router);
// Send every request to the React app
// Define any API routes before this runs
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"), (err) => {
    console.log('inside the server');
    if (err) res.status(500).send(err)
  });
});
// const server = http.createServer(app);
// const io = socketIo(server);
var server = app.listen(PORT);
var io = require('socket.io').listen(server);
io.on("connection", socket => {
  console.log("New client connected"), setInterval(
    () => getApiAndEmit(socket),
    10000
  );
  socket.on("disconnect", () => console.log("Client disconnected"));
});
const getApiAndEmit = async socket => {
  try {
    const res = await axios.get(
      "https://memory-game-10.herokuapp.com/api/high_scores"
    );
    socket.emit("FromAPI", res.data);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

