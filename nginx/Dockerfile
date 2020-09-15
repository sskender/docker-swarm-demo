FROM nginx:latest

# copy the config files
RUN rm /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/conf.d/backend.conf

# copy ssl files
RUN mkdir /certs
COPY certs/* /certs/
