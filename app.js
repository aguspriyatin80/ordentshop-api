const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
// const bodyParser = require('body-parser')
// const authJwt = require('./helpers/auth-jwt');
const errorHandler = require('./helpers/error-handler');

//documentation
const swaggerDocument = require('./swagger.json')
const swaggerUi = require('swagger-ui-express')

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json())
//cors
app.use(cors());
app.options('*', cors())

//middleware
app.use(express.json());
app.use(morgan('tiny'));
// app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));


//Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const homeRoutes = require('./routes/index');

app.use(`/categories`, categoriesRoutes);
app.use(`/products`, productsRoutes);
app.use(`/users`, usersRoutes);
app.use(`/orders`, ordersRoutes);
app.use("/", homeRoutes);
//Database
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    // dbName: 'ordentshop-database'
})
.then(()=>{
    console.log('Database connected ...')
})
.catch((err)=> {
    console.log(err);
})

app.use(errorHandler);
//Server
const port = process.env.PORT || 3000
app.listen(port, ()=>{

    console.log(`Listening port ${port}`);
})