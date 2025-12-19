FROM node:24

WORKDIR /RetentionAI_fr

COPY package.json yarn.lock* package-lock.json* ./

RUN npm install

COPY . .

#RUN npm run build

#EXPOSE 3000

CMD ["npm", "run", "dev"]