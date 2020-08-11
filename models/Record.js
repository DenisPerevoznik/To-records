const {Schema, model} = require('mongoose');

const schema = new Schema({
    title: {type: String, required: true, default: "New record"},
    description: {type: String, required: false, default: "<p>Write something here</p>"},
    width: {type: String, required: true, default: "4"},
    color: {type: String, default: "#ff7043"},
    isExecutable: {type: Boolean, required: false, default: false},
    isReady: {type: Boolean, required: false, default: false},
    date: {type: String, required: true}
    // notepad: {type: Types.ObjectId, ref: "Notepad"}
});

module.exports = model("Record", schema);