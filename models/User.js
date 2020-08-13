
const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    availableNotepads: [{type: Types.ObjectId, ref: "Notepad"}],
    photo: {type: String, required: true, default: "default.jpg"},
    description: {type: String, required: false},
    company: {type: String, required: false}
});

module.exports = model('User', schema);