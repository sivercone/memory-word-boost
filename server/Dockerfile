# stage 1 - build
FROM node:16 AS builder
WORKDIR /mwb-server
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# stage 2 - production
FROM node:16
WORKDIR /mwb-server
COPY package*.json ./
RUN npm install --production
COPY --from=builder /mwb-server/dist ./dist
COPY --from=builder /mwb-server/.env .
EXPOSE 7001
CMD NODE_ENV=production node dist/server.js