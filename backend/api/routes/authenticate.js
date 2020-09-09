const express = require('express')
const ClientOAuth2 = require('client-oauth2')
const router = express.Router()
const request = require('request');

 // ATE details
const ATE_address = 'http://10.1.65.17'
const clientId = 'c6f2587144db41ce9f12aca54f0414f7'
const clientSecret = '8b25d1b613ef4945b03132f6a93b1ed1'
var acessToken = ''
var User = ''
var refreshToken = ''
 
var ammAuth = new ClientOAuth2({
  clientId: clientId,
  clientSecret: clientSecret,
  accessTokenUri: ATE_address + '/api/oauth/token',
  authorizationUri: ATE_address + '/api/oauth/authorize',
  redirectUri: 'http://localhost:5000/authenticate/callback'
})

router.get('/', function (req, res) {
  var uri = ammAuth.code.getUri()
  res.redirect(uri)
})

router.get('/callback', function (req, res) {
  ammAuth.code.getToken(req.originalUrl)
    .then(function (user) {
      User = user
      console.log( user.data)
      acessToken=user.data.access_token
      refreshToken=user.data.refresh_token
      res.redirect('/authenticate/success')
    })
})

router.get('/success', (req, res)=>{
  console.log('acess token ' + acessToken)

  var header = {
    "Content-Type": "text/event-stream",
    "Cache-Control":"no-cache",
    "Access-Control-Allow-Origin": "*"
  }
  res.writeHead(200, header)

  let interval = setInterval(() =>{
    res.write("data:"+acessToken)
    res.write('\n\n')
    if(acessToken.localeCompare('') !== 0){
      clearInterval(interval)
    }
  }, 1000)

  req.on('close', ()=>{   
    console.log('Access Granted')
    clearInterval(interval)
    res.app.set('token', acessToken)
    res.end()
  })

})

router.get('/refresh', async (req, res)=>{
  User.refresh().then(function (updatedUser) {
    // console.log(updatedUser !== user) //=> true
    console.log(updatedUser.accessToken)
    res.app.set('token', updatedUser.accessToken)
    res.send(updatedUser.accessToken)
  })
})

 module.exports=router; 

   