import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.PGCONFIG
});

export function getLists(req, res) {
  const data = {};
  pool.connect((err, client, done) => {
      if(err) throw err;
      client.query('SELECT * FROM shops', (error, result) => {
          if(error) {
              console.error(error)
          } else {
              data.shops = result.rows;
          }
      });
      client.query('SELECT * FROM products', (error, result) => {
          done();
          if(error) {
              console.log(error)
          } else {
              data.products = result.rows;
              res.json(data);
          }
      });
  });

}