const express = require("express");

const morgan = require("morgan");
const cors = require("cors");
const errorhandler = require("errorhandler");
const helmet = require("helmet");
const app = express();
const { createClient } = require("redis");

const db = require("./persistance/db");
const passport = require("passport");
const passportConfig = require("./middleware/authentication");
const expressSession = require("express-session");

const rootRouter = require("./router/index");

app.use("/statics", express.static("statics"));

// Apply application middleware
app.use(passport.initialize());
app.use(
  cors({
    origin: "*",
    credentials: false,
  })
);
app.use(
  expressSession({
    secret: process.env.SECRET_KEY,
    saveUninitialized: false,
    resave: false,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(errorhandler());
app.use(express.json({ urlEncoded: true }));
app.use(passport.session());

db.connect(process.env.DB_URL);

app.use("/api", rootRouter);

module.exports = app;
