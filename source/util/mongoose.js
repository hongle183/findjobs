module.exports = {
    mutipleMongooseToObject: function (objects) {
        return objects.map(object => object.toObject());
    },
    mongooseToObject: function (object) {
        return object ? object.toObject() : object;
    }
}