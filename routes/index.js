var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');

var infoList = [
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
  if (Object.keys(req.body).length !== 0) {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    let datestring = date + "." + month + "." + year + " " + hours + ":" + minutes + ":" + seconds

    let info = {
      email: req.oidc.user.email,
      date: datestring,
      loc: req.body
    }

    const index = infoList.findIndex(e => e.email === info.email)
    if (index > -1) {
      infoList[index] = info;
    } else if (infoList.push(info) > 5) {
      infoList.shift();
    }
  }
  return res.status(200).json(infoList);
});

module.exports = router;
