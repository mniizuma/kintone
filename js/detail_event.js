/*
 * イベント管理詳細画面用JS
 * Copyright (c) 2013 Cybozu
 * Modified 2014 mniizuma
 * Licensed under the MIT License
 */
(function () {
 
    "use strict"; 
    
    
//イベント名簿への転送
function to_memberlist( eventno,meibocd,name,kana){
        var objParam = {};
        objParam['app'] = 94;// アプリ番号
        objParam['record'] = {};
        objParam['record']['eventno'] = {}; // status    
        objParam['record']['eventno']['value'] = eventno; 
        objParam['record']['meibocd'] = {}; // status    
        objParam['record']['meibocd']['value'] = meibocd; 
        objParam['record']['name'] = {}; // status    
        objParam['record']['name']['value'] = name; 
        objParam['record']['kana'] = {}; // status    
        objParam['record']['kana']['value'] = kana; 
    
        // レコードを更新します
        kintone.api('/k/v1/record', 'POST', objParam, function(resp){
                // 成功時は画面をリロードします
                //location.reload(true);
                    }, function(resp) {
                        // エラー時はメッセージを表示して、処理を中断します
                        //alert('error->' + resp.message);
                        return;
                    });     
	
}
    
//詳細画面保存時の処理
function submit_detail(event) {
	var record = event.record;
	var member=[];
	
	var members = record["members"]["value"]; //申し込み者テーブル
	
	if( !members ) return;//空欄ならなにもしない
	
	var appId = 94;//イベント名簿アプリのID
	var eventno = record["eventno"]["value"];
	var eventname = record["eventname"]["value"];

	
	for(var i=0;i < members.length; ++i ) {
			member = members[i]["value"];
			var query ="eventno="+eventno+" and "+"meibocd="+'"'+member["meibocd"]["value"]+'"';
            var appUrl = kintone.api.url('/k/v1/records') + '?app='+ appId  +  "&query="+encodeURI(query+'order by eventno desc limit 1&fields[0]=eventno');
            var xmlHttp = new XMLHttpRequest();
            var regno = 0;
 
            // 同期リクエストを行う
            xmlHttp.open("GET", appUrl, false);
            xmlHttp.setRequestHeader('X-Requested-With','XMLHttpRequest');
            xmlHttp.send(null);
 
            if (xmlHttp.status == 200 ){
                    if(window.JSON){
                   		 var obj = JSON.parse(xmlHttp.responseText);
				   		 if (obj.records[0] != null) continue;
				   		 }
				   	}

            	 //レコードがない場合
				var objParam = {};
				objParam['app'] = appId;// アプリ番号
				objParam['record'] = {};
				objParam['record']['eventno'] = {}; // status    
				objParam['record']['eventno']['value'] = eventno; 
				objParam['record']['eventname'] = {}; // status    
				objParam['record']['eventname']['value'] = eventname; 
				objParam['record']['meibocd'] = {}; // status    
				objParam['record']['meibocd']['value'] = member["meibocd"]["value"]; 
				objParam['record']['name'] = {}; // status    
				objParam['record']['name']['value'] = member["name"]["value"]; 
				objParam['record']['kana'] = {}; // status    
				objParam['record']['kana']['value'] = member["kana"]["value"]; 
    
				// レコードを追加します
				kintone.api('/k/v1/record', 'POST', objParam, function(resp){
                // 成功時は画面をリロードします
                //location.reload(true);
                    }, function(resp) {
                        // エラー時はメッセージを表示して、処理を中断します
                        //alert('error->' + resp.message);
                       
                    });     
				
                }
		
	}
    
    
    
    
//レコード表示の場合
	    //保存前の処理
	    kintone.events.on('app.record.edit.submit', submit_detail );    
        })();