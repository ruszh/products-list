import bcrypt from 'bcrypt';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config()

const pool = new Pool({
    connectionString: process.env.PGCONFIG
});



//--------------- Authentication methoods --------------------------------//

export function signin(req, res) {
    if(req.body.userId) {        
        res.send('Request with user ID, token authentication works!YEEeeeaahhh %)')
    }
    User.findOne({ email: req.body.email })        
        .then((user) => {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if(err) {
                    return res.status(401).json({
                        failed: 'Unauthorized Access'
                    });
                }
                if(result) {
                    const JWTToken = jwt.sign({
                        email: user.email,
                        _id: user._id
                    },  
                    process.env.JWTSECRET,
                    {
                        expiresIn: '2h'
                    });
                    return res.status(200).json({
                        success: `Success. Welcome ${user.email}!`,
                        data: user,
                        token: JWTToken
                    })
                }
                return res.status(401).json({
                    failed: 'Unauthorized Access'
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                error: "Something goes wrong"
            });
        });
}

export function signup(req, res) {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) {
            return res.status(500).json({
                error: err
            });
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
            });
            user.save().then((result) => {
                console.log(result);
                res.status(200).json({
                    success: 'New user has been created'
                });
            }).catch(err => {
                res.status(500).json({
                    error: err
                });
            });
        }
    });
}

export function verifyUser(req, res) {    
    jwt.verify(req.headers['x-access-token'], process.env.JWTSECRET, (err, decoded) => {
        if(err) {
            console.log(err.message)
            res.json({
                error: 'token is not valid'
            })
        } else {
            User.findOne({ _id: decoded._id})
                .then(user => {                    
                    res.json({
                        user: user
                    })
                })                
                .catch(err => console.log(err))
        }
    })
}

//------------------------------------------------------------------------//

export function getLists(req, res) {
    const data = {};
    pool.connect((err, client, done) => {
        if(err) throw err;
        client.query('SELECT * FROM shops', (error, result) => {
            if(error) {
                console.log(error)
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