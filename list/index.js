import mongoose from 'mongoose';
import List from '../models/list.model';

export async function save(req, res) {
    const list = await List.findOne({ listName: req.body.listName });
    if(list) {
        return res.status(500).json({
            fail: "List with the same name exists"
        })
    }

    const newList = new List({
        _id: new mongoose.Types.ObjectId(),
        userId: req.body.userId,
        listName: req.body.listName,
        list: req.body.list,
        date: req.body.date
    });

    const result = await newList.save();

    if(result) {
        console.log(result);
        return res.status(200).json({
                success: 'New list has been created'
            });
    }

    return res.status(500).json({
                error: 'err'
            });
}

export async function load(req, res) {
    const limit = req.body.limit;
    const items = await List.find({ userId: req.body.userId }).countDocuments();
    const pages = Math.ceil(items / limit);
    const page = Number(req.body.page) || 1;
    const sort = req.body.sort || 'listName';

    const skip = page == 1 ? 0 : (page - 1) * limit;

    const lists = await List.find({ userId: req.body.userId },
                                  { listName: 1, _id: 1, date: 1 })
                                  .sort({ [sort]: sort === 'listName' ? 1 : -1 })
                                  .skip(skip)
                                  .limit(limit);


    if(!lists) {
        return res.send('Not found')
    }

    return res.status(200).json({
                items,
                pages,
                current: page,
                lists,
                sort
           });
}

export async function getList(req, res) {
    const list = await List.findOne({ _id: req.body.listId });

    if(list) {
        return res.status(200).json(list);
    }

    return res.status(500);
}