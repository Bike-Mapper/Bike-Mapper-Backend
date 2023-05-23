#!/bin/bash

echo "[BIKE-MAPPER][INFO ] Container bike-mapper-app started"

# get source files
mkdir -p /bike-mapper && cd /bike-mapper

# rm -rf app
git clone https://github.com/Bike-Mapper/Bike-Mapper-Frontend.git app 
cd app/photo-gallery

if test -f "/bike-mapper/app/photo-gallery/.env"; then
    rm /bike-mapper/app/photo-gallery/.env
fi

# install project dependencies
npm install
npm install -g n

n lts
# start app
npm build
npm start

tail -f /dev/null