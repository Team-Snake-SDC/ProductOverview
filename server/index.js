require('dotenv').config()
const express = require('express');
const app = express();
const port = 3001;
const queries = require('./queries.js');

app.use(express.json());

app.get('/', (req, res) => {
  res.send({info: 'node.js, Express, and Postgres'});
})

app.get('/'+process.env.LOADIOKEY, (req, res) => {
  res.send(process.env.LOADIOKEY);
})
app.get('/products', queries.getAllProducts);
app.get('/products/:product_id', queries.getProductById);
app.get('/products/:product_id/styles', queries.getProductStyles);
app.get('/products/:product_id/related', queries.getRelatedItems)

app.listen(port, () => {
  console.log('app running on port', port);
})