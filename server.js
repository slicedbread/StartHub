var express = require('express');
var app = express();

var mongojs = require('mongojs');
var db = mongojs('accountList', ['accountList']);
var bodyParser = require('body-parser');



app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get('/accountList', function (req, res){
	console.log("I received a GET request")


	db.accountList.find(function (err, docs){
		console.log(docs);
		res.json(docs);
	});

});

app.post('/accountList', function (req, res) {
	console.log(req.body);
	db.accountList.insert(req.body, function(err, doc) {
		res.json(doc);
	})
});

app.delete('/accountList/:id', function (req, res) {
	var id = req.params.id;
	console.log(id);
	db.accountList.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
		res.json(doc);
	})
});

app.get('/accountList/:id', function (req, res) {
	var id = req.params.id;
	console.log(id);
	db.accountList.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
		res.json(doc);
	});
});

app.put('/accountList/:id', function (req, res) {
	var id = req.params.id;
	console.log(req.body.id);
	db.accountList.findAndModify({query: {_id: mongojs.ObjectId(id)},
		update: {$set: {id: req.body.id, password: req.body.password}},
		new: true}, function (err, doc) {
			res.json(doc);
		});

	
});

app.listen(3000);
console.log("Server running on port 3000");
