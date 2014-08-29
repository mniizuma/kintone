//宛名印刷用名簿一覧用JSファイル
// since 2014-

var	this_view = 0;

(function () {
    "use strict";

    //選択された処理項目を元に検索フィルターを追加する
    
    function add_procfilter() {
	    var search_type = $("#searchtype option:selected").val();
		var appId = kintone.app.getId();
		var query = kintone.app.getQueryCondition();//query 部分を取得
	    var queryall = kintone.app.getQuery();//現状のquery全体を取得
		var queryetc=queryall.substr(queryall.indexOf("order"));　//order以降を切り出し

	    var proc_query = "";
		var this_query = "";
	    
	    $('[name="proc"]:checked').each(function(){
	    	if(search_type == "1") {
					this_query = $(this).attr("id")+' in ("'+$(this).val()+'")';

	    	}else{
					this_query = $(this).attr("id")+' not in ("'+$(this).val()+'")';
				}
					
			if(proc_query == "") {
				proc_query = this_query;
			}else {
				proc_query = this_query + " and " + proc_query;
				}

			});
	    
	    if(!query) {
		    query =  proc_query+" " + queryetc;
	    }else {
			query =  "("+proc_query+")" + "and (" + query + ") "+ queryetc;
		    
			}
	    
		var detaillink = "/k/"+appId+"/?view="+this_view + "&query=" + encodeURI(query);

		window.open(detaillink,"_self" );
	    }

    // 一覧ビューの表示イベント
    kintone.events.on('app.record.index.show', function(e) {

		this_view = e.viewId;
       //一覧の上部あき部分に処理項目検索用ボタンを設定,登録済みの場合はいったん削除 
        var btn_check = document.getElementById('procsearch');
        if (!btn_check){//ボタンが未作成の場合作成する
        
            var myIndexButton = document.createElement('button');
            myIndexButton.id = 'procsearch';
            myIndexButton.innerHTML = '処理項目設定';

			}
		kintone.app.getHeaderMenuSpaceElement().appendChild(myIndexButton);
		
		// 一覧の上部部分にあるスペース部分を定義します
        var dlgArea = kintone.app.getHeaderSpaceElement();
 
        // すでに地図要素が存在する場合は、削除します
        // ※ ページ切り替えや一覧のソート順を変更した時などが該当します
        var check = document.getElementsByName ('procdialog');
        if (check.length !== 0){
            dlgArea.removeChild(check[0]);
        }

		var dlg = document.createElement('div');
        dlg.setAttribute('id', 'procdialog');
        dlg.setAttribute('title', '処理項目を選択して下さい');
        dlgArea.appendChild(dlg);

		//dialogの初期設定		
		$( "#procdialog" ).dialog({
　　		　autoOpen: false,
　　		　modal: true,
　　		　buttons: {
　　		　　"適用する": function(){
				add_procfilter();//選択された処理項目を元にフィルターを追加して表示する
				$(this).dialog('close');
　　　　			},
　　		　　"閉じる": function(){
				$(this).dialog('close');
　　　　			}
　　　		}
　　		});

		//dialog の内容を登録
		$("#procdialog" ).append('<select id="searchtype" name="searchtype"></select>');
		$("#searchtype").append('<option value="1" >次のいずれかを含む</option>');
		$("#searchtype").append('<option value="2" selected >次のいずれも含まない</option>');
		$("#procdialog" ).append('<table id="procselect"></table>');
		$("#procselect").append('<tr><td width="150"><input type="checkbox" id="proc1" name="proc" value="転居先不明">転居先不明</td><td width="150"><input type="checkbox" id="proc2" name="proc" value="転送先">転送先</td><td width="150"><input type="checkbox" id="proc3" name="proc" value="転送元">転送元</td></tr>');
		$("#procselect").append('<tr><td><input type="checkbox" name="proc" id="proc4" value="手紙不要">手紙不要</td><td><input type="checkbox" name="proc" id="proc5" value="手紙返却">手紙返却</td><td><input type="checkbox" name="proc" id="proc6" value="連絡先有">連絡先有</td></tr>');
		$("#procselect").append('<tr><td><input type="checkbox" name="proc" id="proc7" value="仮設住宅">仮設住宅</td><td><input type="checkbox" name="proc" id="proc8" value="他候補支持">他候補支持</td><td><input type="checkbox" name="proc" id="proc9" value="陳情">陳情</td></tr>');
		$("#procselect").append('<tr><td><input type="checkbox" name="proc" id="proc10" value="支援拒否">支援拒否</td><td><input type="checkbox" name="proc" id="proc11" value="解消先">解消先</td><td><input type="checkbox" name="proc" id="proc12" value="死亡">死亡</td></tr>');
		$("#procselect").append('<tr><td><input type="checkbox" name="proc" id="proc13" value="市外へ転出">市外へ転出</td><td><input type="checkbox" name="proc" id="proc14" value="退職">退職</td><td><input type="checkbox" name="proc" id="proc15" value="電話不通">電話不通</td></tr>');
		$("#procselect").append('<tr><td><input type="checkbox" name="proc" id="proc16" value="その他">その他</td><td><input type="checkbox" name="proc" id="procdel" value="重複のため削除データへ">重複のため削除</td></tr>');
		
        $("#procsearch").click(function(){
	       	$( "#procdialog" ).dialog("open");
        });
       
    });
})();
