const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const privateInfo = require('./util/private-info')
const errorNotif = require('./util/error-notif')

const productRouter = require('./routers/product')
const userRouter = require('./routers/user')
const commentRouter = require('./routers/comment')
const orderRouter = require('./routers/order')

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

  app.use('/product', productRouter)

  app.use('/user', userRouter)

  app.use('/comment', commentRouter)

  app.use('/order', orderRouter)

  app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    // errorNotif.sendViaEmail("alibagheri.1379.1389@gmail.com","Ecommerce-REST-API","localhost:3000",[error])
    // errorNotif.sendViaTelegram(119016501,"Ecommerce-REST-API","localhost:3000",[error])
    res.status(status).json({ status: status, message: message, data: data });
  });

mongoose.connect(privateInfo.mongoDBURL())
    .then(result => {
        app.listen(3000)
        console.log("Connected!")
    }).catch(err => {
        console.log(err)
    })
