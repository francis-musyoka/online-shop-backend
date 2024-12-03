const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();
const cookieParser =require('cookie-parser')

const db = require('./utils/database');
const {errorHandle} = require('./middleware/errorMiddleware');
const customerRouters = require('./routers/customerRouters')

const app = express();

app.use(bodyParser.json());
app.use(cookieParser())

app.use(morgan('dev'));

app.use(errorHandle);

app.use(customerRouters)

const port = process.env.PORT|| 4000;

db.sequelize.sync().then(()=>{
    console.log('Table created');
    
    app.listen(port,()=>{
        console.log(`Server running on port ${port}`); 
    });
})

