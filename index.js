require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./router')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
const registerRouters = require('./controllers/register')
const loginRouters = require('./controllers/login')
app.use('/api/users', registerRouters)
app.use('/login', loginRouters)
app.use('/', router)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})