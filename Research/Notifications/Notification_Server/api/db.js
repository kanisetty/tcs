var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/notificationcenter', function () {
	console.log('mongodb connected');
});

module.exports = mongoose;