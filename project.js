// const express= require('express');
// const app=express();

// let server= require('./server');
// let middleware= require('./middleware');

// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());

// const MongoClient=require('mongodb').MongoClient;
// const url='mongodb://127.0.0.1:27017';
// const dbName='hospitalDetails';
// let db
// MongoClient.connect(url,{useUnifiedTopology: true},(err,client) =>{
//     if(err) return console.log(err);
//     db=client.db(dbName);
//     console.log(`Connected Database: ${url}`);
//     console.log(`Database : ${dbName}`);
// });
// app.get('/hospitalDetails',middleware.checkToken, function(req,res){
//     console.log("Fetching data from Hospital Collections");
//     var data=db.collection('hospitalDetails').find().toArray().then(result=>res.json(result));
// });
// app.get('/ventilatorDetails',middleware.checkToken ,function(req,res){
//     console.log("Fetching data from Ventilators Collections ");
//     var data=db.collection('ventilatorDetails').find().toArray().then(result=>res.json(result));
// }
// );
// app.post(`/searchventilatorbystatus`,middleware.checkToken,function(req,res){
//     var status=req.body.status;
//     console.log(status);
//     var ventilatorDetails=db.collection('ventilatorDetails').find({"status":status}).toArray().then(result=>res.json(result));
// });

// app.post(`/searchventilatorbyname`,middleware.checkToken,function(req,res){
//     var name=req.query.name;
//     console.log(name);
//     var ventilatorDetails=db.collection('ventilatorDetails').find({'name':new RegExp(name,'i')}).toArray().then(result=>res.json(result));
// });
// app.put(`/searchhospital`,middleware.checkToken,function(req,res){
//     var name=req.query.name;
//     console.log(name);
//     var hospitalDetails=db.collection('hospitalDetails').find({'name':new RegExp(name,'i')}).toArray().then(result=>res.json(result));
// });
// app.put(`/updateventilator`,middleware.checkToken,function(req,res){
//     var vid={ventilatorID:req.body.ventilatorID};
//     console.log(vid);
//     var newvalues={$set:{status:req.body.status}};
//     db.collection("ventilatorDetails").updateOne(vid,newvalues,function(err,result){
//         re.json('one document updated');
//         if(err)throw err;
//     });
// });
// app.post(`/addventilatorbyuser`,middleware.checkToken,function(req,res){
//     var hID=req.body.hID;
//     var ventilatorID=req.body.ventilatorID;
//     var status=req.body.status;
//     var name=req.body.name;
//     var item={
//         hID:hID,ventilatorID:ventilatorID,status:status,name:name
//     };
//     db.collection('ventilatorDetails').insertOne(item,function(err,result){
//         res.json('Item has been inserted');
//     });
// });
// app.delete(`delete`,middleware.checkToken,function(req,res){
//     var myquery=req.query.ventilatorID;
//     console.log(myquery);
//     var myquery1={ventilatorID,myquery};
//     db.collection(`ventilatorDetails`).deleteOne(myquery1,function(err,obj){
//         if(err)throw err;
//         res.json("one document has been deleted");
//     });
// });


// app.listen(3000);
const express= require('express');
const app=express();

let server= require('./server');
let middleware= require('./middleware');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName='hospitalDetails';
let db
MongoClient.connect(url,{useUnifiedTopology: true},(err,client) =>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database : ${dbName}`);
});


//hospital details

app.get('/hospitalDetails',middleware.checkToken,function(req,res)  {
  var data = db.collection('hospitalDetails');
  data.find().toArray(function(err,result) {
    if(!err) {
      res.send(result);
      console.log("Success");
    }
  });
});

//ventilator details

app.get('/ventilatorDetails',middleware.checkToken,function(req,res) {
  var data = db.collection('ventilatorDetails');
  data.find().toArray(function(err,result) {
    if(!err) {
      res.send(result);
      console.log("Success");
    }
  });
});

//searching ventilators by status

app.post('/searchventilatorbystatus',middleware.checkToken,function(req,res) {
  var status = req.body.status;
  var data = db.collection('ventilatorDetails');
  data.find({"status":status}).toArray(function(err,result) {
    if(!err) {
      res.send(result);
      console.log("Success");
    }
  });
});

//searching ventilators by hospital name

app.post('/searchventilatorbyname',middleware.checkToken,function(req,res) {
  var name = req.body.name;
  var data = db.collection('ventilatorDetails');
  data.find({"name":new RegExp(name,'i')}).toArray(function(err,result) {
    if(!err) {
      res.send(result);
      console.log("Success");
    }
  });
});

//search hospital by hospital name

app.post('/searchhospitalbyname',middleware.checkToken,function(req,res) {
  var name = req.query.name;
  var data = db.collection('hospitalDetails');
  data.find({"name":new RegExp(name,'i')}).toArray(function(err,result) {
    if(!err) {
      res.send(result);
      console.log("success");
    }
  });
});

//update ventilator

app.put(`/updateventilator`,middleware.checkToken,function(req,res){
  var ventid={ventilatorId:req.body.ventilatorId};
  console.log(ventid);
  var newvalues={$set:{status:req.body.status}};
  db.collection("ventilatorDetails").updateOne(ventid,newvalues,function(err,result){
      res.json('one document updated');
      if(err)throw err;
  });
});

//add ventilator using ventilator id

app.post('/addventilator',middleware.checkToken,function(req,res){
  console.log("adding data to ventilators collection");
  var v=req.body.ventilatorId;
  var status=req.body.status;
  console.log(v);
  var h=req.body.hID;
  var name;
  db.collection('hospitalDetails').find({hID:h},{projection:{_id:0, name:1 }}).toArray().then(result => {
  var obj={hID:h,ventilatorId:v,status:status,name:result}
  console.log(result);
  db.collection('ventilatorDetails').insertOne(obj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
  });
});
  db.collection('ventilatorDetails').find().toArray().then(result => res.send(result));
  res.send("data posted");
});

//delete ventilator by ventilatorID

app.delete('/deleteventilator',middleware.checkToken,function(req,res){
  var ventid = req.query.ventilatorId;
  console.log(ventid);
  var del = {"ventilatorId":ventid};
  db.collection('ventilatorDetails').deleteOne(del,function(err,obj) {
    if(err) throw err;
    res.json("1 document deleted");
  });
});

app.listen(3000);
