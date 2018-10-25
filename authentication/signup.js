const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const signup = (req, res) => {
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

module.exports = signup;