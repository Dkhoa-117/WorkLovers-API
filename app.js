const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//IMPORT ROUTES
// app.use('/uploads', express.static('uploads'));
const userRoutes = require('./routes/userRouters');
const notificationRoutes = require('./routes/notificationRouters');
const payrollRoutes = require('./routes/payrollRouters');
const dayoffRoutes = require('./routes/dayoffRouters');

app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payrolls', payrollRoutes);
app.use('/api/dayoffs', dayoffRoutes);

app.use(notFound);
app.use(errorHandler);

//GET
app.get('/', (req, res) => {
  res.send('API is running...');
})

//Connect to DB
mongoose.connect(process.env.DB_CONNECTION, () =>
  console.log('CONNECT TO DATABASE!')
);

//create new table in mongoose
// var MongoClient = mongoose.createConnection(process.env.DB_CONNECTION);
// MongoClient.createCollection("newdb");
// var myobj = { name: "Company Inc", address: "Highway 37" };
// MongoClient.collection("newdb").insertOne(myobj);

//Listening
const port = process.env.PORT || 3000;
app.listen(port);
