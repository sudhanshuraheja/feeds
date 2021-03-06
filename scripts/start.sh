#!/bin/bash

# Start Postgres
docker run -p 5432:5432 --name feeds_pg -d postgres:10.7

# Start Rabbit
docker run -p 4369:4369 -p 5671:5671 -p 5672:5672 -p 15672:15672 --name feeds_rabbit -d rabbitmq:3.7.14

# Start Redis
docker run -p 6379:6379 --name feeds_redis -d redis:5.0.4

# Start Rabbit Management console
sleep 10
docker exec feeds_rabbit rabbitmq-plugins enable rabbitmq_management