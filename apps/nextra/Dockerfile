FROM node:18-alpine3.18

#RUN npm install yarn --global && npm cache clean --force
ENTRYPOINT [ "/bin/sh" ]
WORKDIR /workspace

COPY . .

RUN yarn
RUN yarn prepare-dev 
RUN node prepare.js
RUN yarn build
RUN yarn docs:build