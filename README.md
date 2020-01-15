# docker-swarm-demo
Docker swarm deployment demo with Nginx as front load balancer and reverse proxy


## About this project
Load balancing to simple Node application
Load balancing to simple Flask application and Redis (from official Docker documentation)


### Initial setup
Create a new swarm:
```bash
docker swarm init
```
Verify and get info:
```bash
docker node ls
```

Build images locally and don't complicate additionally with docker registry:
```bash
# build app images
docker build --tag sskender/app-node app-node/      # build node application image
docker build --tag sskender/app-py app-py/          # build python application image

# build nginx reverse proxy image
docker build --tag sskender/swarm-nginx nginx/      # build custom nginx image
```

Verify build images:
```bash
docker image ls
```


### Ignore docker-compose files and run everything manually

Run node-app in swarm mode and expose port to local machine port 3000:
```bash
# run 2 replicas of node app
docker service create --name app-node-swarm -p3000:5000 --replicas 2 sskender/app-node

# verify
docker service ls
docker service ps app-node-swarm

# re-scale
docker service scale app-node-swarm=5

# verify
docker ps

# verify in browser
curl 127.0.0.1
for i in {1..20}; do curl 127.0.0.1:3000; echo "\n"; done
```

Create overlay network and don't expose ports to local machine:
```
# create overlay network
docker network create -d overlay swarm-net
docker network ls

# map app-node service to overlay network
docker service create --name app-node-swarm --replicas 2 --network swarm-net sskender/app-node

# map nginx service to overlay network and expose port 80
docker service create --name nginx-swarm --replicas 1 -p 80:80 --network swarm-net sskender/swarm-nginx

# show services
docker service ls
```


### Use docker-compose file


#### Resources
 Load Balancing Containers in a Docker Swarm Cluster with NGINX and NGINX Plus (Nginx conference 2016)