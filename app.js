const express = require('express');
const jwt = require("jsonwebtoken");

const app = express();

app.get('/api',(req,res)=>{
    res.json({
        message:'Welcome to the API'
    })
})

app.post("/api/login", (req, res) => {
  //Mock User will recie
  const user = {
    id: 1,
    username: "MOhit",
    email: "mohit@gmail.com",
  };
  //Return token to client on login
//   {expiresIn:'8h'},
  jwt.sign({ user: user }, "secretKey", (err, token) => {
    res.json({
      token: token,
    });
  });
});

//lets say we want to protect this route
// lets add a middleware verifyToken
app.post("/api/posts/", verifyToken, (req, res) => {

    jwt.verify(req.token,'secretKey', (err, authData) =>{
        if(err){
            res.sendStatus(403);
        }
        else{
            res.json({
                message: "Post created...",
                authData
              });
        }
    })
  
});

//FORMAT OF TOKEN
//Authorization: Bearer <access_token>

//VerifyTOken
function verifyToken(req, res, next) {
  // get auth header value
  const bearerHeader = req.headers["authorization"];

  //check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    //Split at the space
    const bearer = bearerHeader.split(" ");
    // get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;

    //Next middleware
    next();
  } else {
    //Forbidden
    res.sendStatus(403);
  }
}

app.listen(5000, ()=> console.log('Server started on 5000'));