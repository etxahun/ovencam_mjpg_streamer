// ======================================================== CONFIGURACIÓN ============================================================

// Express
var express     = require('express');
var app         = express();
var server      = require('http').Server(app);
var router      = express.Router();

// "path", "fs" and "server-favicon" modules
var path        = require('path');
var fs          = require('fs');
var favicon     = require('serve-favicon');

// The child_process module provides the ability to spawn child processes in a manner that is similar, but not identical, to popen.
var spawn   	= require('child_process').spawn;
var proc;

// child_process "EXEC" and "EXECFILE":
var exec 	= require('child_process').exec;
var execFile 	= require('child_process').execFile;

// Template engine
app.set('view engine', 'ejs');

// Favicon configuration
app.use(favicon(__dirname + '/public/favicon.ico'));

// "body-parser"
var bodyParser 	= require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Variables con rutas de programas:
var path_ovencam			= "/home/pi/oven_cam"

var path_lee_estado_mjpgstreamer 	= path_ovencam + "/public/resources/lee_estado_mjpgstreamer.php";
var path_camera_start 			= path_ovencam + "/mjpg-streamer/camera_start.sh";
var path_camera_stop 			= path_ovencam + "/mjpg-streamer/camera_stop.sh";
var path_mjpgstreamer_stop 		= path_ovencam + "/public/resources/para_mjpgstreamer.php";

// ===================================================================================================================================


// ======================================================== ROUTES ===================================================================

// route middleware that will happen on every request
router.use(function(req, res, next) {

    // log each request to the console
    console.log(req.method, req.url);

    // continue doing what we were doing and go to the route
    next();
});

router.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html'); // IMPORTANTE: hay que indicar la ruta completa del fichero.
});

router.get('/estadomjpgstreamer', function(req, res) {
    //res.sendFile(__dirname + '/public/resources/lee_estado_sistema.php');
    exec("php " + path_lee_estado_mjpgstreamer, (error, stdout, stderr) => {
        if (error) {
          //console.error("exec error: ", error);
          return;
        }
        res.send(stdout);
	//console.log("stdout: ", stdout);
        //console.log("stderr: ", stderr);
      });

});

router.post('/sistema', function(req, res) {
  if (req.body.estado == "on") {
      console.log("Encendiendo MJPG-Streamer...");
      exec("sh " + path_camera_start, (error, stdout, stderr) => {
	if (error) {
	  //console.error("exec error: ", error);
	  return;
	}
	//console.log("stdout: ", stdout);
	//console.log("stderr: ", stderr);
      });
      res.send("Encendido");
  } else if (req.body.estado == "off") {
      console.log("Apagando MJPG-Streamer...");
      exec("sh " + path_camera_stop, (error, stdout, stderr) => {
	if (error) {
	  //console.error("exec error: ", error);
	  return;
	}
	//console.log("stdout: ", stdout);
	//console.log("stderr: ", stderr);
      });
      res.send("Apagado");
  }
});


// NOTA IMPORTANTE: Es muy importante el orden ==> 1º app.use('/', router)  2º Static "public" 3º Static "stream"
// ---------------
//
// Apply the routes to our application
app.use('/', router);

// Sin utilizar "path" module ==> app.use(express.static('public'));
// Con "path" module:
app.use(express.static(path.join(__dirname, 'public')));

// ======================================================= FIN DE ROUTES =============================================================


// ======================================================= FUNCIONES =================================================================

//Función que nos forzará a que cada vez que arranquemos OVEN_CAM_MJPG-STREAMER el estado del streaming de video sea "PARADO".
function estado_parado_mjpg(){
      //exec("php " + path_mjpgstreamer_stop, (error, stdout, stderr) => {
      exec("sh " + path_camera_stop, (error, stdout, stderr) => {
        if (error) {
          //console.error("exec error: ", error);
          return;
        }
        //console.log("stdout: ", stdout);
        //console.log("stderr: ", stderr);
      });
}

// ======================================================= FIN DE FUNCIONES ==========================================================


// ======================================================= START THE SERVER ON PORT 8080 =============================================
server.listen(8080, function() {
  console.log('listening on *:8080');
  estado_parado_mjpg();
});

// ===================================================================================================================================

