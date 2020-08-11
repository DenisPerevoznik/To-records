
const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    image: {type: String, required: false},
    name: {type: String, required: true},
    description: {type: String, required: false},
    records: [{type: Object, ref: "Record"}], //[{type: Types.ObjectId, ref: "Record"}]
    accessUsers: [{type: Types.ObjectId, ref: "User"}],
    owner: {type: Types.ObjectId, ref: "User", required: true}
});

module.exports = model("Notepad", schema);