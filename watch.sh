#!/bin/bash
while true
do
  inotifywait -r -e modify,close_write,move,create,delete ./ && make
done
