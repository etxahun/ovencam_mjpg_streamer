# ovencam_mjpg_streamer
The idea behind "ovencam" is to use the Raspberry Pi Zero (v1.3) together with a "camera module" and the "ZeroView" holder to provide a MJPG-Streaming Web application. 

<img src="https://github.com/etxahun/ovencam_mjpg_streamer/blob/master/images/ZeroView_1.jpg" width = "30%" />
<img src="https://github.com/etxahun/ovencam_mjpg_streamer/blob/master/images/ZeroView_2.jpg" width = "30%" />
<img src="https://github.com/etxahun/ovencam_mjpg_streamer/blob/master/images/ZeroView_3.jpg" width = "30%" />

## Table of Contents
 - [Installation](#installation)
 - [Configuration](#configuration)
 - [Usage](#usage)
 - [Contributing](#contributing)
 - [References](#references)

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
* **NodeJS Web server port:** 8080
* **MJPG-Streamer server port:** 8081
* The project is intended to be installed inside "/home/pi" path.

If you want or have to customize the path of the project, the following files must be edited:

* **server.js**
Line #34:
 ``` javascript
 var path_ovencam = "/home/pi/oven_cam"
 ```

* **mjpg-streamer/**
 * **camera_stop.sh:**
 ``` shell
 echo -n 0 > "/home/odamae/odamaeweb_mjpg-streamer/public/resources/estado_mjpgstreamer.txt"
 ```
 * **camera_start.sh:**
 ``` shell
echo -n 1 > "/home/odamae/odamaeweb_mjpg-streamer/public/resources/estado_mjpgstreamer.txt"
./mjpg_streamer -o "output_http.so -w /home/odamae/odamaeweb_mjpg-streamer/mjpg-streamer/www -p 8081 -c <user>:<passwd>" -i "input_raspicam.so -rot 270 -fps 25 -q 50 -x 320 -y 240 ex nig$
 ```

* **public/resources/**
 Just configure the following configuration file:
 * **project_path_config.php**
 ``` php
 <?php
 $ovencam_path = '/home/pi/oven_cam';
 ?>
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
``` sh
$ [sudo] npm install forever -g
```
:warning: **Note:** If you want to use "forever" programmatically you should install forever-monitor.
``` sh 
  $ cd /path/to/your/project
  $ [sudo] npm install forever-monitor
```
Once "forever" is installed we launch the application:
``` sh
 $ cd <project_path>
 $ forever start nserver.js
```
:wrench: **Troubleshooting:**

The "forever" binary file location: /opt/nodejs/bin/forever
In order to be globally available the following "EXPORT" line has to be added in ".bashrc":
``` sh
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

## References

The following is a list of useful references used for the development of the application:
* [Getting Node and Motion Jpeg onto a R-Pi](https://skippy.org.uk/getting-node-and-motion-jpeg-onto-a-r-pi/)
* [Node.js app with forever running as a service daemon](http://www.slidequest.com/q/70ang)

