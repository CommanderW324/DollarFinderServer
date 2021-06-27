require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('You have connected to MongoDB')
  })
  .catch((error) => {
    console.log('error:', error.message)
  })

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
})

userSchema.set('toJSON', {
  transform: (receive, returned) => {
    returned.id = returned._id.toString()
    delete returned._id
    delete returned.__v
  }
})

module.exports = mongoose.model('User', userSchema)