FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --prefer-offline --legacy-peer-deps
COPY . .
EXPOSE 3000
RUN npx prisma generate
RUN npx prisma db push
CMD ["npm", "run", "dev"]