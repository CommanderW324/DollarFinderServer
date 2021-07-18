const User = require('../models/User.js')
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
    
    if(!token) {
        return response.status(401).send({error: "No token given"})
    }
    const user = await User.findOne({_id: decode.id})
    if(!user) {
        return response.status(401).send({error: "wrong Token"})
    } else {
        
        const newPassword = content.password
        const password_hashed = await bcrypt.hash(newPassword, 10)
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
    const user = await User.findOne({id: userId})
    if(!user) {
        return response.status(401).send({error: "wrong Token"})
    } else {
        const posts = await Post.findAll({userId: userId})
        return response.status(200).send(posts)
    }

})
module.exports = account