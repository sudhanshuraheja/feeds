#!/bin/bash
docker stop feeds_pg
docker rm feeds_pg

docker stop feeds_rabbit
docker rm feeds_rabbit

docker stop feeds_redis
docker rm feeds_redis
