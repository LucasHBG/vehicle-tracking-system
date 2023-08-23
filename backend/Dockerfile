FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /home/node/app

USER node

# Comando nao necessário já que no devcontainer já tem esse parametro
CMD [ "tail", "-f", "/dev/null" ]