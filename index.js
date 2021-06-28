require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./router')
const bodyParser = require('body-parser');


app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
const registerRoutes = require('./controllers/register')
const loginRoutes = require('./controllers/login')
const postRoutes = require('./controllers/posts')
app.use('/api/users', registerRoutes)
app.use('/login', loginRoutes)
app.use('/posts', postRoutes)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})