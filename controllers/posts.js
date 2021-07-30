const Post = require('../models/Post')
const User = require('../models/User')
const postRoute = require('express').Router()
const token = require('jsonwebtoken')
var multer = require('multer')
var multerS3 = require('multer-s3')
var AWS = require('aws-sdk')
s3 = new AWS.S3({apiVersion: '2006-03-01'})


postRoute.put('/vote', async (request,response) => {
  const content = request.body
  const header = request.headers
  const logintoken = header.logintoken
  let decode
  try{
      decode = token.verify(logintoken, process.env.SECRET)
  } catch {
      return response.status(401).send({error: "Invalid token"})
  }
  const userId = decode.id
  const postId = content.postId
  const userVoting = await User.findOne({_id: userId})
  const editPost = await Post.findOne({_id: postId})
  if(!editPost) {
    return response.status(401).send({error: "No post found"})
  }
  if(userVoting) {
      const vote = content.vote
      
      editPost.upvoteUser = editPost.upvoteUser.filter(x => x.toString() !== userId)
      editPost.downvoteUser = editPost.downvoteUser.filter(x => x.toString() !== userId)
      if(vote === 1) {
          editPost.upvoteUser.push(userId)
      } else if(vote === -1) {
          editPost.downvoteUser.push(userId)
      } else if( vote === 0) {
          
      } else {
          return response.status(401).end()
      }
      try{
        const save = await editPost.save()
      } catch(e) {
        return response.status(400).send(e)
      }
        return response.status(200).end()
      }
       else {
    return response.status(400).send({error: "User not found"})
  }

})
postRoute.get("/", (request, response) => {
    const content = request.body;
    const sortMethod = request.headers.sortmethod;
    const allUsers = Post.find({}).then((newPosts) => {
      function sortJson(array, prop, propType, asc) {
          
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
    
      }
      switch (sortMethod) {
        
        case "0":
          sortJson(newPosts, "price", "int", true);
          break;
        case "1":
          sortJson(newPosts, "price", "int", false);
          break;
        case "2":
            
          sortJson(newPosts, "date", "int", false);
          break;
        case "3":
          sortJson(newPosts, "date", "int", true);
          break;
        default:
          break;
      }
      
      return response.status(200).send(newPosts);
    }).catch(error => {
        return response.status(401).send(error)
    });
  });
postRoute.get('/:postId', async (request,response) => {
    const postId = request.params.postId
    const logintoken = request.headers.logintoken
    const post = await Post.findOne({_id: postId}) 
    if(!post) {
        return response.status(401).json({error: "post not found"})
    } else {
        let sendPost
        if(logintoken) {
          let decode
          try{
            decode = token.verify(logintoken, process.env.SECRET)
          } catch {
             return response.status(401).send({error: "Invalid token"})
        }
          const userId = decode.id
          let found = 0
          if(post.upvoteUser.find(x => x.toString() === userId)) {
            found = 1
          } else if(post.downvoteUser.find(x=> x.toString() === userId)) {
            found = -1
          }
          return response.status(200).send({post, vote: found, totalVote: post.upvoteUser.length - post.downvoteUser.length})
        }
        return response.status(200).json(post)
    }
    
    
})

postRoute.delete('/:id', async (request, response) => {
    const content = request.body
    const logintoken = request.headers.logintoken
    let decode
    try{
        decode = token.verify(logintoken, process.env.SECRET)
    } catch {
        return response.status(401).send({error: "Invalid token"})
    }
    const userId = decode.id
    const userDeleting = await Post.findOne({_id: userId})
    const deletePostId = request.params.id
    const postDeleted = await Post.findOne({_id: deletePostId})
    if(postDeleted.userId.toString() === userId) {
        const deletion = await Post.deleteOne({_id: deletePostId}, err =>{
            if(err){
                return response.status(404).send({error: "an Error has occured, user may not be found"})
            } else {
                return response.status(200).send({success: "succesfully removed a post"})
            }
        } )
    } else {
        return response.status(201).send({error: "You are not the creator of this post"})
    }
})
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
            userId: user.id,
            upvoteUser: [],
            downvoteUser: []
        })
        const save = await newPost.save()
        
        return response.status(200).json({route: "dollarfinder.herokuapp.com/posts/" + newPost._id})
    }
    

})
module.exports = postRoute
