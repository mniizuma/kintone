/*
 * 後援会名簿詳細画面用JS
 * Copyright (c) 2013 Cybozu
 * Modified 2014 mniizuma
 * Licensed under the MIT License
 */
 
 
var vstatus_flg = false;//詳細画面で訪問状況を変更したかどうか

(function () {
 
    "use strict"; 
    
   //訪問履歴アプリに記録する
    function append_rev( meibo_rec,status,memo ) {

       var rev_appId = kintone.app.getRelatedRecordsTargetAppId("vrevision"); //訪問履歴のID取得                
        var objParam = {};
        objParam['app'] = rev_appId;// アプリ番号
        objParam['record'] = {};
        objParam['record']['meiborecord'] = {}; // status    
        objParam['record']['meiborecord']['value'] = meibo_rec; 
        objParam['record']['vstatus'] = {}; // status    
        objParam['record']['vstatus']['value'] = status; 
        objParam['record']['vmemo'] = {}; // status    
        objParam['record']['vmemo']['value'] = memo; 
 
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
 
//郵便番号から住所へ
function zip_to_addr() {

	var record = kintone.app.record.get();
	var zip = record["record"]["zip1"]["value"];

	if(zip === ''){
            return false;
        }
                
		$.ajax({
        	type : 'get',
            url : 'http://maps.googleapis.com/maps/api/geocode/json',
            crossDomain : true,
            dataType : 'json',
            data : {
                address : zip,
                language : 'ja',
                sensor : false
            },
            success : function(resp){
                if(resp.status == "OK"){   
                    var obj = resp.results[0].address_components;
                    var adrSize = obj.length -1;
                    
                          var tmp = '';
						  var i=adrSize - 1;
                            for(;i > 0; i --){
                            	if(obj[i].long_name == "兵庫県") {
	                            	continue;
                            	}

                                tmp += obj[i].long_name;
                            }
                            record["record"]["Address"]["value"] = tmp;
							kintone.app.record.set(record);
                    }
                    
                }
            });
}

//指定された新登録番号で新しいレコードを登録し詳細画面を表示する
function create_master_and_show( regno, branch,zip,address,chiiki,tel ) {
        var objParam = {};
		var appId = kintone.app.getId();
        objParam['app'] = appId;// アプリ番号
        objParam['record'] = {};
        objParam['record']['regno'] = {}; // status    
        objParam['record']['regno']['value'] = regno; 
        objParam['record']['branch'] = {}; // status    
        objParam['record']['branch']['value'] = branch; 
        objParam['record']['zip1'] = {}; // status    
        objParam['record']['zip1']['value'] = zip; 
        objParam['record']['Address'] = {}; // status    
        objParam['record']['Address']['value'] = address; 
        objParam['record']['chiiki1'] = {}; // status    
        objParam['record']['chiiki1']['value'] = chiiki; 
        objParam['record']['tel1'] = {}; // status    
        objParam['record']['tel1']['value'] = tel; 

 
        // レコードを登録
       kintone.api('/k/v1/record', 'POST', objParam, function(resp){
		   	window.open("/k/"+appId+"/show#record=" + resp.id + "&mode=edit","",""); //編集モードで表示

                    }, function(resp) {
                        // エラー時はメッセージを表示して、処理を中断します
                        //alert('error->' + resp.message);
                        return;
                    });     
    }

//指定された新登録番号と紹介者名簿関連づけ用のレコード番号を登録し詳細画面を表示する
function create_master_w_intro_and_show( regno, branch,intro_cd,intro_name ) {
        var objParam = {};
		var appId = kintone.app.getId();
        objParam['app'] = appId;// アプリ番号
        objParam['record'] = {};
        objParam['record']['regno'] = {}; // status    
        objParam['record']['regno']['value'] = regno; 
        objParam['record']['branch'] = {}; // status    
        objParam['record']['branch']['value'] = branch; 
		objParam['record']['intro_cd'] = {}; // status    
        objParam['record']['intro_cd']['value'] = intro_cd; 
		objParam['record']['intro_name'] = {}; // status    
        objParam['record']['intro_name']['value'] = intro_name; 

        // レコードを登録
       kintone.api('/k/v1/record', 'POST', objParam, function(resp){
		   	window.open("/k/"+appId+"/show#record=" + resp.id + "&mode=edit","",""); //編集モードで表示

                    }, function(resp) {
                        // エラー時はメッセージを表示して、処理を中断します
                        //alert('error->' + resp.message);
                        return;
                    });     
    }


//紹介者名簿に登録する
function create_intro_record(from_id,from_branch,from_name,to_id,to_branch,to_name){
        var objParam = {};
		var appId = kintone.app.getRelatedRecordsTargetAppId("intro_record1");//紹介者名簿アプリのID取得
        objParam['app'] = appId;// アプリ番号
        objParam['record'] = {};
        objParam['record']['regno'] = {}; // status    
        objParam['record']['regno']['value'] = from_id; 
        objParam['record']['branch'] = {}; // status    
        objParam['record']['branch']['value'] = from_branch;
        objParam['record']['name'] = {}; // status    
        objParam['record']['name']['value'] = from_name;

        objParam['record']['regno2'] = {}; // status    
        objParam['record']['regno2']['value'] = to_id;
        objParam['record']['branch2'] = {}; // status    
        objParam['record']['branch2']['value'] = to_branch;
        objParam['record']['name2'] = {}; // status    
        objParam['record']['name2']['value'] = to_name;
        
 //新しい紹介者名簿コードを用意する
            var appUrl = kintone.api.url('/k/v1/records') + '?app='+ appId + + '&query='  + encodeURI('order by intro_no desc limit 1&fields[0]=intro_no');
            var xmlHttp = new XMLHttpRequest();
            var intro_no = 0;
 
            // 同期リクエストを行う
            xmlHttp.open("GET", appUrl, false);
            xmlHttp.setRequestHeader('X-Requested-With','XMLHttpRequest');
            xmlHttp.send(null);
 
            if (xmlHttp.status == 200){
                if(window.JSON){
                    var obj = JSON.parse(xmlHttp.responseText);
                    if (obj.records[0] != null){
                        try{
                            intro_no = parseInt(obj.records[0]['intro_no'].value);
                        } catch(e){
                            intro_no = 0;  
                        }
                    }
                    
                } else{
                   intro_no = 0;                }
            } else{
				intro_no = 0;              }
            
            if(intro_no < 100000) {
            	 intro_no = 100001;
            } else {
				intro_no = intro_no + 1;
 	        }
 	        
        objParam['record']['intro_no'] = {}; // status    
        objParam['record']['intro_no']['value'] = intro_no; 

        // レコードを登録
       kintone.api('/k/v1/record', 'POST', objParam, function(resp){
       		retuen( resp.id); //登録されたレコードの番号を返す
                    }, function(resp) {
                        // エラー時はメッセージを表示して、処理を中断します
                        //alert('error->' + resp.message);
                        return false;
                    });     
	
}


//家族を新規登録
function create_new_family() {
			var record = kintone.app.record.get();
			var regno = record["record"]["regno"]["value"];//支援者の新登録番号取得
			var address = record["record"]["Address"]["value"];//住所
			var zip = record["record"]["zip1"]["value"];//郵便番号
			var chiiki = record["record"]["chiiki1"]["value"];//地域区分
			var tel = record["record"]["tel1"]["value"];//電話番号
			
			if(!regno) return false;//新登録番号未入力の場合はなにもしない 

			var query = "regno=" + regno + "order by branch desc limit 1&fields[0]=branch";
			var appId = kintone.app.getId();
            var appUrl = kintone.api.url('/k/v1/records') + '?app='+ appId + '&query=' + encodeURI(query);
            var xmlHttp = new XMLHttpRequest();
            var branch = 0;
 
            // 同期リクエストを行う
            xmlHttp.open("GET", appUrl, false);
            xmlHttp.setRequestHeader('X-Requested-With','XMLHttpRequest');
            xmlHttp.send(null);
 
            if (xmlHttp.status == 200){
                if(window.JSON){
                    var obj = JSON.parse(xmlHttp.responseText);
                    if (obj.records[0] != null){
                        try{
                            branch = parseInt(obj.records[0]['branch'].value) +1;
                        } catch(e){
                            event.error = '番号が取得できません。';
                            return event;
                        }
                    }
                } else{
                    return false;
                }
            } else{
                return false;
            }

	create_master_and_show(regno,branch,zip,address,chiiki,tel);
}

//紹介した人を新規登録
function create_intro(){
			var record = kintone.app.record.get();
			var this_cd = record["record"]["meibocode"]["value"];//この支援者の新登録番号＋枝番を取得
			if(!this_cd) return false;//新登録番号未入力の場合はなにもしない 

			var this_name = record["record"]["name"]["value"];//現在の支援者の名前取得

//新しい新登録番号を用意する
           var appId = kintone.app.getId();
            var appUrl = kintone.api.url('/k/v1/records') + '?app='+ appId + '&query=branch=0' + encodeURI('order by recordno desc limit 1&fields[0]=regno');
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
                            return false;
                        }
                    }
                    
                } else{
                   return false;                }
            } else{
					return false;
            }

	create_master_w_intro_and_show(regno,"0",this_cd,this_name);//後援会名簿に登録して開く
	
}
//訪問状況を変更した場合の処理
function change_vstatus(event) {
	var record = event.record;
	
	if(record["vstatus"]["value"]=="訪問完了" || record["vstatus"]["value"]=="訪問時不在") {
		vstatus_flg = true;//訪問完了または不在に変更された
	}
	
}

//詳細画面保存時の処理
function submit_detail(event) {
	var record = event.record;
	
	//訪問状況が変更された場合は訪問履歴に追加する
	if(vstatus_flg) {
		append_rev(record["recordno"]["value"],record["vstatus"]["value"],record["vmemo"]["value"]);
		vstatus_flg = false; //処理が終わったら初期状態に
	}

//以下紹介者の処理	
	var intro_cd = record["intro_cd"]["value"]; //この人を紹介した人のcodeを取得
	
	if( !intro_cd ) return;//空欄ならなにもしない
	
	var intro_data = intro_cd.split("-"); //新登録番号と枝番を取り出す
	var intro_name = record["intro_name"]["value"]; //この人を紹介した人の名前を取得
	
    var this_regno = record["regno"]["value"];
	var this_branch = record["branch"]["value"];
	var this_name = record["name"]["value"];            
	create_intro_record(intro_data[0],intro_data[1],intro_name,this_regno,this_branch,this_name);//紹介者名簿にいったん登録
                          
	record["intro_cd"]["value"] = "";
	record["intro_name"]["value"] = "";

	
	return( event );
	
}


//あらかじめ用意したスペースにボタンを配置する
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

//詳細画面表示・編集用
function detail_page( event ) {
//操作用ボタンの追加
		var zip_btn = set_btn("zip_btn","郵便番号検索");
		var zip_btn = set_btn("newfam_btn","家族を追加");
		var zip_btn = set_btn("intro_btn","紹介した人を追加");
		
		$("#zip_btn").click( zip_to_addr);
		$("#newfam_btn").click( create_new_family);
		$("#intro_btn").click( create_intro);
	
}


//新規作成画面用JS   
    function create_detail( event ) {

//操作用ボタンの追加
		var zip_btn = set_btn("zip_btn","郵便番号検索");
		var zip_btn = set_btn("newfam_btn","家族を追加");
		var zip_btn = set_btn("intro_btn","紹介した人を追加");
		
		$("#zip_btn").click( zip_to_addr);
		$("#newfam_btn").click( create_new_family);
		$("#intro_btn").click( create_intro);

//新登録番号の自動採番処理
   		 if ( event.reuse ) return; //再利用モードの場合はここで終了
        
        // 現在の最も大きい新規登録番号を取得する
            var appId = kintone.app.getId();
            var appUrl = kintone.api.url('/k/v1/records') + '?app='+ appId + '&query=branch=0' + encodeURI('order by recordno desc limit 1&fields[0]=regno');
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
    
 //訪問状況変更時イベント
    kintone.events.on('app.record.edit.change.vstatus', change_vstatus );
    
//新規レコードの場合
    kintone.events.on('app.record.create.show', create_detail );
//レコード表示の場合
	    kintone.events.on('app.record.detail.show', detail_page );
	    //レコード編集の場合
	    kintone.events.on('app.record.edit.show', detail_page );
	    //保存前の処理
	    kintone.events.on('app.record.edit.submit', submit_detail );    
        })();