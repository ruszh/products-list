import mongoose from 'mongoose';
import List from '../models/list.model';

export function save(req, res) {
    List.findOne({ userId: req.body.userId })
                .then(userList => {
                    if(!userList) {
                        if(req.body.userId && req.lists) {
                            return;
                        }
                    }
                })
                .catch(err => console.log(err));
}