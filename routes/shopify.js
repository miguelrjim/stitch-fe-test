var express = require('express');
var request = require('request');
var router = express.Router();

var API_KEY = '6588e5c93111a394ad9b22cbf66993b8';
var PASSWD = 'aaed3405b3098b7d9efc781a9929cac4';
var STORE_NAME = 'miguelrjim';

router.get('/get', function(req, res) {

	var path
		, url
		;

	path = req.query.path;

	res.set({'Content-Type': 'application/json'});

	url = 'https://' + API_KEY + ':' + PASSWD + '@' + STORE_NAME + '.myshopify.com' + path;

	console.log('req: ' + url);

	request(url
		, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				res.status(200).send(body);
			} else {
				console.log(error);
				console.log(response.statusCode);
				res.status(response.statusCode).send(body);
			}
		}
	);

});

router.post('/post', function(req, res){

	var path = req.query.path
		, requestData = req.body
		;

	console.log(requestData);

	request({
		url: 'https://' + API_KEY + ':' + PASSWD + '@' + STORE_NAME + '.myshopify.com' + path
		, method: "POST"
		, json: true
		, headers: {
			"content-type": "application/json"
		}
		, body: JSON.stringify(requestData)
	}
	, function (error, response, body) {

			console.log(response.statusCode);

			if (!error && response.statusCode === 200 || response.statusCode === 201) {
				res.status(200).send(body);
			} else {
				console.log(error);
				//console.log(response);
				res.status(500).send(body);
			}
	});
});

router.put('/put', function(req, res){

	var path = req.query.path
		, requestData = req.body
		;

	console.log(requestData);

	request({
			url: 'https://' + API_KEY + ':' + PASSWD + '@' + STORE_NAME + '.myshopify.com' + path
			, method: "PUT"
			, json: true
			, headers: {
				"content-type": "application/json"
			}
			, body: JSON.stringify(requestData)
		}
		, function (error, response, body) {

			console.log(response.statusCode);

			if (!error && response.statusCode === 200 || response.statusCode === 201) {
				res.status(200).send(body);
			} else {
				console.log(error);
				//console.log(response);
				res.status(500).send(body);
			}
		});
});

router.delete('/delete', function(req, res){

  var path = req.query.path
    , requestData = req.body
    ;

  console.log(requestData);

  request({
      url: 'https://' + API_KEY + ':' + PASSWD + '@' + STORE_NAME + '.myshopify.com' + path
      , method: "DELETE"
      , json: true
      , headers: {
        "content-type": "application/json"
      }
      , body: JSON.stringify(requestData)
    }
    , function (error, response, body) {

      console.log(response.statusCode);

      if (!error && response.statusCode === 200 || response.statusCode === 201) {
        res.status(200).send(body);
      } else {
        console.log(error);
        //console.log(response);
        res.status(500).send(body);
      }
    });
});

module.exports = router;