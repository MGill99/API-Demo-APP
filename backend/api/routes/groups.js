const express = require('express')
const router = express.Router()
const request = require('request');
bodyParser = require('body-parser');

// ATE
const ATEip = 'http://10.1.65.17'

router.get('/', async (req, res)=>{
    const accessToken = req.app.get('token')
    console.log('token ' + accessToken)
    var options = {
        url: ATEip +'/api/v1/systems/groups/',
        method: 'GET',
        json: true,
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
      var callback = (error, response, body) => {
        var bb = JSON.parse(JSON.stringify(body))
        console.log(bb['All Gateways'])
        console.log(response.statusCode);
        res.send(bb['All Gateways'])  
    }
      
      await request(options, callback);
})

module.exports = router