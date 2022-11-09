require('dotenv').config()
const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
})

const getAllProducts = (req, res) => {
  let lim = req.query.count || req.body.count || 5;
  let offset = (req.query.page - 1) * lim || 0
  let query = `SELECT * FROM product OFFSET ${offset} LIMIT ${lim} `;
  pool.query(query).then((data)=>  {
    res.send(data.rows);
  }).catch(err=>{
    console.log('error in getAllProducts', err);
    res.status(500).send(err);
  })
}

const getProductById = (req, res) => {
  let id = req.params.product_id || 1;
  let query = `SELECT * FROM product WHERE id = ${id}`
  pool.query(query).then((data)=> {
    res.send(data.rows);
  }).catch(err=>{
    console.log('error in getProductById', err);
    res.status(500).send(err);
  })
}

// const getProductStyles = (req, res) => {
//   let id = req.query.id || req.body.id;
//   let query = `SELECT * FROM styles WHERE productId = ${id}`
//   pool.query(query).then((data)=>{
//     let photos = [];
//     let skus = [];
//     data.rows.forEach( style => {
//       query = `SELECT thumbnail_url, url FROM photos WHERE styleId = ${style.id}`
//       photos.push(pool.query(query).then (photoRes => {
//         return photoRes.rows;
//       }));
//       query = `SELECT size, quantity FROM skus WHERE styleId = ${style.id}`
//       skus.push(pool.query(query).then(skusRes => {
//         return skusRes.rows;
//       }));
//     })
//     Promise.all(photos).then((promisedPhotos)=> {
//       data.rows.forEach((style, i) => {
//         style.photo = promisedPhotos[i];
//       })
//       Promise.all(skus).then((promisedSkus)=> {
//         data.rows.forEach((style, i) => {
//           style.skus = promisedSkus[i];
//         })
//         res.send(data.rows);
//       })
//     })
//   }).catch(err=> {
//     console.log('error in getProductStyles ', err);
//     res.status(500).send(err);
//   })
// }

const getProductStyles = (req, res) => {
  let id = req.params.product_id || 1;
  let query = `SELECT json_build_object
  (
      'product_id', ${id},
      'results',
    (SELECT json_agg
      (json_build_object
        (
        'style_id', id,
        'name', name,
        'original_price', original_price,
        'sale_price', sale_price,
        'default?', default_style,
        'photos',(SELECT json_agg(json_build_object(
              'thumbnail_url', thumbnail_url,
              'url', url)
        ) FROM photos where photos.styleId = styles.id),
        'skus',(SELECT json_object_agg(
              id, (
                SELECT json_build_object(
                'quantity', quantity,
                'size', size)
                )
        ) FROM skus WHERE skus.styleId=styles.id
             )
        )
      ) FROM styles WHERE productId = ${id}
    )
  )`
  pool.query(query).then((data)=>{
    res.send(data.rows[0].json_build_object);
  }).catch(err=> {
    console.log('error in getProductStyles ', err);
    res.status(500).send(err);
  })
}

const getRelatedItems = (req, res) => {
let id = req.params.product_id || 1;
let query = `SELECT array_agg(related_product_id) FROM related WHERE current_product_id = ${id}`;
pool.query(query).then((data)=>  {
  res.send(data.rows[0].array_agg);
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