require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const config = require('./config');

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PATCH, PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept, Authorization');
    next();
});

app.use(morgan('dev', {
    skip: function (req, res) {
        return res.statusCode < 400
    }, stream: process.stderr
}));

app.use(morgan('dev', {
    skip: function (req, res) {
        return res.statusCode >= 400
    }, stream: process.stdout
}));

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('lolsight BE!')
});

app.use('/', require('./routes/champions'));
app.use('/', require('./routes/summoner'));
app.use('/', require('./routes/matches'));


app.use(function (req, res) {
    console.log(`Client sent a request to ${req.originalUrl}, which does not exist`);
    res.status(404).send({ success: false, message: 'Route not found!' });
});

process.on('uncaughtException', err => {
    console.error(`Global error (uncaught exception) ${err}`);
    console.error('Stack trace', err.stack);
    process.exit(1);
});

app.listen(config.lol_port);
console.log(`Server is running on port ${config.lol_port}`);
