/*
 * 後援会名簿詳細画面用JS
 * Copyright (c) 2013 Cybozu
 * Modified 2014 mniizuma
 * Licensed under the MIT License
 */
(function () {
 
    "use strict"; 
    
//詳細画面にボタンを配置

//郵便番号から住所へ
function zip_to_addr() {

//	var record = kintone.app.record.get();
//	var zip = record['record']['zip1']['value'];
	

//	record['record']['Address']['value'] = address;
//	kintone.app.record.set(record);	
}

function set_btn(id,text) {
	//スペース要素の取得
  var se = kintone.app.record.getSpaceElement(id);
  
  //ボタンの作成
  var btn = document.createElement('button');
  btn.appendChild(document.createTextNode(text));
  btn.id = id; 
  btn.name = id;
  se.appendChild(btn);
  btn.style.marginTop = '30px';
  
  return(btn);

}

//新規作成画面用JS   
    function create_detail( event ) {

		var zip_btn = set_btn("zip_btn","郵便番号検索")
		var zip_btn = set_btn("newfam_btn","家族を追加")
		var zip_btn = set_btn("intro_btn","紹介した人を追加")
		
		$("#zip_btn").click( zip_to_addr)

//操作用ボタンの追加


//新登録番号の自動採番処理

   		 if ( event.reuse ) retuen; //再利用の場合はなにもしない
        
        // 現在の最も大きい新規登録番号を取得する
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
    kintone.events.on('app.record.create.show', create_detail );
//レコード表示の場合
	    kintone.events.on('app.record.detail.show', show_detail );
	    //レコード編集の場合
	    kintone.events.on('app.record.edit.show', edit_detail );    
        
})();