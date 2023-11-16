FROM node:20-alpine3.17 AS dev

# Instala o git
RUN apk --update --no-cache add git openssh

# Importa as configurações do Git
RUN git config --global safe.directory '*'

# Cria um diretório de trabalho
WORKDIR /usr/app

COPY . .

# Copiar env.example para .env
COPY [".env.example", ".env"]

# Instala as dependências do projeto 
RUN npm ci && npm cache clean --force

# Exposição da porta
EXPOSE 3001

CMD ["npm", "run", "dev"]