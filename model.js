;(function () {
	"use strict";
	// run on both the server and the client
	Meteor.secrets = new Meteor.Collection('secrets');


	Meteor.Notes = new Mongo.Collection("notes");
}());