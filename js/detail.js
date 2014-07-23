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
function create_master_and_show( regno, branch,zip,address,address2,chiiki,tel ) {
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
        objParam['record']['Address1_2'] = {}; // status    
        objParam['record']['Address1_2']['value'] = address2; 
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

//指定されたレコードの住所等を行進する
function update_master_address( id,chiiki,zip,address,address2,tel) {
	
	var objParam = {};
        objParam['app'] = kintone.app.getId();// アプリ番号
        objParam['id'] = id;    // レコード番号
        objParam['record'] = {};
        objParam['record']['chiiki1'] = {}; // status    
        objParam['record']['chiiki1']['value'] = chiiki; 
        objParam['record']['zip1'] = {}; // status    
        objParam['record']['zip1']['value'] = zip; 
        objParam['record']['Address'] = {}; // status    
        objParam['record']['Address']['value'] = address; 
        objParam['record']['Address1_2'] = {}; // status    
        objParam['record']['Address1_2']['value'] = address2; 
        objParam['record']['tel1'] = {}; // status    
        objParam['record']['tel1']['value'] = tel; 

        // レコードを更新します
        kintone.api('/k/v1/record', 'PUT', objParam, function(resp){
                // 成功時は画面をリロードします
                //location.reload(true);
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
            var appUrl = kintone.api.url('/k/v1/records') + '?app='+ appId + '&query=' + encodeURI('order by intro_no desc limit 1&fields[0]=intro_no');
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
			var address2 = record["record"]["Address1_2"]["value"];//住所
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

	create_master_and_show(regno,branch,zip,address,address2,chiiki,tel);
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
	
	if( intro_cd ) {
	
		var intro_data = intro_cd.split("-"); //新登録番号と枝番を取り出す
		var intro_name = record["intro_name"]["value"]; //この人を紹介した人の名前を取得
	
		var this_regno = record["regno"]["value"];
		var this_branch = record["branch"]["value"];
		var this_name = record["name"]["value"];            
		create_intro_record(intro_data[0],intro_data[1],intro_name,this_regno,this_branch,this_name);//紹介者名簿にいったん登録
                          
		record["intro_cd"]["value"] = "";
		record["intro_name"]["value"] = "";

	}
//家族がいる場合の住所等の自動変更

	var branch = record["branch"]["value"];
	if( branch != "0" ) return(event); //家族の場合は処理しない
	var regno = record["regno"]["value"];
	
	//家族の住所等に筆頭者の住所等をあわせる
	var appId = kintone.app.getId();
    var appUrl = kintone.api.url('/k/v1/records') + '?app='+ appId + encodeURI('&query=branch!=0 and regno='+regno+ 'order by recordno desc &fields[0]=recordno');
    var xmlHttp = new XMLHttpRequest();
 
    // 同期リクエストを行う
    xmlHttp.open("GET", appUrl, false);
    xmlHttp.setRequestHeader('X-Requested-With','XMLHttpRequest');
    xmlHttp.send(null);
 
    if (xmlHttp.status != 200) return(event);//該当するものがないのでreturn
    
    if(!window.JSON) return(event);
    
    var obj = JSON.parse(xmlHttp.responseText);
    
    for( var i=0;i < obj.records.length;i++ ) {
    	var child_recordno = parseInt(obj.records[i]["recordno"]["value"]);
		update_master_address(child_recordno,record["chiiki1"]["value"],record["zip1"]["value"],record["Address"]["value"],record["Address1_2"]["value"],record["tel1"]["value"]);
		}

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

//検索結果からユーザーを1人選んで、紹介者に登録する
function user_select() {
    	var this_td=$(this).parent()[0];
    	var this_row=$(this_td).parent()[0];
    	var name_col = $(this_row).children('td:eq(1)');
    	var address_col = $(this_row).children('td:eq(2)');
    	var tel_col = $(this_row).children('td:eq(3)');
    	var code_col = $(this_row).children('td:eq(4)');
		var this_code = $(code_col).text().split("-");
		var to_id = this_code[0];
		var to_branch = this_code[1];
		var to_name = $(name_col).text();
		var this_address = $(address_col).text();
		var this_tel = $(tel_col).text();

		var this_tr = '<tr><td>'+to_name + "</td><td>" + this_address + "</td><td>" + this_tel +  "</td></tr>";
		
		$("#selected").remove();
		$("#intro_dialog" ).append('<table id="selected" name="selected" class="viewtable"></table>');

		 $("#selected").append(this_tr);
		 $("#intro_name_div").remove();

		$( "#intro_dialog" ).dialog({
		　title:"紹介した人として登録します",
　　		　autoOpen: false,
　　		　modal: true,
		  width:750,
		  hight:250,
　　		　buttons: {
　　		　　"登録": function(){
				var record = kintone.app.record.get();
				var from_id = record["record"]["regno"]["value"];
				var from_branch = record["record"]["branch"]["value"];
				var from_name = record["record"]["name"]["value"];
				create_intro_record(from_id,from_branch,from_name,to_id,to_branch,to_name);
				$(this).dialog('close');
				location.reload();
　　　　			},
			'取り消し': function(){
				$(this).dialog('close');
				}
　　　		}
　　		});
		$( "#intro_dialog2" ).dialog("close");

		$( "#intro_dialog" ).dialog("open");
	
}

//検索結果をDialogに表示する
function result_dialog(name) {
	//nameをキーに総員名簿を検索する
		var records=[];
		var appId = kintone.app.getId();
		var appUrl = kintone.api.url('/k/v1/records') + '?app='+ appId + encodeURI('&query=name like "' + name +'"' + 'order by name asc');
		var xmlHttp = new XMLHttpRequest();
 
		// 同期リクエストを行う
		xmlHttp.open("GET", appUrl, false);
		xmlHttp.setRequestHeader('X-Requested-With','XMLHttpRequest');
		xmlHttp.send(null);
 
		if (xmlHttp.status == 200){
    		      if(window.JSON){
     	    	       var obj = JSON.parse(xmlHttp.responseText);
	 				   if (obj.records[0] != null){
                      	  try{
							var records = obj.records;
							} catch(e){
                          }
                    }
                }
           }
           
		   $("#searchresult").remove();//テーブルエリアを削除
		   $("#intro_dialog2" ).append('<table id="searchresult" name="searchresult" class="viewtable"></table>');

		   
		   for( var i=0;i < records.length;i++ ) {
		   		var record = records[i];
		   		var this_tr = '<tr><td><input type="button" class="button_col" name = "select" value="選択" id="' + record.recordno.value + '"</td><td>'+record.name.value + "</td><td>" + record.Address.value + "</td><td>" + record.tel1.value + '</td><td class="code_col">' + record.meibocode.value + "</td></tr>"
		   		$("#searchresult").append(this_tr);
		   }
		$( "#intro_dialog2" ).dialog({
		　title:"検索結果から選択してください",
　　		　autoOpen: false,
　　		　modal: true,
		  width:750,
		  maxHeight:700,
　　		　buttons: {
　　		　　"取り消し": function(){
				$(this).dialog('close');
　　　　			}
　　　		}
　　		});

		$( "#intro_dialog2" ).dialog("open");
		$('[name="select"]').click(user_select);
	
}

//既に登録済みの別の人を紹介した人として等録す場合
function create_intro2(){
		$("#selected").remove();
		$("#intro_name_div").remove();//氏名欄を削除
		$("#intro_dialog" ).append('<div id="intro_name_div"> 支援者氏名：<input type="text" id="intro_name" size="35" ></div>');
		$( "#intro_dialog" ).dialog({
		　title:"支援者を検索",
　　		　autoOpen: false,
　　		　modal: true,
　　		　buttons: {
　　		　　"検索": function(){
				result_dialog($("#intro_name").val());
				$(this).dialog('close');
　　　　			},
			'取り消し': function(){
				$(this).dialog('close');
				}
　　　		}
　　		});

		$( "#intro_dialog" ).dialog("open");
}


//詳細画面表示・編集用
function detail_page( event ) {
//操作用ボタンの追加
		var zip_btn = set_btn("zip_btn","郵便番号検索");
		var fam_btn = set_btn("newfam_btn","家族を追加");
		var intro_btn = set_btn("intro_btn","新規登録の場合");
		var intro_btn2 = set_btn("intro_btn2","検索して追加");
		
		$("#zip_btn").click( zip_to_addr);
		$("#newfam_btn").click( create_new_family);
		$("#intro_btn").click( create_intro);
		$("#intro_btn2").click( create_intro2);
		

//登録染みの紹介者を追加するための準備
	//dialog情報の定義
		var area = kintone.app.record.getSpaceElement("intro_dialog");
		var dlg = document.createElement('div');
        dlg.setAttribute('id', 'intro_dialog');
        dlg.setAttribute('name', 'intro_dialog');
        area.appendChild(dlg);
 
		$( "#intro_dialog" ).dialog({
　		　autoOpen: false,
　　		　modal: true,
　　		});
//
		var dlg2 = document.createElement('div');
        dlg2.setAttribute('id', 'intro_dialog2');
        dlg2.setAttribute('name', 'intro_dialog2');
        area.appendChild(dlg2);
        
		$( "#intro_dialog2" ).dialog({
		　title:"検索結果から選択してください",
　　		　autoOpen: false,
　　		　modal: true,
		  width:500,
		  hight:400,
　　		　buttons: {
　　		　　"取り消し": function(){
				$(this).dialog('close');
　　　　			}
　　　		}
　　		});

//家族の場合住所等を編集不可にしておく

		var record = event.record;
		
		if(record["branch"]["value"] == "0" ) return(event);
		
		record["chiiki1"]["disabled"] = true;
		record["zip1"]["disabled"] = true;
		record["Address"]["disabled"] = true;
		record["Address1_2"]["disabled"] = true;
		record["tel1"]["disabled"] = true;
		
		return(event);

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