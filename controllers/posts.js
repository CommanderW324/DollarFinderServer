const Post = require('../models/Post')
const postRoute = require('express').Router()
const token = require('jsonwebtoken')
var bodyParser = require('body-parser');
var fs = require('fs');

postRoute.get('/', (request, response) => {
    const content = request.body
    const allUsers = Post.find({}).then(posts => {
        return response.status(200).send(posts)
    })
    
})

postRoute.delete('/:id', async (request, response) => {
    const content = request.body
    const usernameDeleting = content.username
    const userDeleting = await Post.findOne({username: usernameDeleting})
    const deletePostId = request.params.id
    const postDeleted = await Post.findOne({id: deletePostId})
    if(userDeleting.id === postDeleted ) {

    }
    const deletion = await Post.deleteOne({id: deleteId}, err =>{
        if(err){
            return response.status(404).send({error: "an Error has occured, user may not be found"})
        } else {
            return response.status(200).send({success: "succesfully removed a post"})
        }
    } )

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
