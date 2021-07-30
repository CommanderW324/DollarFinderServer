require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/User')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('You have connected to MongoDB')
  })
  .catch((error) => {
    console.log('error:', error.message)
  })

  const postSchema = new mongoose.Schema({
      frontend_Id: {
        type: Number
      },
      img: {
        type: String
      },
      title: {
        type:String
      },
      userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref:"User"
      },
      description: {
          type: String,
          max: 100000
      },

      date: Date,
      locationUrl: {
        type: String
      },
      location: {
        type: String
      }, price: {
        type: Number
      },upvotes: {
        type: Number
      }, downvotes: {
        type: Number
      }, upvoteUser: {
        type: [{type : mongoose.Schema.Types.ObjectId, ref: 'User'}]
      }, downvoteUser: {
        type: [{type : mongoose.Schema.Types.ObjectId, ref: 'User'}]
      }
    })
    postSchema.set('toJSON', {
        transform: (receive, returned) => {
          returned.id = returned._id.toString()
          delete returned.upvoteUser
          delete returned.downvoteUser
          delete returned._id
          delete returned.__v
        }
      })
    module.exports = mongoose.model('Post', postSchema)