# Docker Swarm - demo

Load balancing of Node and Python applications in Docker Swarm with Nginx as a reverse proxy.
The setup decribed below is used on a single server machine, and a single docker node running as master. Deployment goal is to spawn multiple app instances accross many cpu cores.
For other configurations, host names in nginx config file are ought to be changed accordingly.

## About this project

- Load balancing to simple Node.js application
- Load balancing to simple Flask Python application and Redis cache (from official Docker documentation)
- Using Nginx as reverse proxy (with SSL certificate)

## Initial setup

Create a new swarm:

```bash
docker swarm init
```

Verify docker node and get info:

```bash
docker node ls
```

Node can be removed with the following command:

```bash
docker swarm leave
```

Build images locally and don't complicate additionally with docker registry:

```bash
# build app images
docker build --tag sskender/app-node app-node/      # build node application image
docker build --tag sskender/app-py app-py/          # build python application image

# build nginx reverse proxy image
docker build --tag sskender/nginx nginx/            # build custom nginx image
```

Verify build images:

```bash
docker image ls
```

Three images are created:

- sskender/app-node
- sskender/app-py
- sskender/nginx

## Running

### Node application

Run app-node in docker swarm and expose port to local machine's port 3000:

```bash
# run 2 replicas of node app
docker service create --name app-node-swarm -p 3000:5000 --replicas 2 sskender/app-node

# verify
docker ps
docker service ls
docker service ps app-node-swarm

# re-scale
docker service scale app-node-swarm=5

# verify rescale
docker ps
docker service ls
docker service ps app-node-swarm

# verify in browser
curl 127.0.0.1
for i in {1..20}; do curl 127.0.0.1:3000; echo "\n"; done
```

### Python application

Run app-py and redis in docker swarm and expose port to local machine's port 5000:

```bash
# create overlay network for redis and python

# run redis

# run 2 replicas of python flask app

# verify

# re-scale

# verify rescale

# verify in browser

# check redis log
```

### Nginx as reverse proxy

Create overlay network and don't expose any applications' ports, use nginx to handle proxying instead:

```bash
# create overlay network
docker network create -d overlay swarm-net --attachable
docker network ls

# map app-node service to overlay network
docker service create --name app-node-swarm --replicas 2 --network swarm-net sskender/app-node

# map app-py service to overlay network

# map nginx service to overlay network and expose ports 80 and 443
docker service create --name nginx-swarm --replicas 1 -p 80:80 -p 443:443 --network swarm-net sskender/nginx

# show services
docker service ls

# verify
docker ps

# verify in browser
curl --insecure https://127.0.0.1/node/
curl --insecure https://127.0.0.1/py/

# verify multiple replicas are present
for i in {1..20}; do curl --insecure https://127.0.0.1/node/; echo "\n"; done
for i in {1..20}; do curl --insecure https://127.0.0.1/py/; echo "\n"; done
```

Shutdown everything:

```bash
# shutdown services
docker service rm app-node-swarm
docker service rm app-py-swarm
docker service rm nginx-swarm

# check processes (wait a few seconds for graceful shutdown)
docker ps

# remove network
docker network rm swarm-net

# remove docker node
docker swarm leave --force
```

#### Resources

- Load Balancing Containers in a Docker Swarm Cluster with NGINX and NGINX Plus (Nginx conference 2016)
- [Docker orchestration with swarm and compose](https://www.ionos.com/digitalguide/server/know-how/docker-orchestration-with-swarm-and-compose/)
