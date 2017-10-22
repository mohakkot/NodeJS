const express = require('express'),
     http = require('http');
const bodyParser = require('body-parser');
const dishRouter = require('./routes/dishRouter');
const leaderRouter = require('./routes/leaderRouter');
const promoRouter = require('./routes/promoRouter');
const hostname = 'localhost';
const port = 3000;
const app = express();


app.use(bodyParser.json());
app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);
const morgan = require('morgan');
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

const server = http.createServer(app);
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});