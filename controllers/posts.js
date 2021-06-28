const Post = require('../models/Post')
const postRoute = require('express').Router()

postRoute.get('/', (request, response) => {
    const content = request.content
    const allUsers = Post.find({}).then(posts => {
        return response.status(200).send(posts)
    })
    
})

postRoute.delete('/:id', (request, response) => {
    

})
postRoute.put('/:id', (request, response) => {

})
postRoute.post('/',(request, response) => {
    const content = request.body
    content.date = Date.now()
    const postContent = Post.create(content).then(
        result => {
            return response.status(200).send(result)
        })
})
module.exports = postRoute
