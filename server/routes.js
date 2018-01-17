var db = require('../database/index.js');
var router = require('express').Router();
var bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/up', (req, res) => {
	res.send(200);
});

router.post('/up', (req, res) => {
	db.findExistingUser()
	.then((data) => {
		return data.filter((entry) => {
			return (entry.email === req.body.email)
		})
	})
	.then((data) => {
		if(data.length > 0) {
			res.json('Username Already In Use!');
		} else {
			bcrypt.hash(req.body.password, saltRounds)
			.then(function(hash) {
				db.insertNewUser(req.body.email, hash)
			})
			.then(() => {
				res.json('New Sign Up Successful');
			})
		}
	})
	.catch((error) => {
		console.log('There is an error in routes.js sign up', error);
	})
});

router.get('/in', (req, res) => {
	res.send(200);
});

router.post('/in', (req, res) => {
	// console.log('INSIDE LOGIN', req.body.email)
	db.findExistingUser()
	.then((data) => {
		return data.filter((entry) => {
			return (entry.email === req.body.email);
		})
	})
	.then((results) => {
		if(results.length === 0) {
			res.json('Username or Password Incorrect!');
		} else {
			bcrypt.compare(req.body.password, results[0].password)
			.then(function(validation) {
				if(validation) {
					res.json('Success!');
				} else {
					res.json('Username or Password Incorrect!');
				}
			})
		}
	})
	.catch((error) => {
    	console.log('There is an error in routes.js sign in', error);
	})
});

// router.get('/balance', (req, res) => {
//   console.log('NEW EMAIL IS', req.body.email);
//   db.getBalancesOfUser(req.body.email, (err, results) => {
// 	if (err) {
// 	  console.log(err);
// 	} else {
// 	  console.log('RESULTS ARE', results);
// 	  // res.send('hello world');
// 	  res.send(results);
// 	}
//   })
// })

module.exports = router;