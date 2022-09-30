const express = require('express');
const _ = require('lodash');
const cors = require('cors');
const logger = require('morgan');
const mongoose=require('mongoose');
const category = require('./routes/Category.api');
const product = require('./routes/Product.api');

/* all error message definitions */
const messages={
    'invRoute' : 'Invalid Route',
    'notFound' : 'Resource not found',  
};


/* Send error response to server */
function sendErrorResponse(errCode,message,res){
    res.status(errCode).send({
        status : 'error',
        message : message
    });
}

const app = express();

app.use(cors({origin: "http://localhost:3000"}))
app.use(cors());
app.use(logger('dev'))
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// MongoDB connection, success and error event responses
const uri = "mongodb://127.0.0.1:27017/productms";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log(`Connected to mongo at ${uri}`));


app.all('/',(req,res)=>{
    return sendErrorResponse(200,messages['invRoute'],res);
});
app.use('/api/categories',category);
app.use('/api/products',product);

/* mark all other routes as invalid */
app.all('/*',(req,res)=>{
    return sendErrorResponse(400,messages['invRoute'],res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
  console.log("Server running");
});