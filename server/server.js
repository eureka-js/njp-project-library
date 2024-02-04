const express = require("express");
const app = express();
const morgan = require("morgan");
const config = require("./config");
const mysql = require("promise-mysql");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt-nodejs");
const path = require("path");
const pool = mysql.createPool(config.pool);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname, "/src"));

app.use(helmet());

app.use((req, res, next) => {
     res.setHeader("Access-Control-Allow-Origin", '*');
     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
     res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, \ Authorization");
     next();
});

app.use(morgan("dev"));

app.use("/authenticate", require("./app/routes/authenticate")(express, pool, jwt, config.secret, bcrypt));
app.use("/api", require("./app/routes/api")(express, pool, jwt, config.secret));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, "/src/app/index.html")));

app.listen(config.port);
