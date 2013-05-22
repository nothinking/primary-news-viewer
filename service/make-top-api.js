var jsdom = require('jsdom');
var $ = require('jquery');
var schedule = require('node-schedule');
var mongojs = require('mongojs');
var BSON = require("mongodb").BSONPure;


/**
 * 전역변수 선언.
 */
var _data = {};
var _cnt = 0;
var db = mongojs('uidev.media.daum.net:27017/primarynews', ['articles']);


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

	// 탑기사
	jsdom.env(
		'http://www.daum.net/pub/json_newsgrp.daum'
		, ['http://s1.daumcdn.net/svc/original/U03/cssjs/jquery/jquery-2.0.0.min.js']
		, function(err, window) {
			var data = []
				, splitWords = $([new RegExp(/newsid=/i), new RegExp(/docid=MD/i), '/v/', '#']);
			
			db.articles.drop();

			window.jQuery('li').each(function(i, item) {
				var li = window.jQuery(item)
					, url = li.find('a').attr('href')
					, title = li.text()
					, img = li.find('img').attr('src') || ''
					, newsId;


				splitWords.each(function(i, item) {
					newsId = url.split(item)[1] || '';
					newsId = newsId.substring(0,17)
					return newsId === '';
				});

				// 뉴스 기사가 아니면 패스
				if(!newsId || !title){
					console.log(url)
					return;
				} 
				else {
					newsId = newsId.substring(0,17);

					db.articles.findOne({ "newsId": newsId }, function(err, result){
						if(!err && !result){
							db.articles.insert({
								newsId : newsId, 
								title: title, 
								img: img,
								categoryKey: "top"
							}, function(err, result){
								console.log("doc insert:", err, result);
							});
						} else {
							console.log("newsId %s is exists", newsId );
						}
					});

					// db.articles.findAndModify({query: { newsId : newsId }, update: {newsId : newsId, title: title, categoryKey: "top"}, upsert: true},  function(err, result) {
					// 	console.log(err, result)
					// });
				}
			});
		}
	);
}


