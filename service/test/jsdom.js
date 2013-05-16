var jsdom = require('jsdom');
var $ = require('jquery');
var fs = require('fs');

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

var _data = {};
var _cnt = 0;

// 주요기사, 댓글 많은 뉴스, 
jsdom.env(
	'<html><body></body></html>'
	, ['http://media.daum.net/export/json/16b7fa5961634ab8ba71211c87796f3a?var=true']
	, function(err, window) {

		var data = {
			manyCommentsEntertain : window.manyCommentsEntertain.news
			, manyCommentsSports : window.manyCommentsSports.news
			, manyCommentsTotal : window.manyCommentsTotal.news
			, primaryEntertain : window.primaryEntertain.component.data
			, primaryEntertain : getCleanData(window.primaryEntertain)
			, primarySisa : getCleanData(window.primarySisa)
			, primaryLife : getCleanData(window.primaryLife)
			, primarySports : getCleanData(window.primarySports)
		};

		// console.log(data);
		writeFile(data);


	}
);

// 인기기사
jsdom.env(
	'http://media.daum.net/netizen/popular/'
	, ['http://s1.daumcdn.net/svc/original/U03/cssjs/jquery/jquery-2.0.0.min.js']
	, function(err, window) {
		var data = {
			popularTotal : []
		};
		window.jQuery('ol.list_best li').each(function(i, item) {
			data.popularTotal.push({
				title : window.jQuery(this).find('a').attr('title')
				, newsId : window.jQuery(this).find('a').attr('href').replace('/v/','')
			});
		});


		// console.log(data)
		writeFile(data);
	}
);

