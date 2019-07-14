const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

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

//____________________SERVER____________________//
app.listen(PORT, () => {
  console.log(`Alive on http://localhost:${PORT} 🦖`);
});
