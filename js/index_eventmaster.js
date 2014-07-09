//後援会名簿一覧用JSファイル
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
	function eventview(e) {
		var members = new Array();
		var appId = kintone.app.getId();
		var meiboappId = 94;//参加舎名簿アプリ
        
        for (var i = 0; i < e.records.length; i++) {
                var record = e.records[i];
                var detaillink = "/k/"+appId+"/show#record=" + record.$id.value; 
				var meibolink = "/k/"+meiboappId+"/?view=135127"+encodeURI("&q=f135121="+record.$id.value);
				var meibolink2 = "/k/"+meiboappId+"/?view=135137"+encodeURI("&q=f135121="+record.$id.value);

                members.push({'id': record.$id.value, 'eventname': record.eventname.value, 'date': record.date.value,'detaillink': detaillink,'meibolink': meibolink,'meibolink2': meibolink2});
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
            case 135193://イベント一覧
                eventview(e);                
                break;
            default:
                  break;
        }        
       
    });
})();
