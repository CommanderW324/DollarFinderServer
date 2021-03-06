require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .catch((error) => {
    console.log('error:', error.message)
  })

  const postSchema = new mongoose.Schema({
    frontend_Id: {
      type: Number
    },
    title: {
      type:String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    content: {
        type: String,
        max: 100000
    },

    date: Date,
     postId: {
        type: mongoose.Schema.Types.ObjectId
    }
  })
  postSchema.set('toJSON', {
      transform: (receive, returned) => {
        returned.id = returned._id.toString()
        delete returned._id
        delete returned.__v
      }
    })
  module.exports = mongoose.model('Post', postSchema)