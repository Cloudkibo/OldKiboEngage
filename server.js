var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')
var bodyParser = require('body-parser');
var jwt     = require('express-jwt');
var secretconfig  = require('./server/config');
var app = new (require('express'))()
var port = 3000

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var jwtCheck = jwt({
  secret: secretconfig.secret
});

app.use('/api/protected', jwtCheck);

app.use(require('./server/routes/post.routes'));
//app.use(require('./server/protected-routes'));
//app.use(require('./server/user-routes'));
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==>Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})