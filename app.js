const express = require('express');
const morgan = require('morgan');

const app = express();
const PORT = 2626;

//__________________MIDDLEWARES__________________//

// morgan
app.use(morgan('dev'));

// bodyparser
app.use(express.urlencoded({ extended: false }));

//____________________ROUTES____________________//
app.use('/users', require('./routes/users'));

//____________________SERVER____________________//
app.listen(PORT, () => {
  console.log(`Alive on http://localhost:${PORT} 🦖`);
});
