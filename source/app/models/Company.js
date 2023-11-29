const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');
const vietnam = moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss');

const companySchema = new Schema({
    _id: { type: String, default: 'C' + new mongoose.Types.ObjectId().valueOf() },
    name: { type: String },
    category: { type: String },
    logo: { type: String },
    place: [String],
    website: { type: String },
    desc: [String],
    status: { type: Boolean, default: true },
    createAt: { type: String, default: vietnam },
});

companySchema.methods.getPlace = function (places) {
    var tmp = places[0].split(', ').length;
    return places[0].split(', ')[tmp - 1] + ' và ' + places.length + ' nơi khác';
};

companySchema.methods.getPostDay = function (createAt) {
    return createAt.split(' ')[0];
};

module.exports = mongoose.model('Company', companySchema);
