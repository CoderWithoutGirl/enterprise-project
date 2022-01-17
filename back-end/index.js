const express = require('express');
const dotenv = require("dotenv");
dotenv.config();

const morgan = require('morgan');
const cors = require('cors');
const errorhandler = require('errorhandler');
const helmet = require('helmet');
const app = express();

const PORT = process.env.PORT;
const dbService = require('./service/db');
const passport = require('passport');
const passportConfig = require('./middleware/authentication');
const expressSession = require('express-session');

const rootRouter = require('./router/index');

// Apply application middleware
app.use(passport.initialize());
app.use(cors({
    origin: "*",
    credentials: false,
}));
app.use(expressSession({secret: process.env.SECRET_KEY, saveUninitialized: false, resave: false}));
app.use(helmet());
app.use(morgan("dev"));
app.use(errorhandler());
app.use(express.json({urlEncoded: true}));
app.use(passport.session());

dbService.connect(process.env.DB_URL);

app.use('/api', rootRouter)

app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}, api version: ${process.env.API_VERSION}`);
});