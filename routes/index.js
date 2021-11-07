var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');

var locList = [
]

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.get('/profile', requiresAuth(), function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page'
  });
});

router.post('/location', requiresAuth(), function (req, res, next) {
  console.log(req.body);
  if (Object.keys(req.body).length !== 0 && locList.push(req.body) > 5) {
    locList.shift();
  }
  return res.status(200).json(locList);
});

module.exports = router;
