//印刷リスト一覧用JSファイル
// since 2014-

var Member = {};
var markers = [];
 
(function () {

    "use strict";
 
    Member.Ctrl = function ($scope) {
        // リストを初期化
        $scope.members = [];
         
        // クリックイベント
        $scope.click = function (item) {
         }
    };

	//イベント一覧
	function plistview(e) {
		var members = new Array();
		var appId = kintone.app.getId();
		var meiboappId = 74;//参加舎名簿アプリ
        
        for (var i = 0; i < e.records.length; i++) {
                var record = e.records[i];
                var detaillink = "/k/"+meiboappId+"/?view=135209" + encodeURI("&q=f135056 like "+'"' + record.printlist.value) + '"';
                members.push({'id': record.$id.value, 'printlist': record.printlist.value, 'date': record.date.value,'detaillink': detaillink});
                }
        
        // スコープを取得
        var scope = angular.element(document.querySelector('#members')).scope();
 
        scope.$apply(function(){
            // リストに値をセット
			scope.members = members;
            });
	}

    // 一覧ビューの表示イベント
    kintone.events.on('app.record.index.show', function(e) {
        switch (e.viewId) {
            case 135206://イベント一覧
                plistview(e);                
                break;
            default:
                  break;
        }        
       
    });
})();
