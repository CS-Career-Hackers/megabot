# 2 stage build to minimize image size. Resulting image will only have lib/*. This reduces image size from ~400MB to ~250MB

# First build lib/*
FROM node:14-alpine AS BUILDER

# Install app dependencies
WORKDIR /usr/src/build
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
# Bundle app source
COPY . .

# Build
CMD [ "yarn", "run", "build" ]


# Move lib/* to runner image
FROM node:14-alpine

# Copy lib/* from BUILDER
WORKDIR /usr/src/app
RUN mkdir lib
COPY --from=BUILDER /usr/src/build/lib/ ./lib/
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production

# Run server
CMD [ "yarn", "run", "serve" ]
