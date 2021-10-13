const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

//Give server access to environment varriables
dotenv.config();

//connection to mongoDB
mongoose.connect(process.env.MONGO_URI);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
