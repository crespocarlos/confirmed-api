
# Confirmed API

### Setup

Run the database image
```bash
docker build -t confirmed-db -f docker/postgres/Dockerfile .
docker run -it -p 5432:5432 confirmed-db
```

Run the migrations
```js
  npm install
  npm run migrate up
```

### Start
```js
  npm run start:dev
```
