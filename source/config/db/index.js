const mongoose = require('mongoose');
async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1/find_jobs', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('connect successfully!');
    } catch {
        console.log('connect fail!');
    }
}

module.exports = { connect };
