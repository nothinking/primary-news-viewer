```node
forever start -l .../privary-news-viewer.log make-top-api.js
```


## 데이터를 뽑아올 것들.
- 주요뉴스 api
- 많이 본 뉴스 api
- 댓글 많은 뉴스 api
- http://media.daum.net/export/json/16b7fa5961634ab8ba71211c87796f3a
- http://media.daum.net/common/wing.data
- 탑운영 api http://www.daum.net/pub/json_newsgrp.daum?dummy=1370482371785
- api가 따로 없는 관계로 html파싱해서 데이터 가져오기.
- 뉴스박스히스토리로 할지 개별 탭 기사목록으로 할지…
- http://media.daum.net/netizen/newsbox/
- 인기기사
- http://media.daum.net/netizen/popular/
- 뉴스 데이터 http://media.daum.net/api/service/news/view.jsonp?callback=?&newsId=


## node로 데이터 만들기 
- [node api](http://nodejs.org/api/) 
- [npm](https://npmjs.org/) 
- [jsdom-dom 파싱](https://github.com/tmpvar/jsdom)
- [request](https://github.com/mikeal/request)
- [node-schedule - crontab대용](https://npmjs.org/package/node-schedule)
- fs.writeFile - 파일에 쓰기


## 사족.
- 크론탭 등록 - crontab -e
- vi mode에서 스케줄 하나씩 등록.
- 30 6 1 * * /usr/local/bin/node /home/steve/example/script.js
- 크론탭 사용법 http://hoooow.tistory.com/entry/crontab-%EC%82%AC%EC%9A%A9%EB%B2%95 
- 크론은 기본이 분단위, 초단위로 하고 싶다면 sleep사용
- http://www.mysoun.com/entry/30%EC%B4%88-%EA%B0%84%EA%B2%A9%EC%9C%BC%EB%A1%9C-crontab-%EC%8B%A4%ED%96%89%ED%95%98%EA%B8%B0
- http://www.digimoon.net/blog/359



## 포토갤러리
http://media.daum.net/api/service/photo/5700.jsonp?page_size=32&type=photo&title=true&gallery_id=5700&sort=desc&newsId=20130514015110262
 
