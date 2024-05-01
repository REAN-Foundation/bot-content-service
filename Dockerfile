FROM node:18-alpine3.18 AS builder
ADD . /app
RUN apk add bash
RUN apk add --update alpine-sdk
RUN apk update && \
    apk add --no-cache \
        bash \
        python3 \
        py3-pip \
        groff \
        less \
        mailcap

# Set up a virtual environment
RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"

# Upgrade pip and install awscli inside the virtual environment
RUN /venv/bin/pip install --upgrade pip && \
    /venv/bin/pip install awscli

WORKDIR /app
COPY package*.json /app/
RUN npm install -g typescript
COPY src ./src
COPY tsconfig.json ./
RUN npm install
RUN npm run build

# RUN npm run build

FROM node:18-alpine3.18
RUN apk add bash
RUN apk add --update alpine-sdk
RUN apk update && \
    apk add --no-cache \
        bash \
        python3 \
        py3-pip \
        groff \
        less \
        mailcap

# Set up a virtual environment
RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"

# Upgrade pip and install awscli inside the virtual environment
RUN /venv/bin/pip install --upgrade pip && \
    /venv/bin/pip install awscli
RUN apk update
RUN apk upgrade
ADD . /app
WORKDIR /app

COPY package*.json /app/
RUN npm install pm2 -g
RUN npm install sharp
COPY --from=builder ./app/dist/ ./app/dist/

RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/bin/bash", "-c", "/app/entrypoint.sh"]
# CMD ["node", "./dist/src/index.js"]