import mongoose from 'mongoose';

const list = mongoose.Schema({
    _id:  mongoose.Schema.Types.ObjectId,
    userId: { type: String, required: true },
    lists: { type: Array, required: true }
});

const List = mongoose.model('List', list);

export default List;