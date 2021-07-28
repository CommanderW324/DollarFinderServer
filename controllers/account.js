const User = require('../models/User.js')
const Post = require('../models/Post.js')
const bcrypt = require('bcrypt')
const account = require('express').Router()
const token = require('jsonwebtoken')
const nodeMailer = require('nodemailer')

account.get('/', async (request,response) => {
    const header = request.headers
    const logintoken = header.logintoken
    let decode
    try{
        decode = token.verify(logintoken, process.env.SECRET)
        
    } catch {
        return response.status(401).send({error: "invalid Token"})
    }
    const userId = decode.id
    const user = await User.findOne({_id: userId})
    if(!user) {
        return response.status(401).send({error: "wrong Token"})
    } else {
        if(user.logged === false || user.logintoken !== logintoken) {
            return response.status(401).send({error: "User not Logged in / Invalid Token for this user"})
        }
        return response.status(200).send(user)
    }
    // return response.status(200).send(decode)
})
account.post('/change', async (request, response) => {
    const logintoken = request.headers.logintoken
    const content = request.body
    let decode
    try{
        decode = token.verify(logintoken, process.env.SECRET)
        
    } catch {
        return response.status(401).send({error: "Invalid token"})
    }
    const userId = decode.id
    const user = await User.findOne({_id: decode.id})
    if(!user) {
        return response.status(401).send({error: "wrong Token"})
    } else {
        
        const newPassword = content.password
        const password_hashed = await bcrypt.hash(newPassword, 10)
        if(user.logged === false || user.logintoken !== logintoken) {
            return response.status(401).send({error: "User not Logged in / Invalid Token for this user"})
        }
        try{
            user.password = password_hashed
            await user.save()
        } catch {
            return response.status(404).send({error: "cannot update"})
        }
        
        return response.status(200).end()
    }
    
})
account.get('/posts', async (request, response) => {
    const header = request.headers
    const logintoken = header.logintoken
    let decode
    try{
        decode = token.verify(logintoken, process.env.SECRET)
        
    } catch {
        return response.status(401).send({error: "invalid Token"})
    }
    const userId = decode.id
    const user = await User.findOne({_id: userId})
    
    if(!user) {
        return response.status(401).send({error: "wrong Token"})
    } else {
        if(user.logged === false || user.logintoken !== header.logintoken) {
            return response.status(401).send({error: "User not Logged in / Invalid Token for this user"})
        }
        const posts = await Post.find({userId: userId})
        return response.status(200).send(posts)
    }

})
account.get('/delete', async(request, response) => {
    const header = request.headers
    const logintoken = header.logintoken
    let decode
    try{
        decode = token.verify(logintoken, process.env.SECRET)
        
    } catch {
        return response.status(401).send({error: "invalid Token"})
    }
    const userId = decode.id
    const user = await User.findOne({_id: userId}) 
    if(user.logged === false || user.logintoken !== header.logintoken) {
        return response.status(401).send({error: "User not Logged in / Invalid Token for this user"})
    }
    User.findOneAndRemove({_id: userId}, (err) => {
        if (err) {
          return response.status(401).json({error: "Not found/ Unable to Delete"});
        }
        return response.status(200).end()
      });
    
})
account.get('/logout', async(request, response) => {
    const header = request.headers
    const logintoken = header.logintoken
    let decode
    try{
        decode = token.verify(logintoken, process.env.SECRET)
        
    } catch {
        return response.status(401).send({error: "invalid Token"})
    }

    const user = await User.findOne({_id: decode.id})
    if(user.logged === false ) {
        return response.status(401).send({error: "User not Logged in / Invalid Token for this user"})
    }
    try{
        user.logged = false
        user.logintoken = ""
        await user.save()
        return response.status(200).send({success: "Logout"})
    } catch (error) {
        return response.status(404).send({error: error.message})
    }
})

module.exports = account