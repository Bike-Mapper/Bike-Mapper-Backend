#!/bin/bash

function _main
{
    path=$(pwd)
    env_file_path=${path}/.env

    echo $path
    echo $env_file_path

    if [ ! -f "${env_file_path}" ]; then
        cp "${path}/.env-example" .env
    fi

    cat .env

    sed -i 's/\r$//' "$env_file_path"
    source $env_file_path

    docker-compose down

    image_name="bike-mapper/mongo:latest"
    if [[ "$(docker images -q $image_name 2> /dev/null)" == "" ]]; then
        docker-compose build mongo
    fi

    image_name="bike-mapper/mongo-express:latest"
    if [[ "$(docker images -q $image_name 2> /dev/null)" == "" ]]; then
        docker-compose build mongo-express
    fi

    image_name="bike-mapper/api:latest"
    if [[ "$(docker images -q $image_name 2> /dev/null)" == "" ]]; then
        docker-compose build api
    fi

    image_name="bike-mapper/app:latest"
    if [[ "$(docker images -q $image_name 2> /dev/null)" == "" ]]; then
        docker-compose build app
    fi

    docker-compose up -d
    docker-compose logs -f #api # app
}

_main