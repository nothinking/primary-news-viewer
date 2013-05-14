var jsdom = require('jsdom');
var $ = require('jquery');
var fs = require('fs');
var schedule = require('node-schedule');

/**
 * 전역변수 선언.
 */
var _data = {};
var _cnt = 0;

// 작업 한번 실행
action();
// 스케쥴 등록.
var j = schedule.scheduleJob('*/30 * * * *', function() {
	console.log('schedule');

	action();

});
/**
 * 메인 작업.
 */
function action() {

	// 인기기사
	jsdom.env(
		'http://www.daum.net/'
		, ['http://s1.daumcdn.net/svc/original/U03/cssjs/jquery/jquery-2.0.0.min.js']
		, function(err, window) {
			var data = [];
			window.jQuery('ol.list_best li').each(function(i, item) {
				data.popularTotal.push({
					title : window.jQuery(this).find('a').attr('title')
					, newsId : window.jQuery(this).find('a').attr('href').replace('/v/','')
					, url : 'http://media.daum.net' + window.jQuery(this).find('a').attr('href')
					, cpKorName : window.jQuery(this).find('span.source').html()
				});
			});


			// console.log(data)
			writeFile(data);
		}
	);
}
function getUrlAddedData(service) {

	$.each(service, function (i, item) {
		service[i].url = 'http://media.daum.net/v/' + item.newsId
	});

	return service;

}
/**
 * 레고에서 만들어진 지저분한 데이터 깔끔하게 만들기.
 * @param  {Object} service 원시데이터.
 */
function getCleanData(service) {
	var data = [];

	$.each(service.component.data, function (i, item) {
		data.push({
			title : item.component.data[0].title
			, url : item.component.data[0].url
		});
	});

	return data;
}
/**
 * api.js파일 만들기.
 * @param  {Object} data json data
 */
function writeFile(data) {
	$.extend(_data, data);

	if (++_cnt < 2){
		return false;
	}

	fs.writeFile("api.js", JSON.stringify(_data, null, 4), function(err) {
	      if(err) {
	      	console.log('error : make file')
	      } else {
	        console.log("The file was saved!");
	      }
	}); 
}

