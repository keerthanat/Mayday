'use strict';

var fs = require('fs'),
  path = require('path'),
  Sequelize = require('sequelize'),
  sequelize = null,testdb ={},
  db = {};
  var config =  require('../server/config')(process.env.NODE_ENV);
//module.exports = function() {
//var sequelize = new Sequelize('mayday2.db', null, null,{
//    dialect: 'sqlite',
//    port: '3300'
//});
var sequelize = new Sequelize(config.db, null, null, {
    dialect: 'sqlite',
    storage: './'+config.db
  });
//console.log('db: '+ process.env.NODE_ENV);
//var test_sequelize = new Sequelize('maydayTest.db', null, null, {
//    dialect: 'sqlite',
//    storage: './maydayTest.db'
//  });
// IMPORT MODELS
fs.readdirSync(__dirname)
  .filter(function(file) {
//      console.log("File:"+file);
    return (file.indexOf(".") != 0) && (file.indexOf("index") == -1);
  })
  .forEach(function(file) {
//      console.log("__dirname:"+__dirname+" file:"+file);
  var model = sequelize.import(path.join(__dirname, file));
    console.log("ModelName:"+model.name);
    db[model.name] = model;
    
//    var testmodel = test_sequelize.import(path.join(__dirname, file));
//    console.log("ModelName:"+testmodel.name);
//    testdb[testmodel.name] = testmodel;
  });
  


// RUN MODEL ASSOCIATIONS (hasMany, belongsTo, etc.)
Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});
//Object.keys(testdb).forEach(function(modelName) {
//  if ("associate" in testdb[modelName]) {
//    testdb[modelName].associate(testdb);
//  }
//});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
//db.test_sequelize = test_sequelize;
//db.test_model = testdb;

module.exports = db;
