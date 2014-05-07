/*
 * 旅費精算申請のプログラム
 * Copyright (c) 2013 Cybozu
 *
 * Licensed under the MIT License
 */
(function () {
 
    "use strict"; 
// レコード追加、編集の保存前に自動採番を作成する
    var eventSubmit =['app.record.create.submit', 'app.record.index.create.submit',
                      'app.record.edit.submit', 'app.record.index.edit.submit'];
    kintone.events.on(eventSubmit, function (event) {
        
  if (!event.record['regno'].value ) {
        // アプリIDを取得する
            var appId = kintone.app.getId();
            var appUrl = kintone.api.url('/k/v1/records') + '?app='+ appId + '&query=' + encodeURI('order by recordno desc limit 1&fields[0]=regno');
            var xmlHttp = new XMLHttpRequest();
            var regno = 0;
 
            // 同期リクエストを行う
            xmlHttp.open("GET", appUrl, false);
            xmlHttp.setRequestHeader('X-Requested-With','XMLHttpRequest');
            xmlHttp.send(null);
 
            if (xmlHttp.status == 200){
                if(window.JSON){
                    var obj = JSON.parse(xmlHttp.responseText);
                    if (obj.records[0] != null){
                        alert(obj.records[0]['regno'].value);
                        try{
                            regno = parseInt(obj.records[0]['regno'].value) +1;
                        } catch(e){
                            event.error = '番号が取得できません。';
                            alert("取得エラー");
                            return event;
                        }
                    }
                    
                    alert("番号 " + regno + " を登録します");
                    event.record['regno']['value'] = regno;
                } else{
                    event.error = xmlHttp.statusText;
                }
            } else{
                record['regno'].error = '番号が取得できません。';
            }
      return event;
  } else return;     
    });
})();