const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const httpPort = 5001;
const evenementRoutes = require("./routes/evenement");
const commentRoutes = require('./routes/commentRoutes');
const morgan = require('morgan');

const lessonRoutes = require('./routes/lesson');
const itemroutes = require('./routes/itemsRoute');
const app = express();

  
  const mongoUrl = "mongodb+srv://damarjy:HouHou1432@cluster0.tayz7nb.mongodb.net/ecolink";

  mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });


// Use Morgan for logging
app.use(morgan('dev'));
//Parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
const verifyuser = require('./routes/verificationTokenRoutes');
app.use('/api/verify', verifyuser);
const userRouter = require('./routes/userRoutes');
app.use('/api/users', userRouter);
app.use('/comments', commentRoutes); // Include Comment Routes
app.use('/', lessonRoutes);
app.use('/apis', itemroutes);
app.use("/api", evenementRoutes);
app.listen(httpPort, () => {
	console.log("Server is running on port " + httpPort);
})

