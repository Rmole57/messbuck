const Pool = require('pg').Pool
const pool = new Pool({
  user: 'messmaster',
  host: 'localhost',
  database: 'messbuckdb',
  port: 5432,
})

const insertRequest = (req, res) => {
  const bucketName = req.params.bucket;

  const headers = JSON.stringify(req.headers);
  const body = JSON.stringify(req.body);
  const method = JSON.stringify(req.method);

  const requestStr = `{ "method": ${method}, "headers": ${headers}, "body": ${body} }`;

  pool.query(
    `INSERT INTO requests (bucket, req_body) VALUES (
      $1,
      $2);`,
      [bucketName, requestStr],
      (error, results) => {
        if (error) { throw error; }
        res.status(201).send(`Request added in ${bucketName}!`)
      }
  )
}

const getRequestsByBuck = (req, res) => {
  const bucketName = req.params.bucket;
  pool.query(
    `SELECT * FROM requests WHERE bucket=$1 ORDER BY created_at DESC LIMIT 10;`,
    [bucketName],
    (error, results) => {
      if (error) { throw error; }
      res.status(200).json(results.rows);
    })
}

module.exports = {
  getRequestsByBuck,
  insertRequest
}
