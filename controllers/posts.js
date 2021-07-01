const Post = require('../models/Post')
const User = require('../models/User')
const postRoute = require('express').Router()
const token = require('jsonwebtoken')



postRoute.get('/', (request, response) => {
    const content = request.body
    const allUsers = Post.find({}).then(posts => {
        return response.status(200).send(posts)
    })
    
})

// postRoute.delete('/:id', async (request, response) => {
//     const content = request.body
//     let decode
//     try{
//         decode = token.verify(content.logintoken, process.env.SECRET)
//     } catch {
//         return response.status(401).send({error: "Invalid token"})
//     }
    
//     const userDeleting = await Post.findOne({id: decode.id})
//     const deletePostId = request.params.id
//     const postDeleted = await Post.findOne({id: deletePostId})
    
    
//     const deletion = await Post.deleteOne({id: deleteId}, err =>{
//         if(err){
//             return response.status(404).send({error: "an Error has occured, user may not be found"})
//         } else {
//             return response.status(200).send({success: "succesfully removed a post"})
//         }
//     } )

// })
// postRoute.put('/:id', (request, response) => {

//     //tobe completed
//     // const content = request.body
//     // const newTextContent = content.content
//     // const newImage = content.image
    
    

// })
postRoute.post('/', async (request, response) => {
    const content = request.body

    let decode
    try{
        decode = token.verify(content.logintoken, process.env.SECRET)
        
    } catch {
        return response.status(401).send({error: "Invalid token"})
    }
    const userId = decode.id
    
    if(!token) {
        return response.status(401).send({error: "No token given"})
    }
    const user = await User.findOne({id: decode.id})
    if(!user) {
        return response.status(401).send({error: "wrong Token"})
    } else {
        content.userId = userId
        const arrOfPosts = content.data
        for(let i = 0; i < arrOfPosts.length; i++) {
            const content = arrOfPosts[i]
            const newPost = Post({
                frontend_id: content.id,
                img: content.img,
                title: content.title,
                location: content.location,
                price: content.price,
                description: content.description,
                date: Date.now(),
                userId: user.id
            })
            const save = await newPost.save()
        }
        
        return response.status(200).json(arrOfPosts)
    }

})
module.exports = postRoute
