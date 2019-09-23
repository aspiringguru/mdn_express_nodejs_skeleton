var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/catalog');
});
//replaces the router.get('/' below.
/*
This is our first use of the redirect() response method. This redirects to
the specified page, by default sending HTTP status code "302 Found".
You can change the status code returned if needed, and supply either
absolute or relative paths.
*/

/*
//superceded / route 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/

router.get('/test', function(req, res, next) {
  res.render('test', { title: 'ExpressDemo' });
});


module.exports = router;
