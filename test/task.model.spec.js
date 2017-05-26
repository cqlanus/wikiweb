/**
BACKEND MODEL TESTS
 */
var Sequelize = require('sequelize');

var db = require('../db/models');
const {Node} = require('../db/models')
var expect = require('chai').expect;



 describe('Node', function() {
 	it('returns list of nodes', function() {
 		//console.log('NodeModel', NodeModel)
 		Node.findAll()
 		.then(resultsArr=>{
 			console.log('results', resultsArr.length)
 			expect(resultsArr.length).to.be.ok;
 		})
 		
 		
 		//expect(db.Node.findAll()).to.be.an('object')
 	}) 
 })