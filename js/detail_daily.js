/*
 * 日報アプリ詳細画面用JS
 * Copyright (c) 2013 Cybozu
 * Modified 2014 mniizuma
 * Licensed under the MIT License
 */


(function () {
 
    "use strict"; 

//実行環境の確認
	function env_check() {
	}


//summary に訪問履歴のまとめを作成する
	function create_summary( user,date) {

		var meibo_id = 74; //名簿アプリのid
		var rireki_id = 79;	//履歴アプリのid	

		
	//表の外観を作成
		var s1 = kintone.app.record.getSpaceElement("summary1");
  
		var s_tbl1 = document.createElement('div');
		s_tbl1.setAttribute('id', 'summary1');
		s_tbl1.setAttribute('name', 'summary1');
		s1.appendChild(s_tbl1);
    
		$("#summary1" ).append('<table id="s_tbl1" name="s_tbl1" class="viewtable"></table>');//表示用テーブルを定義
		//ヘッダー定義
		$("#s_tbl1").append('<thead><tr><td>氏名</td><td>結果</td><td>コメント</td></thead>');

		//集計表の外側定義
		var s2 = kintone.app.record.getSpaceElement("summary2");
  
		var s_tbl2 = document.createElement('div');
		s_tbl2.setAttribute('id', 'summary2');
		s_tbl2.setAttribute('name', 'summary2');
		s2.appendChild(s_tbl2);
    
		$("#summary2").append('<p></p>');
		$("#summary2" ).append('<table id="s_tbl2-1" name="s_tbl2-1" class="sumtable"></table>');//表示用テーブルを定義
		//ヘッダー定義
		$("#s_tbl2-1").append("<caption>本日の訪問結果</caption>");
		$("#s_tbl2-1").append('<thead><tr><td>完了</td><td>不在</td><td>計</td></thead>');
		$("#s_tbl2-1").append('<tbody<tr><td id="complete"></td><td id="fuzai"></td><td id="total"></td></tbody>');

		$("#summary2" ).append('<table id="s_tbl2-2" name="s_tbl2-2" class="sumtable"></table>');//表示用テーブルを定義
		//ヘッダー定義
		$("#s_tbl2-2").append("<caption>訪問先評価内訳</caption>");
		$("#s_tbl2-2").append('<thead><tr><td>正治評価</td><td>1</td><td>2</td><td>3</td><td>泰寿評価</td><td>1</td><td>2</td><td>3</td></thead>');
		$("#s_tbl2-2").append('<tbody><tr><td></td><td id="m1"></td><td id="m2"></td><td id="m3"></td><td></td><td id="y1"></td><td id="y2"></td><td id="y3"></td></tbody>');

		//userとdateから履歴アプリを検索してレコードを取得する
		var query = 'vdate="'+date+'" and tanto in ("'+user + '")';
		var base_url = kintone.api.url("/k/v1/records"); 
		var base_url2 = kintone.api.url("/k/v1/record"); 

		if(base_url.indexOf("hanare") > 0) {
			meibo_id = 82; //名簿アプリのid
			rireki_id = 86;	//履歴アプリのid	
		}

        var appUrl = base_url + '?app=' + rireki_id + '&query=' + encodeURI(query + ' order by vdate asc');
        var xmlHttp = new XMLHttpRequest();

        // 同期リクエストを行う
        xmlHttp.open("GET", appUrl, false);
        xmlHttp.setRequestHeader('X-Requested-With','XMLHttpRequest');
        xmlHttp.send(null);

        if (xmlHttp.status != 200) return;
       
        var obj = JSON.parse(xmlHttp.responseText);
		var records = obj.records;

		//集計用
		var complete = 0;
		var	fuzai = 0;
		var m1 = 0,m2=0,m3=0;
		var y1=0,y2=0,y3=0;

		for( var i=0; i < records.length; i++ ) {
			var record = records[i];
			var meibo_link = "/k/"+ meibo_id + "/show#record=" + record["meiborecord"]["value"];
			var this_tr = '<tr>' + '<td class="code_col"><a href="' + meibo_link + '" target="_blank">' + record["name"]["value"] + '</td><<td class="status_col">' + record["vstatus"]["value"] + '</td><td>' + record["vmemo"]["value"] + '</td>';
			$("#s_tbl1").append(this_tr);
			
			//訪問結果のcount
			switch (record["vstatus"]["value"]) {
				case "訪問完了":
					complete++; 
					break;
				case "訪問時不在":
					fuzai++;
					break;
					}

			//評価別集計のためも名簿参照
	        var meiboUrl = base_url2 + '?app=' + meibo_id + "&id=" + record["meiborecord"]["value"];
			var xmlHttp = new XMLHttpRequest();

        // 同期リクエストを行う
	        xmlHttp.open("GET", meiboUrl, false);
			xmlHttp.setRequestHeader('X-Requested-With','XMLHttpRequest');
			xmlHttp.send(null);

			if (xmlHttp.status != 200) continue;
       
			var obj = JSON.parse(xmlHttp.responseText);
			var meibo_record = obj.record;
			
			//評価別の集計
			switch (meibo_record["m_stat"]["value"]) {
				case	"1":
					m1++;
					break;
				case	"2":
					m2++;
					break;
				case	"3":
					m3++;
					break;
					}

			switch (meibo_record["y_stat"]["value"]) {
				case	"1":
					y1++;
					break;
				case	"2":
					y2++;
					break;
				case	"3":
					y3++;
					break;
					}

				}

		//集計結果を表示する
		$("#complete").text(complete);
		$("#fuzai").text(fuzai);
		$("#total").text(complete+fuzai);

		$("#m1").text(m1);
		$("#m2").text(m2);
		$("#m3").text(m3);

		$("#y1").text(y1);
		$("#y2").text(y2);
		$("#y3").text(y3);

 	}
	
//

//新規作成時
	function create_detail(e) {
		//login ユーザーのIDを取得してキーにする
		
		var login =kintone.getLoginUser();
		
		//日付の初期値を取得して日付キーとする
		
		var record = e.record;
		
		create_summary( login.code,record["date"]["value"] );
		
	}



//詳細ページ表示用    
    function detail_page(e) {
		var record = e.record;
				
		create_summary( record["user"]["value"]["code"],record["date"]["value"] );
	    
    }

//サマリーの書き換え
	function change_summary(e) {
		var record = e.record;

		env_check();

		create_summary( record["user"]["value"]["code"],record["date"]["value"] );
		
	}
    
    
    //レコード表示の場合
	    //新規レコード用イベント処理
	    kintone.events.on('app.record.create.show', create_detail );    
		//レコード表示の場合
	    kintone.events.on('app.record.detail.show', detail_page );
	    //レコード編集の場合
	    kintone.events.on('app.record.edit.show', detail_page );
	    //日付が変更された場合
		kintone.events.on('app.record.edit.change.cdate', change_summary );

        })();
