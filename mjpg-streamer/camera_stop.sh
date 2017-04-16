#!/bin/bash

# Cargamos el fichero de configuración:
. project_path.cfg

# Guardar el estado:
echo -n 0 > "$ovencampath/public/resources/estado_mjpgstreamer.txt"

if pgrep mjpg_streamer
then
  # Matamos el proceso MJPG_STREAMER
  kill $(pgrep mjpg_streamer) > /dev/null 2>&1
  echo "mjpg_streamer stopped"
else
  echo "mjpg_streamer not running"
fi

