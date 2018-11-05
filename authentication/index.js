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

export async function signin(req, res) {    
    try {
        const user = await User.findOne({ email: req.body.email });
        
        if(user) {
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
    
        }
    } catch(err) {
        res.status(500).json({
            error: "Something goes wrong"
        });
    }
    
      
}

export function signup(req, res) {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
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

            try {
                const result = await user.save();
                
                console.log(result);
                return res.status(200).json({
                    success: 'New user has been created'
                });                

            } catch(err) {
                res.status(500).json({
                    error: err
                });
            }            
        }
    });
}

export function verifyUser(req, res) {    
    jwt.verify(req.headers['x-access-token'], process.env.JWTSECRET, async (err, decoded) => {
        if(err) {
            console.log(err.message)
            res.json({
                error: 'token is not valid'
            })
        } else {
            const user = await User.findOne({ _id: decoded._id});
            if(user) {
                return res.json({
                    user
                });
            }      
            return ;   
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