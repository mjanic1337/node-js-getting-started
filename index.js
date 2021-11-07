const express = require('express')
const path = require('path')
const dotenv = require('dotenv');
const logger = require('morgan');
const router = require('./routes/index');
const { auth } = require('express-openid-connect');

const PORT = process.env.PORT || 5000

dotenv.load();

const config = {
  authRequired: false,
  auth0Logout: true,
  idpLogout: true,
  secret: process.env.SECRET,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  clientSecret: process.env.CLIENT_SECRET,
  authorizationParams: {
    response_type: 'code',
    scope: "openid profile email"
  }
};

if (!config.baseURL && !process.env.BASE_URL) {
  config.baseURL = `http://localhost:${PORT}`;
}

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(logger('dev'))
  .use(express.json())
  .use(auth(config))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(function (req, res, next) {
    res.locals.user = req.oidc.user;
    next();
  })
  .use('/', router)
  .use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  })
  .use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: process.env.NODE_ENV !== 'production' ? err : {}
    });
  })
  .listen(PORT, () => {
    console.log(`Listening on ${config.baseURL}`);
  });
