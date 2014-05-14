var Member = {};
var map;
var gc;
 
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
    
    //訪問予定リスト追加
    function append() {
        var i = 0;
        
       //チェックされた項目を記録する変数
  
        alert("pushed button");
    }
    
 
    //訪問予定一覧用function    
    function visitview (e) {
        var i;
        var members = new Array();
        for (i = 0; i < e.records.length; i++) {
                var record = e.records[i];
                members.push({'recordno': record.recordno.value, 'Address': record.Address.value, 'name': record.name.value});
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

        //テーブルドラッグ＆ドロップ設定
        $("#visitlist tbody").sortable();
        
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
    function createmarker_link( address,title,link ) {
        
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

                }               
                
            });
            
    
        
    }
    
    //地図一覧用function    
    function mapview (e) {
              
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
        mapEl.setAttribute('style', 'width: auto; height: 350px; margin-right: 30px; border: solid 2px #c4b097');
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
                   
        var members = new Array();
        for (var i = 0; i < e.records.length; i++) {
                var record = e.records[i];
                createmarker(record.Address.value,record.name.value);
            
                members.push({'Address': record.Address.value, 'name': record.name.value});
            }
        
        // スコープを取得
            var scope = angular.element(document.querySelector('#members')).scope();
 
            scope.$apply(function(){
            // リストに値をセット
                scope.members = members;
                });
            
            //$("#visitlist").sortable();
        }
   
     //地図一覧用function2
    //地図を大きくしマーカーからいろいろできるようにしてみた
    function mapview2 (e) {
              
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
        mapEl.setAttribute('style', 'width: auto; height: 800px; margin-right: 30x; border: solid 2px #c4b097');
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
        for (var i = 0; i < e.records.length; i++) {
                var record = e.records[i];
                var detail_link = "/k/"+appId+"/show#record=" + record.recordno.value; 
                createmarker_link(record.Address.value,record.name.value,detail_link);
            
            
            }
        
        }
         
   
    
    // 一覧ビューの表示イベント
    kintone.events.on('app.record.index.show', function(e) {
        switch (e.viewId) {
            case 134598://訪問予定一覧
                   //訪問予定一覧用function
                visitview(e);                
                break;
            case 135018: // 地図一覧
                mapview( e );
                break;
            case 135021: // 地図一覧2
                mapview2( e );
                break;
           
            default:
                  break;
        }        
       
    });
})();
