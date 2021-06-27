

require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
const registerRouters = require('./controllers/register')
const loginRouters = require('./controllers/login')
app.use('/api/users', registerRouters)
app.use('/login', loginRouters)
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname,'build'), (err) => {
    if(err) {
      res.status(500).send(err)
    }
  });
});



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})