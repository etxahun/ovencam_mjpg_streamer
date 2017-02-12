#!/bin/bash
clear

# Print the IP address
_IP=$(hostname -I) || true
if [ "$_IP" ]; then
  printf "My IP address is %s\n" "$_IP"
fi

echo

# Guardar el estado:
. project_path.cfg
#echo -n 1 > "/home/pi/oven_cam/public/resources/estado_mjpgstreamer.txt"
echo -n 1 > "$ovencampath/public/resources/estado_mjpgstreamer.txt"

# Start Motion JPEG

cd /usr/src/mjpg-streamer/mjpg-streamer-experimental/
export LD_LIBRARY_PATH=.
# ./mjpg_streamer -o "output_http.so -w /home/pi/oven_cam/prueba/camera/www -p 8081" -i "input_raspicam.so -rot 270 -fps 15 -q 50 -x 640 -y 480 ex night"
./mjpg_streamer -o "output_http.so -w $ovencampath/mjpg-streamer/www -p 8081 -c etxea:etxean3sb" -i "input_raspicam.so -fps 25 -q 50 -x 320 -y 240 ex night"
