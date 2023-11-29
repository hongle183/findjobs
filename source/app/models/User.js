const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const moment = require('moment-timezone');
const vietnam = moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss');

const userSchema = new Schema({
    _id: { type: String, default: new mongoose.Types.ObjectId().valueOf() },
    name: { type: String },
    email: { type: String },
    password: { type: String },
    gender: { type: Boolean, default: true },
    phone: { type: String },
    about: { type: String },
    company: { type: String, ref: 'Company' },
    // nếu là business thì có 'nhân viên, trưởng nhóm, phó trưởng phòng, phó GD, GD, tổng GD'
    position: { type: String },
    bookmark: [String],
    img: { type: String, default: '/img/avatar/avatar.jpg' },
    website: { type: String },
    address: { type: String },
    role: { type: String, enum: ['cadidate', 'business', 'admin'], default: 'cadidate' },
    status: { type: Boolean, default: true },
    createdAt: { type: String, default: vietnam },
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
