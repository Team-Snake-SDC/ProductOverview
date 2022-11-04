const Pool = require('pg').Pool
const pool = new Pool({
  user: 'andrew',
  host: 'localhost',
  database: 'productOverview',
  password: '1234',
  port: 5432,
})

const getAllProducts = (req, res) => {
  let lim = req.query.count || req.body.count || 5;
  let offset = (req.query.page - 1) * lim || 0
  let query = `SELECT * FROM product LIMIMT ${lim} OFFSET ${offset}`;
  pool.query(query).then((data)=>  {
    res.send(data.rows);
  }).catch(err=>{
    console.log('error in getAllProducts', err);
    res.status(500).send(err);
  })
}

const getProductById = (req, res) => {
  let id = req.query.id || req.body.id;
  let query = `SELECT * FROM product WHERE id = ${id}`
  pool.query(query).then((data)=> {
    res.send(data.rows);
  }).catch(err=>{
    console.log('error in getProductById', err);
    res.status(500).send(err);
  })
}

const getProductStyles = (req, res) => {
  let id = req.query.id || req.body.id;
  let query = `SELECT * FROM styles WHERE productId = ${id}`
  pool.query(query).then((data)=>{
    let photos = [];
    let skus = [];
    data.rows.forEach( style => {
      query = `SELECT thumbnail_url, url FROM photos WHERE styleId = ${style.id}`
      photos.push(pool.query(query).then (photoRes => {
        return photoRes.rows;
      }));
      query = `SELECT size, quantity FROM skus WHERE styleId = ${style.id}`
      skus.push(pool.query(query).then(skusRes => {
        return skusRes.rows;
      }));
    })
    Promise.all(photos).then((promisedPhotos)=> {
      data.rows.forEach((style, i) => {
        style.photo = promisedPhotos[i];
      })
      Promise.all(skus).then((promisedSkus)=> {
        data.rows.forEach((style, i) => {
          style.skus = promisedSkus[i];
        })
        res.send(data.rows);
      })
    })
  }).catch(err=> {
    console.log('error in getProductStyles ', err);
    res.status(500).send(err);
  })
}

const getRelatedItems = (req, res) => {
let id = req.query.id || req.body.id;
let query = `SELECT * FROM related WHERE current_product_id = ${id}`;
pool.query(query).then((data)=>  {
  res.send(data.rows);
}).catch(err=> {
  console.log('error in getRelatedItems', err);
  res.status(500).send(err);
})
}

module.exports = {
  getAllProducts,
  getProductById,
  getProductStyles,
  getRelatedItems
}