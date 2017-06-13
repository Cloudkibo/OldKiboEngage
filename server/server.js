import Express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import logger from 'morgan';

// Webpack Requirements
import webpack from 'webpack';
import config from '../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import Buffer from 'Buffer';


// Initialize the Express App
const app = new Express();
const httpapp = new Express();

if (process.env.NODE_ENV !== 'production') {
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
  app.use(logger('dev'));
  // unsecure_app settings
  httpapp.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  httpapp.use(webpackHotMiddleware(compiler));
  httpapp.use(logger('dev'));
}

// React And Redux Setup
import { configureStore } from '../shared/redux/store/configureStore';
import { Provider } from 'react-redux';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';

// Import required modules
import routes from '../shared/routes';
import { fetchComponentData } from './util/fetchData';
import serverroutes from './routes/server.routes';
import serverConfig from './config';
import os from 'os';
import fs from 'fs';

// Apply body Parser and server public assets and routes
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(Express.static(path.resolve(__dirname, '../static')));
app.use('/api', serverroutes);
// unsecure_app settings
httpapp.use(bodyParser.json({ limit: '20mb' }));
httpapp.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
httpapp.use(Express.static(path.resolve(__dirname, '../static')));
httpapp.use('/api', serverroutes);

// https redirect
import { Router } from 'express';
if(process.env.NODE_ENV === 'production'){
  const router = new Router();
 router.route('*').get( function(req,res){
    res.redirect('https://kiboengage.kibosupport.com' + req.url);
  });
  httpapp.use('*', router);
}

//if(process.env.NODE_ENV === 'production'){
// httpapp.get('*', function(req,res){
//   res.redirect('https://kiboengage.kibosupport.com' + req.url);
// });
//}

var options = {
  ca: fs.readFileSync('server/security/gd_bundle-g2-g1.crt'),
  key: fs.readFileSync('server/security/server.key'),
  cert: fs.readFileSync('server/security/56d01c37201707d0.crt')
};



// Render Initial HTML
const renderFullPage = (html, initialState) => {
  const cssPath = process.env.NODE_ENV === 'production' ? '/css/app.min.css' : '/css/app.css';
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Kibo Engage</title>
           <link rel='stylesheet' href='//netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css'>
           <link rel='stylesheet' href='//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap-theme.min.css'>
        <!-- BEGIN GLOBAL MANDATORY STYLES -->
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css"/>
        <!--<link href="/assets/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>-->
         
         <link rel="stylesheet" href='/css/bootstrap/css/bootstrap.min.css' />
         <link rel="stylesheet" href='/css/style.css' />
         <link rel="stylesheet" href='/css/css/components.css' />
         <link rel="stylesheet" href='/css/layout/css/layout.css' />
         <link rel="stylesheet" href='/css/layout/css/custom.css' />
        <link href='https://fonts.googleapis.com/css?family=Lato:400,300,700' rel='stylesheet' type='text/css'/>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">
        <link rel="shortcut icon" href="http://res.cloudinary.com/hashnode/image/upload/v1455629445/static_imgs/mern/mern-favicon-circle-fill.png" type="image/png" />
        <link rel="stylesheet" href='/css/chatui.css' />
        <!-- Page level plugin styles START -->
        <link href="assets/global/plugins/fancybox/source/jquery.fancybox.css" rel="stylesheet">
        <link href="assets/global/plugins/carousel-owl-carousel/owl-carousel/owl.carousel.css" rel="stylesheet">
        <link href="assets/global/plugins/slider-revolution-slider/rs-plugin/css/settings.css" rel="stylesheet">
        <!-- Page level plugin styles END -->
         <link href="assets/admin/layout/css/themes/darkblue.css" rel="stylesheet" />
        <!-- Theme styles START -->
        <link href="assets/global/css/components.css" rel="stylesheet">
        <link href="assets/frontend/layout/css/style.css" rel="stylesheet">
        <link href="assets/frontend/pages/css/style-revolution-slider.css" rel="stylesheet"><!-- metronic revo slider styles -->
        <link href="assets/frontend/layout/css/style-responsive.css" rel="stylesheet">
        <link href="assets/frontend/layout/css/themes/red.css" rel="stylesheet" id="style-color">
        <!-- UIkit CSS -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.24/css/uikit.min.css" />


        <link href="assets/frontend/layout/css/custom.css" rel="stylesheet">
        <link href="assets/frontend/layout/css/cropper.css"   rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.min.css"   rel="stylesheet">
         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.css"/>
         <link rel="stylesheet" href="/css/rrui.css"/>
        <link rel="stylesheet" href="/css/styleuu.css"/>
        
        
  </head>
      <body class="page-header-fixed-mobile page-quick-sidebar-over-content page-sidebar-closed ">
        <div id="root">${html}</div>
             <script src="/socket.io/socket.io.js"></script>
             <script src="assets/global/plugins/jquery.min.js" type="text/javascript"></script>
             <script src="assets/global/plugins/jquery-migrate.min.js" type="text/javascript"></script>
             <!-- IMPORTANT! Load jquery-ui-1.10.1.custom.min.js before bootstrap.min.js to fix bootstrap tooltip conflict with jquery ui tooltip -->
             <script src="assets/global/plugins/jquery-ui/jquery-ui.min.js" type="text/javascript"></script>
             <script src="assets/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
             <!--[if lt IE 9]>
             <script src="assets/global/plugins/excanvas.min.js"></script>
             <script src="assets/global/plugins/respond.min.js"></script>
             <![endif]-->
             <script src="assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
             <script src="assets/global/plugins/jquery.blockui.min.js" type="text/javascript"></script>
             <script src="assets/global/plugins/jquery.cokie.min.js" type="text/javascript"></script>
             <script src="assets/global/plugins/uniform/jquery.uniform.min.js" type="text/javascript" ></script>
            <!-- END CORE PLUGINS -->
             <!-- BEGIN PAGE LEVEL PLUGINS -->
             <script src="assets/global/plugins/jqvmap/jqvmap/jquery.vmap.js" type="text/javascript"></script>
             <script src="assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.russia.js" type="text/javascript"></script>
             <script src="assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.world.js" type="text/javascript"></script>
             <script src="assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.europe.js" type="text/javascript"></script>
             <script src="assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.germany.js" type="text/javascript"></script>
             <script src="assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.usa.js" type="text/javascript"></script>
             <script src="assets/global/plugins/jqvmap/jqvmap/data/jquery.vmap.sampledata.js" type="text/javascript"></script>
             <script src="assets/global/plugins/flot/jquery.flot.js" type="text/javascript"></script>
             <script src="assets/global/plugins/flot/jquery.flot.resize.js" type="text/javascript"></script>
             <script src="assets/global/plugins/jquery.pulsate.min.js" type="text/javascript"></script>
             <script src="assets/global/plugins/bootstrap-daterangepicker/moment.min.js" type="text/javascript"></script>
             <script src="assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js" type="text/javascript"></script>
             <script src="assets/global/plugins/gritter/js/jquery.gritter.js" type="text/javascript"></script>
             <script src="assets/global/plugins/fullcalendar/fullcalendar.min.js" type="text/javascript"></script>
             <script src="assets/global/plugins/jquery-easypiechart/jquery.easypiechart.js" type="text/javascript"></script>
             <script src="assets/global/plugins/jquery.sparkline.min.js" type="text/javascript"></script>
             <!-- END PAGE LEVEL PLUGINS -->
             <!-- BEGIN PAGE LEVEL SCRIPTS -->
            <script src = "/scripts/back-to-top.js"></script>
            <script src="assets/global/scripts/metronic.js" type="text/javascript"></script>
            <script src="assets/admin/layout/scripts/layout.js" type="text/javascript"></script>
            <script src="assets/admin/layout/scripts/quick-sidebar.js" type="text/javascript"></script>
            <script src="assets/admin/layout/scripts/demo.js" type="text/javascript"></script>
            <script src="scripts/widgetapp.js" type="text/javascript" ></script>
            <script src="scripts/widgetapp2.js" type="text/javascript" ></script>
            <!-- UIkit JS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.25/js/uikit.min.js"></script>



        <!-- BEGIN RevolutionSlider -->
            <script src="assets/global/plugins/slider-revolution-slider/rs-plugin/js/jquery.themepunch.revolution.min.js" type="text/javascript"></script>
            <script src="assets/global/plugins/slider-revolution-slider/rs-plugin/js/jquery.themepunch.tools.min.js" type="text/javascript"></script>
            <script src="assets/frontend/pages/scripts/revo-slider-init.js" type="text/javascript"></script>
            <!-- END RevolutionSlider -->
            <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
            /* Init Metronic's core jquery plugins and layout scripts */
            $(document).ready(function() {
              Metronic.init(); // Run metronic theme
              Metronic.setAssetsPath('/assets/'); // Set the assets folder path
              RevosliderInit.initRevoSlider();
                        
            });
          </script>
          <script>
jQuery(document).ready(function() {       
   // initiate layout and plugins
   Metronic.init(); // init metronic core components
Layout.init(); // init current layout
QuickSidebar.init(); // init quick sidebar
Demo.init(); // init demo features
  $("#draggable").draggable({
      handle: ".modal-header"
  });
});
</script>
             <script src="/dist/bundle.js"></script>
                     <!-- jQuery is required -->
        
        <script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.24/js/uikit-icons.min.js"></script>
         </body>
    </html>
  `;
};



const renderError = err => {
  const softTab = '&#32;&#32;&#32;&#32;';
  const errTrace = process.env.NODE_ENV !== 'production' ?
    `:<br><br><pre style="color:red">${softTab}${err.stack.replace(/\n/g, `<br>${softTab}`)}</pre>` : '';
  return renderFullPage(`Server Error${errTrace}`, {});
};

// Server Side Rendering based on routes matched by React-router.
app.use((req, res, next) => {
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      return res.status(500).end(renderError(err));
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }
    
    if (!renderProps) {
      return next();
    }

    const initialState = {};

    const store = configureStore(initialState);

    return fetchComponentData(store, renderProps.components, renderProps.params)
      .then(() => {
        const initialView = renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        );
        const finalState = store.getState();

        res.status(200).end(renderFullPage(initialView, finalState));
      });
  });
});

// unsecure_app settings
httpapp.use((req, res, next) => {
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      return res.status(500).end(renderError(err));
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    if (!renderProps) {
      return next();
    }

    const initialState = {};

    const store = configureStore(initialState);

    return fetchComponentData(store, renderProps.components, renderProps.params)
      .then(() => {
        const initialView = renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        );
        const finalState = store.getState();

        res.status(200).end(renderFullPage(initialView, finalState));
      });
  });
});

import https from 'https';
import http from 'http';
// start app using secure server HTTPS
const server = https.createServer(options, app).listen(serverConfig.secure_port, (error) => {
  if (!error) {
    console.log(`MERN is running on port: ${serverConfig.secure_port}! Build something amazing!`); // eslint-disable-line
  }
});

const serverhttp = http.createServer(httpapp).listen(serverConfig.port, (error) => {
  if (!error) {
    console.log(`MERN is running on port: ${serverConfig.port}! Build something amazing!`); // eslint-disable-line
  }
});

if(process.env.NODE_ENV === 'production'){
  var io = require('socket.io').listen(server);

  require('./routes/socket.js').socketf(io);
} else {
  var io = require('socket.io').listen(serverhttp);

  require('./routes/socket.js').socketf(io);
}

export default app;
