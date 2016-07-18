#!/usr/bin/env node
'use strict';

var app = require('./server/server.js');

var PORT = process.env.port || 8080;
var ROOT_DIR = process.env.ROOT_DIR || __dirname;

//app(PORT, ROOT_DIR);
module.exports = app(PORT, ROOT_DIR);
