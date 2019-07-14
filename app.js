const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const keys = require('./config/keys');

const app = express();
const PORT = 2626;

//__________________MIDDLEWARES__________________//

// morgan
app.use(morgan('dev'));

// bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

//____________________ROUTES____________________//
app.use('/users', require('./routes/users'));

//___________________DATABASE___________________//
mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true }, () => {
  console.log('Connected to MongoDB');
});
mongoose.set('useCreateIndex', true);

//____________________SERVER____________________//
app.listen(PORT, () => {
  console.log(`Alive on http://localhost:${PORT} 🦖`);
});
