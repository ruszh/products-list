import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { Pool } from 'pg';

const app = express();

import user from './routes/user.route';

const port = 8000;

const pool = new Pool({
    user: 'ruslan',
    host: '127.0.0.1',
    database: 'mydb',
    password: '102938',
    port: 5432
});

// pool.query('SELECT * FROM shops WHERE id > 2')
//     .then(res => console.log(res.rows[0]))
//     .catch(e => setImmediate(() => {throw e}))

pool.connect((err, client, done) => {
    if(err) throw err;
    client.query('SELECT * FROM shops', (error, result) => {
        done();
        if(error) {
            console.log(error)
        } else {
            console.log(result)
        }
    })
});


app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', '*');
    next();
});

mongoose.connect('mongodb://127.0.0.1:27017');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/user', user);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);    
});