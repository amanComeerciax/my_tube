FROM node:18

WORKDIR /app

# Dependencies first (cache ke liye)
COPY package*.json ./
RUN npm install

# Baaki code
COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
