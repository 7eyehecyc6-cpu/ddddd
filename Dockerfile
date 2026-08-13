FROM node:20-slim
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY 8.js ./
EXPOSE 8080
CMD ["node", "8.js"]