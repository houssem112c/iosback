const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const httpPort = 5001;
const boutiqueRoutes = require("./routes/blog");

const evenementRoutes = require("./routes/evenement");
const lessonRoutes = require("./routes/projet");
const morgan = require('morgan');

const itemroutes = require('./routes/itemsRoute');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./middleware/swagger');
const app = express();
app.use('/images', express.static(path.join(__dirname, 'images')));

  
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
app.use('/images', express.static(path.join(__dirname, 'imageRes')));

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
app.use("/", lessonRoutes)
app.use('/apis', itemroutes);
app.use("/api", evenementRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/projet", boutiqueRoutes)

/*
https://ecolink.onrender.com
example for api consumption use
https://ecolink.onrender.com/api/users/signup
https://ecolink.onrender.com/api/lessons

*/


// I integrated swagger for the server, it can be accessed via
// https://ecolink.onrender.com/api-docs
// Check the user routes file to understand how swagger annotations work
app.listen(httpPort, () => {
	console.log("Server is running on port " + httpPort);
})


