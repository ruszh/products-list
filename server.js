import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import redis from 'redis';

const client = redis.createClient();

const app = express();

import user from './routes/user.route';

const port = 8000;

client.on('connect', () => {
    console.log('Client connected to redis DB')
});

client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

client.set('test key', 'test value', redis.print);
client.get('test key', (err, res) => {
    if(err) {
        console.log(err);
        throw err;
    }
    console.log(`Result: ${res}`)
})




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