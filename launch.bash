#!/usr/bin/env bash
set -eux

echo Connect to the ip $(docker-machine ip)

docker-compose build
docker-compose up

#docker login --username=omnidyalog --email=omnidyalog@gmail.com
# $ docker tag local-image:tagname omnidyalog/server:tagname
# $ docker push omnidyalog/server:tagname
#action="${1:-run}"
#
#docker build -t omni .
#
#case "$action" in
#    run)
#        ip="$(docker-machine ip)"
#        port=8080
#        echo "===> http://$ip:$port/"
#        docker run -it -P ${omni_tag}
#    ;;
#    push)
#
#        docker tag omni omnidyalog/server:latest
##        docker tag local-image:omni omnidyalog/server:omni
#        docker push omnidyalog/server:latest
#    ;;
#    *)
#        echo "action not found"
#    ;;
#esac
# pushing

#docker push omnidyalog/server:omni
  