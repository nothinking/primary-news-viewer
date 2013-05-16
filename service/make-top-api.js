var jsdom = require('jsdom');
var $ = require('jquery');
var schedule = require('node-schedule');
var mongojs = require('mongojs');

/**
 * 전역변수 선언.
 */
var _data = {};
var _cnt = 0;
var db = mongojs('uidev.media.daum.net:27017/primarynews', ['top']);


// 작업 한번 실행
action();
// 스케쥴 등록.
var j = schedule.scheduleJob('*/10 * * * *', function() {
	console.log('schedule');

	action();

});
/**
 * 메인 작업.
 */
function action() {

	// 인기기사
	jsdom.env(
		'http://media.daum.net/netizen/newsbox/'
		, ['http://s1.daumcdn.net/svc/original/U03/cssjs/jquery/jquery-2.0.0.min.js']
		, function(err, window) {
			var data = []
				, splitWords = $([/newsid=/ig, '/v/', '#']);

				db.top.drop();
				

			window.jQuery('.wrap_history a').each(function(i, item) {
				var url = window.jQuery(item).attr('href');
				var title = window.jQuery(item).text();
				var id;


				splitWords.each(function(i, item) {
					id = url.split(item)[1];
					return id === undefined;
				});

				if(id === undefined){
					console.log("id is not found", url)
					return;
				} else {
					db.top.save({
						title : title, 
						newsId : id.substring(0,17), 
						_id : mongojs.ObjectId(id.substring(0,17) + "0000000")
					});	
				}
			});
			

		}
	);
}


