#!/bin/bash

echo "[BIKE-MAPPER][INFO ] Container bike-mapper-api started"

# get source files
mkdir -p /bike-mapper && cd /bike-mapper
git clone https://github.com/Bike-Mapper/Bike-Mapper-Backend.git api && cd api
git checkout "master"

# install project dependencies
npm install

# start api
# if [ $REACT_APP_API_DOMAIN == localhost ]; then
#     npm run swagger-autogen
# else
#     npm run start:dev --prefix $PWD
# fi

# lock container
tail -f /dev/null