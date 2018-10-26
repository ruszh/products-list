import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();

import user from './routes/user.route';

const port = 8000;

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