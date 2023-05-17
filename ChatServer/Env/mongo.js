const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatLogSchema = new Schema({
                                cmd: String,
                                opt: String,
                                id: String,
                                content: String
                                }, { timestamps: true });

module.exports = mongoose.model('chatLog', chatLogSchema);