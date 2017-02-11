# ovencam_mjpg_streamer
The idea behind "ovencam" is to use the Raspberry Pi Zero (v1.3) together with a "camera module" and the "ZeroView" holder to provide a MJPG-Streaming Web applicationsolution. 

![alt tag](https://github.com/etxahun/ovencam_mjpg_streamer/blob/master/ZeroView_1.jpg)
![alt tag](https://github.com/etxahun/ovencam_mjpg_streamer/blob/master/ZeroView_2.jpg)
![alt tag](https://github.com/etxahun/ovencam_mjpg_streamer/blob/master/ZeroView_3.jpg)

## Table of Contents
 - [Installation](#installation)
 - [Configuration](#configuration)
 - [Usage](#usage)
 - [Contributing](#contributing)

## Installation

First of all install the prerequisites:

    $ sudo apt-get update
    $ sudo apt-get upgrade
    $ sudo apt-get install g++ curl pkg-config libv4l-dev libjpeg-dev build-essential libssl-dev cmake git-core build-essential libjpeg8-dev imagemagick subversion
    $ sudo apt-get autoremove
    $ sudo shutdown -r now

Then we can install motion-jpeg (mjpeg):

     $ cd /usr/src
     $ sudo mkdir mjpg-streamer
     $ sudo chown pi:users mjpg-streamer
     $ cd mjpg-streamer
     $ git clone //github.com/jacksonliam/mjpg-streamer.git .
     $ cd mjpg-streamer-experimental
     $ make
     $ sudo make install

After the compilation, shutdown the pi and attach the camera:

     $ cd /usr/src/mjpg-streamer/mjpg-streamer-experimental/
     $ export LD_LIBRARY_PATH=.
     $ ./mjpg_streamer -o "output_http.so -w ./www" -i "input_raspicam.so -x 640 -y 480 -fps 20 -ex night"

My RPi has the following IP address: 192.168.20.83 so you can see the camera at http://192.168.20.83:8080/stream.html

## Configuration
:warning: **Warning:** keep in mind the following points:
* NodeJS Web server port: 8080
* MJPG-Streamer server port: 8081
* The project is intended to be installed inside "/home/pi" path.

The following tweaks are needed in order to make it work:
1. If you want or have to customize the path of the project, the following files must be edited:

* **server.js**
``` javascript
 var path_lee_estado_mjpgstreamer = "/home/pi/ovencam_mjpg_streamer/public/resources/lee_estado_mjpgstreamer.php";
 var path_camera_start 			  = "/home/pi/ovencam_mjpg_streamer/mjpg-streamer/camera_start.sh";
 var path_camera_stop 			  = "/home/pi/ovencam_mjpg_streamer/mjpg-streamer/camera_stop.sh";
 var path_mjpgstreamer_stop 	  = "/home/pi/ovencam_mjpg_streamer/public/resources/para_mjpgstreamer.php";
```

* **mjpg-streamer/**
 * **camera_stop.sh:**  
``` shell 
echo -n 0 > "/home/pi/ovencam_mjpg_streamer/public/resources/estado_mjpgstreamer.txt"
```
 * **camera_start.sh:**
``` shell
echo -n 1 > "/home/pi/ovencam_mjpg_streamer/public/resources/estado_mjpgstreamer.txt"
./mjpg_streamer -o "output_http.so -w /home/pi/ovencam_mjpg_streamer/mjpg-streamer/www -p 8081 -c <user>:<passwd>" -i "input_raspicam.so -rot 270 -fps 25 -q 50 -x 320 -y 240 ex night"
```

* **public/resources/**
 * **arranca_mjpgstreamer.php:**
``` php
$file = fopen("/home/pi/ovencam_mjpg_streamer/public/resources/estado_mjpgstreamer.txt", "w") or die("Unable to open file!");
```
 * **para_mjpgstreamer.php:**
``` php
$file = fopen("/home/pi/ovencam_mjpg_streamer/public/resources/estado_mjpgstreamer.txt", "w") or die("Unable to open file!");
```
 * **lee_estado_spibox.php:**
``` php
$file = fopen("/home/pi/ovencam_mjpg_streamer/public/resources/estado_spibox.txt", "r") or die("Unable to open estado_spibox.txt file!");
```
 * **lee_estado_mjpgstreamer.php:**
``` php
$file = fopen("/home/pi/ovencam_mjpg_streamer/public/resources/estado_mjpgstreamer.txt", "r") or die("Unable to open estado_mjpgstreamer.txt file!");
```

Additionaly, check that the following lines of "/public/index.html" contains the proper IP address (and MJPG-Streamer PORT):
``` html
            <div id="arriba">
                <object data="http://192.168.20.83:8081/?action=stream" width="320" height="240">
                    <embed src="http://192.168.20.83:8081/?action=stream" width="320" height="240"> </embed>
                        Error: No se ha podido cargar el vídeo.
                </object>
            </div>
```

## Usage

To be sure that the application is running continously, we will use "Forever" NodeJS module:
``` shell
$ [sudo] npm install forever -g
```
:warning: **Note:** If you want to use "forever" programmatically you should install forever-monitor.
``` shell 
  $ cd /path/to/your/project
  $ [sudo] npm install forever-monitor
```
Once "forever" is installed we launch the application:
``` shell
 $ cd <project_path>
 $ forever start nserver.js
```
** Troubleshooting:**

The "forever" binary file location: /opt/nodejs/bin/forever
In order to be globally available the following "EXPORT" line has to be added in ".bashrc":
``` shell
$ nano /root/.bashrc
	
    export PATH=$PATH:/opt/nodejs/bin

$ exec bash
```
## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D
