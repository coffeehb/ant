//
//	mongodb
//

var db_addr = process.env.MONGODB_PORT_27017_TCP_ADDR;
var db_port = process.env.MONGODB_PORT_27017_TCP_PORT;
var db_user = process.env.MONGODB_USERNAME;
var db_pass = process.env.MONGODB_PASSWORD;
var db_database =  process.env.MONGODB_INSTANCE_NAME;

var mongoose = require('mongoose')
var opts = { server: { auto_reconnect: true }, 
    user: db_user, pass: db_pass };
var mongodb = mongoose.createConnection(db_addr, db_database, db_port, opts)

module.exports = {  
	cache: {},
	init: function(name, schema) {  
		var _schema = new mongoose.Schema(schema);
		this.cache[name] = mongodb.model(name, _schema);
		return this.cache[name];
	},
	get: function(name) {
		return this.cache[name];
	},
	objId: function(name) {
		return {
			type: mongoose.Schema.Types.ObjectId,
			ref: name
		}
	}
}
