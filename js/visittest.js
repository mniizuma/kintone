var Member = {};
 
(function () {
    "use strict";
 
    Member.Ctrl = function ($scope) {
        // リストを初期化
        $scope.members = [];
         
        // クリックイベント
        $scope.click = function (item) {
            alert(item.name + "がクリックされました");
        }
    };
    
     
    // 一覧ビューの表示イベント
    kintone.events.on('app.record.index.show', function(e) {
        switch (e.viewId) {
            case 134598://訪問予定一覧
                   //訪問予定一覧用function
   
                    var members = new Array();
                    for (var i = 0; i < e.records.length; i++) {
                        var record = e.records[i];
                        members.push({'Address': record.Address.value, 'name': record.name.value});
                        }
                    // スコープを取得
                    var scope = angular.element(document.querySelector('#members')).scope();
 
                    scope.$apply(function(){
                    // リストに値をセット
                    scope.members = members;
                    });
                    $("#visitlist").tableDnD();
  
                        break;
            default:
                        break;
        }        
       
    });
})();
