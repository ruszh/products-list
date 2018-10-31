import mongoose from 'mongoose';
import List from '../models/list.model';

//req.body.list = { 
//     listName: 'foo', 
//     list: { shops: [1,2,3], products: [1,2,3] } 
// }



export function save(req, res) {
    List.findOne({ userId: req.body.userId })
                .then(userList => {
                    if(!userList) {
                        if(req.body.userId && req.body.list) {
                            const listsArr = [];
                            listsArr.push(req.body.list);                            
                            const list = new List({
                                _id: new mongoose.Types.ObjectId(),
                                userId: req.body.userId,
                                lists: listsArr
                            });
                            list.save().then((result) => {
                                console.log(result);
                                res.status(200).json({
                                    success: 'New list has been created'
                                });
                            }).catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                        }
                        return;
                    } else {
                        const newList = {
                            _id: new mongoose.Types.ObjectId(),
                            listName: req.body.listObj.listName,
                            list: req.body.listObj.list
                        }
                        userList.lists.push(newList)                        
                        userList.save((err, list) => {
                            if(err) throw err;
                            res.status(200).json({
                                status: 'List saved',
                                list: list
                            });
                        });
                    }
                })
                .catch(err => console.log(err));
}

export function load(req, res) {
    List.findOne({ userId: req.body.userId })
            .then(userList => {
                if(!userList) {
                    res.send('Not find')
                } else {
                    res.status(200).json({
                        lists: userList.lists.map(el => {
                            return { listName: el.listName, _id: el._id };
                        })
                    })
                }
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
}

export function getList(req, res) {
    const query = req.body.query;
    List.findOne({ userId: query.userId })        
        .then(listObj => {            
            if(!listObj) return;
            const list = listObj.lists.find(el => el._id == query.listId);
            res.status(200).json(list)
        })
        .catch(err => console.log(err))
}