import mongoose from 'mongoose';

const list = mongoose.Schema({
    _id:  mongoose.Schema.Types.ObjectId,
    userId: { type: String, required: true },
    listName: { type: String, required: true },
    list: { type: Object, required: true },
    date: { type: Number, required: true }
});

const List = mongoose.model('List', list);

export default List;