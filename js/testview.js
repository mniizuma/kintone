var Student = {};
 
(function () {
    "use strict";
 
    Student.Ctrl = function ($scope) {
        // リストを初期化
        $scope.students = [];
         
        // クリックイベント
        $scope.click = function (item) {
            alert(item.name + "がクリックされました");
        }
    };
     
    // 一覧ビューの表示イベント
    kintone.events.on('app.record.index.show', function(e) {
        if (e.viewId != 134396) return;
         
        var students = new Array();
        for (var i = 0; i < e.records.length; i++) {
            var record = e.records[i];
            students.push({'id': record.Address.value, 'name': record.name.value});
        }
        // スコープを取得
        var scope = angular.element(document.querySelector('#students')).scope();
 
        scope.$apply(function(){
            // リストに値をセット
            scope.students = students;
        });
    });
})();
