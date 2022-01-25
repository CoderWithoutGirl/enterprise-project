const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const morgan = require("morgan");
const cors = require("cors");
const errorhandler = require("errorhandler");
const helmet = require("helmet");
const app = express();
const { createClient } = require("redis");

const PORT = process.env.PORT;
const db = require("./persistance/db");
const passport = require("passport");
const passportConfig = require("./middleware/authentication");
const expressSession = require("express-session");

const rootRouter = require("./router/index");

(async () => {
  console.log(process.env.REDIS_HOST + process.env.REDIS_PORT);
  const client = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
  })

  await client.connect();
  console.log("connected");
  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.set("test", "OK");
  const value = await client.get("key");
})();

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

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
