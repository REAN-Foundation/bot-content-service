FROM node:18-alpine AS builder
ADD . /app
RUN apk add bash
# RUN apk add --no-cache \
#         python3 \
#         py3-pip \
#     && pip3 install --upgrade pip \
#     && pip3 install \
#         awscli \
#     && rm -rf /var/cache/apk/*
RUN apk add --update alpine-sdk
WORKDIR /app
COPY package*.json /app/
RUN npm install -g typescript
COPY src ./src
COPY tsconfig.json ./
RUN npm install
RUN npm run build

# RUN npm run build

FROM node:18-alpine
RUN apk add bash
# RUN apk add --no-cache \
#         python3 \
#         py3-pip \
#     && pip3 install --upgrade pip \
#     && pip3 install \
#         awscli \
#     && rm -rf /var/cache/apk/*
RUN apk add --update alpine-sdk
RUN apk update
RUN apk upgrade
ADD . /app
WORKDIR /app

COPY package*.json /app/
RUN npm install pm2 -g
RUN npm install sharp
COPY --from=builder ./app/dist/ ./app/dist/

RUN chmod +x /app/entrypoint.sh
# ENTRYPOINT ["/bin/bash", "-c", "/app/entrypoint.sh"]
CMD ["node", "./dist/src/index.js"]
