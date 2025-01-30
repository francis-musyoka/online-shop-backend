const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();
const cookieParser =require('cookie-parser');
const cors = require('cors')
const path = require('path')

const db = require('./utils/database');
const {errorHandle} = require('./middleware/errorMiddleware');

const customerRouters = require('./routers/customerRouters');
const shopRouters = require('./routers/shopRouters');
const categoryRouter = require('./routers/categoryRouters')
const productRouter = require('./routers/productRouter')

const app = express();

app.use(bodyParser.json());
app.use(cookieParser())

app.use(cors({
    origin:"http://localhost:3000",
    credentials: true
}));
app.use(morgan('dev'));


// Middleware to serve static files (images) from the productImages directory
app.use('/images/productImages', express.static(path.join(__dirname, 'images/productImages')));

app.use(customerRouters);
app.use(shopRouters);
app.use(categoryRouter);
app.use(productRouter);


app.use(errorHandle);

const port = process.env.PORT || 5000 ;

db.sequelize.sync().then(()=>{
    console.log('Table created');
    
    app.listen(port,()=>{
        console.log(`Server running on port ${port}`); 
    });
})

