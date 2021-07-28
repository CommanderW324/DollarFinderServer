const Post = require('../models/Post')
const User = require('../models/User')
const postRoute = require('express').Router()
const token = require('jsonwebtoken')
var multer = require('multer')
var multerS3 = require('multer-s3')
var AWS = require('aws-sdk')
s3 = new AWS.S3({apiVersion: '2006-03-01'})



postRoute.get("/", (request, response) => {
    const content = request.body;
    const sortMethod = request.headers.sortmethod;
    console.log(request.headers.sortmethod)
    const allUsers = Post.find({}).then((newPosts) => {
      console.log("its me")
      function sortJson(array, prop, propType, asc) {
        console.log("Before")  
        console.log(array)
          
        switch (propType) {
            case "int":
            array.sort(function (a, b) {
              if (asc) {
                return (a[prop]) > (b[prop])
                  ? 1
                  : (a[prop]) < (b[prop])
                  ? -1
                  : 0;
              } else {
                return (b[prop]) > (a[prop])
                  ? 1
                  : (b[prop]) < (a[prop])
                  ? -1
                  : 0;
              }
            });
            break;
          case "intAsString":
            array.sort(function (a, b) {
              if (asc) {
                return parseInt(a[prop]) > parseInt(b[prop])
                  ? 1
                  : parseInt(a[prop]) < parseInt(b[prop])
                  ? -1
                  : 0;
              } else {
                return parseInt(b[prop]) > parseInt(a[prop])
                  ? 1
                  : parseInt(b[prop]) < parseInt(a[prop])
                  ? -1
                  : 0;
              }
            });
            break;
          case "string":
            array.sort(function (a, b) {
              if (asc) {
                return a[prop].toLowerCase() > b[prop].toLowerCase()
                  ? 1
                  : a[prop].toLowerCase() < b[prop].toLowerCase()
                  ? -1
                  : 0;
              } else {
                return b[prop].toLowerCase() > a[prop].toLowerCase()
                  ? 1
                  : b[prop].toLowerCase() < a[prop].toLowerCase()
                  ? -1
                  : 0;
              }
            });
            break;
          default:
            break;
        }
        console.log("after")
      console.log(array)
      }
      switch (sortMethod) {
        
        case "0":
          sortJson(newPosts, "price", "int", true);
          break;
        case "1":
          sortJson(newPosts, "price", "int", false);
          break;
        case "2":
            console.log("Ive been wondering")
          sortJson(newPosts, "date", "intAsString", false);
          break;
        case "3":
          sortJson(newPosts, "date", "intAsString", true);
          break;
        default:
            console.log("if after all these")
          break;
      }
      
      return response.status(200).send(newPosts);
    }).catch(error => {
        return response.status(401).send(error)
    });
  });
postRoute.get('/:postId', async (request,response) => {
    const postId = request.params.postId
    const post = await Post.findOne({_id: postId}) 
    if(!post) {
        return response.status(401).json({error: "post not found"})
    } else {
       return response.status(200).send(post)
    }
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

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'postsdollarfinder',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    })
});
postRoute.post('/:postId', upload.single('img'), async (request,response) => {
    const postId = request.params.postId
    const post = await Post.findOne({_id: postId}) 
    if(!post) {
        return response.status(401).json({error: "post not found"})
    } else {
        post.img = "https://postsdollarfinder.s3.us-east-2.amazonaws.com/" + request.file.originalname
        const save = await post.save()
        return response.status(200).end()
    }
})
postRoute.post('/', async (request, response) => {
    
    const header = request.headers
    const content = request.body
    
    let decode
    try{
        decode = token.verify(header.logintoken, process.env.SECRET)
        
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
        
        const userPosting = await User.find({_id: userId})
        if(userPosting.logged === false) {
            return response.status(401).json(userPosting)
        }
        const postcontent = content
        const newPost = Post({
            img: "",
            title: postcontent.title,
            location: postcontent.location,
            price: postcontent.price,
            description: postcontent.description,
            locationUrl: postcontent.locationUrl,
            date: Date.now(),
            userId: user.id
        })
        const save = await newPost.save()
        
        return response.status(200).json({route: "dollarfinder.herokuapp.com/posts/" + newPost._id})
    }
    

})
module.exports = postRoute
