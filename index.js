require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./router')
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

const registerRoutes = require('./controllers/register')
const loginRoutes = require('./controllers/login')
const postRoutes = require('./controllers/posts')
const accountRoutes = require('./controllers/account')
app.use('/register', registerRoutes)
app.use('/login', loginRoutes)
app.use('/posts', postRoutes)
app.use('/account', accountRoutes)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})