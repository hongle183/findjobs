const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');
const vietnam = moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss');

const jobSchema = new Schema({
    _id: { type: String, default: 'J' + new mongoose.Types.ObjectId().valueOf() },
    name: { type: String },
    category: { type: String },
    company: { type: String, ref: 'Company' },
    place: [String],
    salary: { type: String },
    slot: { type: Number, min: 1 },
    deadline: { type: String },
    desc: [String],
    require: [String],
    benefit: [String],
    job_type: { type: String },
    position: { type: String },
    status: { type: Boolean, default: true },
    createAt: { type: String, default: vietnam },
});

jobSchema.methods.getPlace = function(places) {
    return places[0].split(': ')[0] + ' và ' + places.length + ' nơi khác';
}

jobSchema.methods.getPlaceDetail = function(places) {
    var result = [];
    places.forEach(place => {
        if (place.includes(': ')) {
            var arr = place.split(': ');
            result.push(arr[1] + ', ' + arr[0]);
        }
        else result.push(place);
    });
    return result;
}

jobSchema.methods.getPostDay = function(createAt) {
    return createAt.split(' ')[0];
}

module.exports = mongoose.model('Job', jobSchema);
