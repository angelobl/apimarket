const express = require("express");
const app = express();
const morgan = require("morgan");
var cors = require("cors");
var http = require("http");
const session = require("express-session");
var flash=require("connect-flash");
const path = require("path")

require("dotenv").config()
require("./database");

//Setting
app.set("port",  process.env.PORT);

var corsOptions = {
  exposedHeaders: "Authorization,Content-Type"
}

//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(
  session({
    secret: "session1",
    resave: false,
    saveUninitialized: false
  })
);
app.use(flash());
app.use(express.static(path.join(__dirname, "uploads")))
app.use(express.static(path.join(__dirname, "client", "build")))

//app.use(logger);

//routes
app.use("/products", require("./routes/products.routes"));
app.use("/users", require("./routes/users.routes"));
app.use("/sales", require("./routes/sales.routes"));



//Sockets
var server = http.createServer(app);
const io = require("socket.io")(server);

io.on("connection", client => {
  console.log("Socket conectado " + client.id);
  let user = null;
  //console.log(client)

  client.on("userLogged", data => {
    client.broadcast.emit("user", data);
    user = data;
  });

  client.on("newMessage", data => {
    io.emit("showMessage", data);
  });

  client.on("disconnect", () => {
    client.broadcast.emit("userDisconnected", user);
    console.log("Socket desconectado " + client.id);
    console.log(user);
  });
});


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});


//Server
server.listen(app.get("port"), () => {
  console.log("server on port 4000");
});
