/*
 * 自動採番処理他
 * Copyright (c) 2013 Cybozu
 * Modified 2014 mniizuma
 * Licensed under the MIT License
 */
(function () {
 
    "use strict"; 
// レコード追加に、候補の連番を挿入する
   
    function add_regno( event ) {

    if ( event.reuse ) retuen; //再利用の場合はなにもしない
        
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
                        try{
                            regno = parseInt(obj.records[0]['regno'].value) +1;
                        } catch(e){
                            event.error = '番号が取得できません。';
                            return event;
                        }
                    }
                    
                    event.record['regno']['value'] = regno;
                } else{
                    event.error = xmlHttp.statusText;
                }
            } else{
                record['regno'].error = '番号が取得できません。';
            }
      return event;
    }
    
//新規レコードの場合
    kintone.events.on('app.record.create.show', add_regno );
        
})();