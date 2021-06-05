const express = require('express')
const app = express()
const db = require('./queries')
const port = 4000

app.use(express.json());

const generateBucketString = () => {
  let bucketString = '';
  for (let i = 0; i < 5; i++) {
    bucketString += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  }

  return bucketString;
}

app.get('/', (request, response) => {
  response.status(200).send("Welcome to MessageBucket!");
})

app.get('/new', (request, response) => {
  const newBucket = generateBucketString();
  response.status(200).send(`Your new bucket: ${request.hostname}/${newBucket}`);
});

app.all('/:bucket', (request, response) => {
  if (request.query.hasOwnProperty('inspect') && request.method == "GET") {
    db.getRequestsByBuck(request, response);
  } else {
    db.insertRequest(request, response);
  }
});

app.listen(port, () => {
  console.log(`running on ${port}`);
})
