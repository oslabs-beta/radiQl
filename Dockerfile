FROM node

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
RUN npm run build-prod

CMD ["npm", "run", "start"]