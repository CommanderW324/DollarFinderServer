require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./router')


app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(express.urlencoded())

const registerRoutes = require('./controllers/register')
const loginRoutes = require('./controllers/login')
const postRoutes = require('./controllers/posts')
const accountRoutes = require('./controllers/account')
app.use('/register', registerRoutes)
app.use('/login', loginRoutes)
app.use('/posts', postRoutes)
app.use('/account', accountRoutes)


// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 


// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Call S3 to list the buckets
s3.listBuckets(function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data.Buckets);
  }
});



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})