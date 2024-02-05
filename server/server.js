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

app.use(express.static(path.join(__dirname, "../dist/njp-project")));

app.use(helmet());

app.use((req, res, next) => {
     res.setHeader("Access-Control-Allow-Origin", '*');
     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
     res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type, \ Authorization");
     next();
});

app.use(morgan("dev"));

app.use("/authenticate", require("./app/routes/authenticate")(app, express, pool, jwt, config.secret, bcrypt));
app.use("/api", require("./app/routes/api")(app, express, pool, jwt, config.secret. bcrypt));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, "../dist/njp-project/index.html")));

app.listen(config.port);
