require('dotenv').config()
const mongoose = require('mongoose')
const Post = require('../models/Post')

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .catch((error) => {
    console.log(error.message)
  })

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String, 
    required: true,
    unique: true, 
    match: /.+\@.+\..+/
  },
  password: {
    type: String,
    required: true
  },
  active: Boolean,
  date: Date,
  confirmationCode : String,
  logintoken: String,
  logged: Boolean,
  profile: String,
  posts:[{type: mongoose.Schema.Types.ObjectId}]
})

userSchema.set('toJSON', {
  transform: (receive, returned) => {
    returned._id = returned._id.toString()
    delete returned.id
    delete returned.__v
    delete returned.password
  }
})

module.exports = mongoose.model('User', userSchema)