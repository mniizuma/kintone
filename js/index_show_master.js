//後援会名簿一覧用JSファイル
// since 2014-

var Member = {};
var map;
var gc;
var markers = [];
var current_rec=0;
 
(function () {
    "use strict";
 
    Member.Ctrl = function ($scope) {
        // リストを初期化
        $scope.members = [];
         
        // クリックイベント
        $scope.click = function (item) {
            window.open("comgooglemaps://?daddr=" + item.Address );
        }
    };

//一件ごとに後援会名簿上の訪問状況を変更する 
    function update_master_vorder( record_id, order ) {
        var objParam = {};
        objParam['app'] = kintone.app.getId();// アプリ番号
        objParam['id'] = record_id;    // レコード番号
        objParam['record'] = {};
        objParam['record']['vorder'] = {}; // status    
        objParam['record']['vorder']['value'] = order; 
 
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

    
    //一件ごとに後援会名簿上の訪問状況を変更する 
    function update_master_vstatus_only( record_id, status,memo ) {
        var objParam = {};
        objParam['app'] = kintone.app.getId();// アプリ番号
        objParam['id'] = record_id;    // レコード番号
        objParam['record'] = {};
        objParam['record']['vstatus'] = {}; // status    
        objParam['record']['vstatus']['value'] = status; 
        if(status == "訪問完了") {
	        objParam['record']['vmemo'] = {}; // status    
			objParam['record']['vmemo']['value'] = memo; 
	        
        }
 
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

    
    //一件ごとに後援会名簿上の訪問予定をtrueに設定する  
    function update_master_vstatus( record_id, status,tanto,date ) {
        var objParam = {};
        objParam['app'] = kintone.app.getId();// アプリ番号
        objParam['id'] = record_id;    // レコード番号
        objParam['record'] = {};
        objParam['record']['vstatus'] = {}; // status    
        objParam['record']['vstatus']['value'] = status; 
        objParam['record']['vdate'] = {}; // 訪問予定日    
        objParam['record']['vdate']['value'] = date;   
        objParam['record']['tanto'] = {}; // 担当者    
        objParam['record']['tanto']['value'] = [{ "code":tanto }];   
        
 
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
   
      //複数の後援会名簿上の訪問予定をtrueに設定する  
    function update_master_vstatus_array( ids, status,tanto,date ) {
        var objParam = {};
        var records = [];
        var record = {};
        objParam['app'] = kintone.app.getId();// アプリ番号
        objParam['records'] = [];
       
        for( var i=0; i < ids.length; i++ ) {
            record={}
            record['id'] = ids[i];    // レコード番号
            record['record'] = {} 
            record['record']['vstatus'] = {}; // status    
            record['record']['vstatus']['value'] = "訪問予定"; 
            record['record']['vdate'] = {}; // 訪問予定日    
            record['record']['vdate']['value'] = date;   
            record['record']['tanto'] = {}; // 担当者    
            record['record']['tanto']['value'] = [{ "code":tanto }];  
            objParam['records'].push(record);
        }
       
        // レコードを更新します
        kintone.api('/k/v1/record', 'PUT', objParam, function(resp){
                // 成功時は画面をリロードします
                location.reload(true);
                    }, function(resp) {
                        // エラー時はメッセージを表示して、処理を中断します
                        alert('error->' + resp.message);
                        return;
                    });     
        
        
    }
 
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
    
    //訪問予定リスト一軒ずつ更新
    function update() {
        var tanto = kintone.getLoginUser();
        var vdate = $("#datepicker").val();
        
        if ($(this).is(':checked')) {
            update_master_vstatus( $(this).val(),"訪問予定",tanto.code,vdate);
        } else {
            update_master_vstatus( $(this).val(),"未定","","");
        
        }
    // location.reload();
       
    
    }
    
    //訪問予定リスト一括更新
    function append()  {
        var visit=[];
        var tanto = kintone.getLoginUser();
        var vdate = $("#datepicker").val();
        
        $('[name="visit"]:checked').each(function(){
//            update_master_vstatus( $(this).val(),true,tanto.code,vdate);
  
            var objParam = {};
            objParam['app'] = kintone.app.getId();// アプリ番号
            objParam['id'] = $(this).val();    // レコード番号
            objParam['record'] = {};
            objParam['record']['vstatus'] = {}; // status    
            objParam['record']['vstatus']['value'] = "訪問予定"; 
            objParam['record']['vdate'] = {}; // 訪問予定日    
            objParam['record']['vdate']['value'] = vdate;   
            objParam['record']['tanto'] = {}; // 担当者    
            objParam['record']['tanto']['value'] = [{ "code":tanto.code }];   
        
 
        // レコードを更新します
            kintone.api('/k/v1/record', 'PUT', objParam, function(resp){
                // 成功時は画面をリロードします
                if(resp=="") { alert("error"); }
                    }, function(resp) {
                        // エラー時はメッセージを表示して、処理を中断します
                        if(resp!="") {alert('error->' + resp.message);}
                    });     

            });
        
       //

        noty({
	       text: "<b>登録しました</b>",
	       type: "success",
            timeout: 8000,
	       layout: "center",
            });
       setTimeout(
           function() {
           location.reload();
            },
        5000);
        
    }
   
 
    //訪問予定一覧用function    
    function visitview (e) {
        var i;
        var members = new Array();
        var appId = kintone.app.getId();
         
        for (i = 0; i < e.records.length; i++) {
                var record = e.records[i];
                var detail_link = "/k/"+appId+"/show#record=" + record.recordno.value; 

                members.push({'recordno': record.recordno.value, 'vstatus':record.vstatus.value,'vdate':record.vdate.value,'Address': record.Address.value, 'name': record.name.value,'detaillink':detail_link});
                         
            
                    }
                // スコープを取得
                var scope = angular.element(document.querySelector('#members')).scope();
 
                scope.$apply(function(){
                // リストに値をセット
                    scope.members = members;
                    });
        
        //datepicker呼び出し
        $.datepicker.setDefaults( $.datepicker.regional[ "ja" ] );   
        $( "#datepicker" ).datepicker();
        $( "#datepicker" ).datepicker("option", "dateFormat", 'yy-mm-dd');
        $( "#datepicker" ).datepicker('setDate', new Date());
         
        $("#append").click(append);
        }

    //住所からマーカーを作成して地図に表示する    
    function createmarker( address,title ) {
        
        //record のAddressから緯度経度を取得する
               
            // Geocoding API を実行します
            gc.geocode({
                address: address,
                language: 'ja',
                country: 'JP'
            }, function(results, status) {
                          
            //　住所が検索できた場合、緯度経度の配列に値をセット
                if (status === google.maps.GeocoderStatus.OK) {
                   
                    var lat= results[0].geometry.location.lat(); 
                    var lng= results[0].geometry.location.lng();   
                    var m_latlng = new google.maps.LatLng(lat,lng);

                    var marker = new google.maps.Marker({
                        position: m_latlng,
                        map: map,
                    // ポインタのアイコンは Google Charts を使用します
                        icon: 'https://chart.googleapis.com/chart?chst=d_bubble_text_small&chld=edge_bc|' + title + '|FF8060|000000'
                        });
                }               
                
            });
            
    
        
    }
    
    //住所からマーカーを作成して地図に表示し
    //クリックすると詳細画面に移動する
    function createmarker_link( address,title,link,key ) {
        
        //record のAddressから緯度経度を取得する
               
            // Geocoding API を実行します
            gc.geocode({
                address: address,
                language: 'ja',
                country: 'JP'
            }, function(results, status) {
                          
            //　住所が検索できた場合、緯度経度の配列に値をセット
                if (status === google.maps.GeocoderStatus.OK) {
                   
                    var lat= results[0].geometry.location.lat(); 
                    var lng= results[0].geometry.location.lng();   
                    var m_latlng = new google.maps.LatLng(lat,lng);

                    var marker = new google.maps.Marker({
                        position: m_latlng,
                        map: map,
                    // ポインタのアイコンは Google Charts を使用します
                        icon: 'https://chart.googleapis.com/chart?chst=d_bubble_text_small&chld=edge_bc|' + title + '|FF8060|000000'
                        });
                    google.maps.event.addListener(marker, 'click', function() {window.open(link );});
                    markers.push({'key':key,'marker':marker});
                }               
                
            });
        
    }

    //レコード番号をキーにしてmapのマーカーを非表示にする
    function marker_hide( key ) {
        for( var i=0;i < markers.length;i++ ) {
                var marker = markers[i];
                if(marker["key"] == key) {
                    marker.marker.setMap(null);
                }
        }
        
    }
     //レコード番号をキーにしてmapのマーカーを再表示にする
    function marker_show( key ) {
        for( var i=0;i < markers.length;i++ ) {
                var marker = markers[i];
                if(marker["key"] == key) {
                    marker.marker.setMap(map);
                }
        }
        
    }
   
    
    //訪問完了・不在の登録とキャンセル
    function cancel() {
        if($(this).attr('class') == "black") {
	         $(this).attr('class', "gray");  
			 update_master_vstatus_only( $(this).attr('id'),"未定");
 			 marker_hide($(this).attr('id'));
        } else {
	         $(this).attr('class', "black");  
			 update_master_vstatus_only( $(this).attr('id'),"訪問予定");
 			 marker_show($(this).attr('id'));

        }
    }

    function complete() {
        if($(this).attr('class') == "black") {
	         $(this).attr('class', "gray");  
			 current_rec = $(this).attr('id');
			 $( "#dialog" ).dialog("open");
			 marker_hide($(this).attr('id'));
			 
        } else {
	         $(this).attr('class', "black");  
			 update_master_vstatus_only( $(this).attr('id'),"訪問予定");
			 marker_show($(this).attr('id'));
        }

    }
    
    function fuzai() {    
        if($(this).attr('class') == "black") {
	         $(this).attr('class', "gray");  
			 update_master_vstatus_only( $(this).attr('id'),"訪問時不在");
			 marker_hide($(this).attr('id'));
			 append_rev( $(this).attr('id'),"訪問時不在");
        } else {
	         $(this).attr('class', "black");  
			 update_master_vstatus_only( $(this).attr('id'),"訪問予定");
			 marker_show($(this).attr('id'));
        }

    }
    
    //コメント入力時のコミット
    function commit_complete() {
		update_master_vstatus_only( current_rec,"訪問完了",$("#vmemo").val());
		append_rev( current_rec,"訪問完了",$("#vmemo").val());
	    
    }
    
    //訪問予定リスト順番の保存
    function save()  {
        var order = 0;
        $('[name="complete"]').each(function(order){
            order++;
            var objParam = {};
            objParam['app'] = kintone.app.getId();// アプリ番号
            objParam['id'] = $(this).attr('id');    // レコード番号
            objParam['record'] = {};
            objParam['record']['vorder'] = {}; // status    
            objParam['record']['vorder']['value'] = order; 
 
        // レコードを更新します
            kintone.api('/k/v1/record', 'PUT', objParam, function(resp){
                // 成功時は画面をリロードします
                //location.reload(true);
                    }, function(resp) {
                        // エラー時はメッセージを表示して、処理を中断します
                        alert('error->' + resp.message);
                    });     
            //update_master_vorder( $(this).attr('id'),order);
            });
        
       //
 
        noty({
	       text: "<b>保存しました</b>",
	       type: "success",
            timeout: 8000,
	       layout: "center",
            });
        
         setTimeout(
           function() {
           location.reload();
            },
        5000);
        }
    
    //地図一覧用function    
    function mapview (e,map_size,with_list) {
        
        var map_hight = map_size;
        
       //一覧の上部あき部分に地図切り替えようボタンを設定,登録済みの場合はいったん削除 
        var btn_check = document.getElementById('my_index_button');
        if (!btn_check){//ボタンが未作成の場合作成する
        
            var myIndexButton = document.createElement('button');
            myIndexButton.id = 'my_index_button';
            if( map_hight == 350 ) {
                myIndexButton.innerHTML = '地図を大きく';
            } else {
                myIndexButton.innerHTML = '地図を小さく';
            }
          
        // 地図サイズ変更ボタンクリック時の処理
            myIndexButton.onclick = function() {
                if( map_hight == 350 ) {
                    map_hight = 800;
                    $("#map").css({'height': '800px'});
                    myIndexButton.innerHTML = '地図を小さく';     
                } else {
                    map_hight = 350;
                    $("#map").css({'height': '350px'});
                    myIndexButton.innerHTML = '地図を大きく';   
                }
            
                google.maps.event.trigger(map, 'resize');
            }
          
            kintone.app.getHeaderMenuSpaceElement().appendChild(myIndexButton);
        }
        
        // 一覧の上部部分にあるスペース部分を定義します
        var elAction = kintone.app.getHeaderSpaceElement();
 
        // すでに地図要素が存在する場合は、削除します
        // ※ ページ切り替えや一覧のソート順を変更した時などが該当します
        var check = document.getElementsByName ('map');
        if (check.length !== 0){
            elAction.removeChild(check[0]);
        }
 
        // 地図を表示する要素を定義し、スペース部分の要素に追加します
        var mapEl = document.createElement('div');
        mapEl.setAttribute('id', 'map');
        mapEl.setAttribute('name', 'map');
        mapEl.setAttribute('style', 'width: auto; height:'+map_hight+ 'px; margin-right: 30px; border: solid 2px #c4b097');
        elAction.appendChild(mapEl);  
          
        var point = new google.maps.LatLng(34.71801,135.369841);//
        // 表示する地図の設定を行います
        var opts = {
            zoom: 12,
            center: point,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scaleControl: true,
            title: 'target'
        };
 
       // 地図の要素を定義します
        map = new google.maps.Map(document.getElementById('map'), opts);

        // Google Geocoder を定義します
        gc = new google.maps.Geocoder(); 
        var appId = kintone.app.getId();
                   
        var members = new Array();
        markers = new Array(); //マーカー用配列を初期化
        
        for (var i = 0; i < e.records.length; i++) {
                var record = e.records[i];
                var detail_link = "/k/"+appId+"/show#record=" + record.recordno.value; 

                createmarker_link(record.Address.value,record.name.value,detail_link,record.recordno.value);
           
                members.push({'recordno': record.recordno.value, 'Address': record.Address.value, 'name': record.name.value,'detaillink':detail_link});
                }
        
        // スコープを取得
        if( with_list ) {
        var scope = angular.element(document.querySelector('#members')).scope();
 
            scope.$apply(function(){
            // リストに値をセット
                scope.members = members;
                });
            
            //テーブルドラッグ＆ドロップ設定
            $("#visitlist tbody").sortable();
            var agent = navigator.userAgent;
            if(agent.search(/iPad/) == -1){ //ipadでない場合は列を非表示
                $("td.ios_col").css({display : 'none'});
                }
        }
        
        $("#save").click(save);
        $('[name="cancel"]').click(cancel);
        $('[name="complete"]').click(complete);
        $('[name="fuzai"]').click(fuzai);

		$( "#dialog" ).dialog({
　　		　autoOpen: false,
　　		　modal: true,
　　		　buttons: {
　　		　　"OK": function(){
				update_master_vstatus_only( current_rec,"訪問完了",$("#vmemo").val());
				append_rev( current_rec,"訪問完了",$("#vmemo").val());
				$(this).dialog('close');
　　　　			}
　　　		}
　　		});
        
    }
    
    //選択したものを印刷リストに登録
    function pr_append() {
	       
		   var printlist = $("#printlist").val();
		   
		   var plist_appId = 101;
		   //印刷リスト管理に印刷リストを登録・更新する
		   	var query ="printlist="+'"' +printlist + '"'+" and "+"date=TODAY() ";
            var appUrl = kintone.api.url('/k/v1/records') + '?app='+ plist_appId  +  "&query="+encodeURI(query+'order by printlistno desc limit 1&fields[0]=printlistno');
            var xmlHttp = new XMLHttpRequest();
            var printlistno = 0;
 
            // 同期リクエストを行う
            xmlHttp.open("GET", appUrl, false);
            xmlHttp.setRequestHeader('X-Requested-With','XMLHttpRequest');
            xmlHttp.send(null);
 
            if (xmlHttp.status == 200 ){
                    if(window.JSON){
                   		 var obj = JSON.parse(xmlHttp.responseText);
				   		 if (obj.records[0] != null) { //既に登録済みの場合
				   		 	try{
                           	 printlistno = parseInt(obj.records[0]['printlistno'].value);
							} catch(e){
                            	event.error = '番号が取得できません。';
								return event;
								}
								}
				   		 }
				   	}
				   	
		if(printlistno==0) {//印刷リストを新規に登録する
            var objParam = {};
            objParam['app'] = plist_appId;// アプリ番号
            objParam['record'] = {};
            objParam['record']['printlist'] = {}; // status    
            objParam['record']['printlist']['value'] = printlist; 
 
        // レコードを登録します
            kintone.api('/k/v1/record', 'POST', objParam, function(resp){
                // 成功時は画面をリロードします
					printlistno = resp.id; //登録後のレコード番号をセット
	                    }, function(resp) {
                        // エラー時はメッセージを表示して、処理を中断します
                        if(resp!="") {alert('error->' + resp.message);}
						});     
 			
					}		   	
        
        $('[name="print"]:checked').each(function() {
			var query ="recordno="+$(this).val();
            var appUrl = kintone.api.url('/k/v1/records') + '?app='+ kintone.app.getId()  +  "&query="+encodeURI(query+'order by recordno desc limit 1&fields[0]=printlist');
            xmlHttp = new XMLHttpRequest();
 
            // 同期リクエストを行う
            xmlHttp.open("GET", appUrl, false);
            xmlHttp.setRequestHeader('X-Requested-With','XMLHttpRequest');
            xmlHttp.send(null);

            var this_printlist = "" //現在登録済みの印刷リストを取得する
            if (xmlHttp.status == 200 ){
                    if(window.JSON){
                   		 var obj = JSON.parse(xmlHttp.responseText);
				   		 if (obj.records[0] != null) { //既に登録済みの場合
				   		 	try{
                           	 this_printlist = obj.records[0]['printlist'].value;
							} catch(e){
                            	event.error = '番号が取得できません。';
								return event;
								}
								}
				   		 }
				   	}
            						
            var match = false;
            
            if(this_printlist != "") {
           		var printlists = this_printlist.split("/");
		   		for(var i=0;i<printlists.length;++i ) {
	           	 if(printlist == printlists[i] ) {
		        	    match = true;
						break;
							}
						}
            }
            
            if( !match ) {//未登録の場合に登録を行う
	            if( this_printlist　!= "" ) {
	            	this_printlist = this_printlist + "/" + printlist;
	            } else {//nullの場合は置き換え
		            this_printlist = printlist;
	            }

				var objParam = {};
				objParam['app'] = kintone.app.getId();// アプリ番号
				objParam['id'] = $(this).val();    // レコード番号
				objParam['record'] = {};
				objParam['record']['printlist'] = {}; // status    
				objParam['record']['printlist']['value'] = this_printlist; 
 
        // レコードを更新します
           		 kintone.api('/k/v1/record', 'PUT', objParam, function(resp){
                // 成功時は画面をリロードします
              	  if(resp=="") { alert("error"); }
                	    }, function(resp) {
                        // エラー時はメッセージを表示して、処理を中断します
                    	    if(resp!="") {alert('error->' + resp.message);}
								});     
							}
						});
        
        noty({
	       text: "<b>登録しました</b>",
	       type: "success",
            timeout: 8000,
	       layout: "center",
            });
       setTimeout(
           function() {
           location.reload();
            },
        5000);
     
    }
    
    //印刷リスト作成
    function printview( e ) {
	     var i;
        var members = new Array();
        var appId = kintone.app.getId();
         
        for (i = 0; i < e.records.length; i++) {
                var record = e.records[i];
                var detail_link = "/k/"+appId+"/show#record=" + record.recordno.value; 

                members.push({'recordno': record.recordno.value, 'printlist':record.printlist.value,'vdate':record.vdate.value,'Address': record.Address.value, 'name': record.name.value,'detaillink':detail_link});
            
                    }
                // スコープを取得
                var scope = angular.element(document.querySelector('#members')).scope();
 
                scope.$apply(function(){
                // リストに値をセット
                    scope.members = members;
                    });
        
        $("#append").click(pr_append);
        $("#all").click(function() {
	         $('[name="print"]').prop("checked", $(this).prop("checked"));
	         });

    }
    
    // 一覧ビューの表示イベント
    kintone.events.on('app.record.index.show', function(e) {
        switch (e.viewId) {
            case 134598://訪問予定リスト作成
                   //訪問予定一覧用function
                visitview(e);                
                break;
            case 135002: // 地図つき訪問予定一覧
            case 135018: // 地図つき訪問予定一覧 開発用
                mapview( e ,350,true);
                break;
			case 135111://印刷リスト作成 開発用
			case 135057://印刷リスト作成 
				printview(e);
            default:
                  break;
        }        
       
    });
})();
