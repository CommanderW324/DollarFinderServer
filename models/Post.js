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

  const postSchema = new mongoose.Schema({
      frontend_Id: {
        type: Number
      },
      img: {
        type: Buffer
      },
      title: {
        type:String
      },
      userId: {
          type: mongoose.Schema.Types.ObjectId,
      },
      description: {
          type: String,
          max: 100000
      },

      date: Date,
      location: {
        type: String
      }, price: {

        type: Number
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