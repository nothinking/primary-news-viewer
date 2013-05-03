var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
	rule.seconds = 1;

var j = schedule.scheduleJob(rule, function() {
	console.log('schedule');
});