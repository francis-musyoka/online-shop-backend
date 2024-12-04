const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();
const cookieParser =require('cookie-parser');
const cors = require('cors')

const db = require('./utils/database');
const {errorHandle} = require('./middleware/errorMiddleware');
const customerRouters = require('./routers/customerRouters')

const app = express();

app.use(bodyParser.json());
app.use(cookieParser())

app.use(cors({
    origin:"http://localhost:3000",
    credentials: true
}));
app.use(morgan('dev'));

app.use(customerRouters);

app.use(errorHandle);

const port = process.env.PORT|| 4000;

db.sequelize.sync().then(()=>{
    console.log('Table created');
    
    app.listen(port,()=>{
        console.log(`Server running on port ${port}`); 
    });
})

