//後援会名簿一覧用JSファイル
// since 2014-

var Member = {};
var map;
var gc;
var markers = [];
 
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
    function update_member_estatus_only( record_id, status ) {
        var objParam = {};
        objParam['app'] = kintone.app.getId();// アプリ番号
        objParam['id'] = record_id;    // レコード番号
        objParam['record'] = {};
        objParam['record']['eventstatus'] = {}; // status    
        objParam['record']['eventstatus']['value'] = status; 
 
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
    
//変更内容の保存
    function save()  {
            var objParam = {};
			var id = $(this).attr('id'); 
            objParam['app'] = kintone.app.getId();// アプリ番号
            objParam['id'] = id;   // レコード番号
            objParam['record'] = {};
            objParam['record']['company'] = {}; // status    
            objParam['record']['company']['value'] = $("#company_"+id).val();
            objParam['record']['company_yomi'] = {}; // status    
            objParam['record']['company_yomi']['value'] = $("#company_yomi_"+id).val();
            objParam['record']['dairi'] = {}; // status    
            objParam['record']['dairi']['value'] = $("#dairi_"+id).val();
            objParam['record']['others'] = {}; // status    
            objParam['record']['others']['value'] = $("#others_"+id).val();

        // レコードを更新します
            kintone.api('/k/v1/record', 'PUT', objParam, function(resp){
                // 成功時は画面をリロードします
                //location.reload(true);
                    }, function(resp) {
                        // エラー時はメッセージを表示して、処理を中断します
                        alert('error->' + resp.message);
                    });     
        
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


//出席と不参加    
    function complete() {    
    	var this_td=$(this).parent()[0];
    	var this_row=$(this_td).parent()[0];
    	var status_col = $(this_row).children('td:eq(2)');
    	
        if($(this).attr('class') == "black") {
	         $(this).attr('class', "gray");  
			 update_member_estatus_only( $(this).attr('id'),"参加");
			 status_col.text("参加");
		} else {
	         $(this).attr('class', "black");  
			 update_member_estatus_only( $(this).attr('id'),"申し込み");
			 status_col.text("申し込み");
			 }
    }

    function cancel() {    
    	var this_td=$(this).parent()[0];
    	var this_row=$(this_td).parent()[0];
    	var status_col = $(this_row).children('td:eq(2)');

        if($(this).attr('class') == "black") {
	         $(this).attr('class', "gray");  
			 update_member_estatus_only( $(this).attr('id'),"不参加");
			 status_col.text("不参加");
		} else {
	         $(this).attr('class', "black");  
			 update_member_estatus_only( $(this).attr('id'),"申し込み");
			 status_col.text("申し込み");
			 }

    }
    

	//参加者一覧
	function memberview(e) {
		var members = new Array();
        
        for (var i = 0; i < e.records.length; i++) {
                var record = e.records[i];
  
                members.push({'id': record.$id.value, 'eventstatus': record.eventstatus.value,'eventno': record.eventno.value,'eventname': record.eventname.value,'meibocd': record.meibocd.value, 'name': record.name.value,'tel': record.tel.value,'company': record.company.value,'company_yomi': record.company_yomi.value,'dairi': record.dairi.value,'others': record.others.value});
                }
        
        // スコープを取得
        var scope = angular.element(document.querySelector('#members')).scope();
 
        scope.$apply(function(){
            // リストに値をセット
			scope.members = members;
            });
            
        $('[name="cancel"]').click(cancel);       
        $('[name="complete"]').click(complete);
 		$('[name="save"]').click(save);	
	}


    // 一覧ビューの表示イベント
    kintone.events.on('app.record.index.show', function(e) {
        switch (e.viewId) {
            case 135137://参加者一覧開発用
                memberview(e);                
                break;
            default:
                  break;
        }        
       
    });
})();
