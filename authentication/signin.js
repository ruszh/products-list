const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const signin = (req, res) => {
    User.findOne({ email: req.body.email })
        .exec()
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
                    'secret',
                    {
                        expiresIn: '2h'
                    });
                    return res.status(200).json({
                        success: 'Success. Welcome!',
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

module.exports = signin;