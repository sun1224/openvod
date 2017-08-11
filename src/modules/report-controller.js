'use strict';
(function () {
    var app = angular.module('app.report', [])
        .controller('reportFormController', ['$scope', '$http', '$state', 'util', '$filter', 'NgTableParams', '$location',
            function ($scope, $http, $state, util, $filter, NgTableParams, $location) {
                var self = this;
                self.init = function () {
                    self.searchDate = new Date().getTime() - 2678400000;
                    self.endDate = new Date();
                    self.downloading = false;
                    self.complete = false;
                    self.getInfo();
                    console && console.log(self.searchDate, self.endDate);
                };
                /**
                 * datepiker
                 */
                self.open = function ($event) {
                    if ($event.target.className.indexOf('start') != -1) {
                        self.startOpened = true;
                        self.endOpened = false;
                    } else {
                        self.startOpened = false;
                        self.endOpened = true;
                    }
                };
                // 获取报表数据
                self.getInfo = function () {
                    // self.searchDate = $filter('date')(self.searchDate, 'yyyy-MM-dd');
                    // self.endDate = $filter('date')(self.endDate, 'yyyy-MM-dd');
                    self.noData = false;
                    self.loading = true;
                    var qrcodeData = [], roomData = []
                    var data = {
                        "action": "getDateStatisXlsShow",
                        "token": util.getParams("token"),
                        "projectList": [util.getParams("projectName")],
                        "startDate": util.format_yyyyMMdd(new Date(self.searchDate)) + ' 00:00:00',
                        "endDate": util.format_yyyyMMdd(new Date(self.endDate)) + ' 00:00:00'
                    }
                    $http({
                        method: 'POST',
                        url: util.getApiUrl('luan/statistics', '', 'server'),
                        data: data
                    }).then(function successCallback (response) {
                        var data = response.data;
                        console.log(data)
                        if (data.rescode == '200') {
                            var array1 = [], array2 = [], array3 = [], array4 = [];
                            for (var key1 in data.qrcode) {
                                var total1 = 0
                                for (var i = 0; i < data.qrcode[key1].length; i++) {
                                    total1 += data.qrcode[key1][i]
                                }
                                array1.push(key1)
                                array2.push(total1)
                            }
                            // 移动总计到数组最后
                            var idx = array1.indexOf('总计')
                            var lastItemName=array1[idx]
                            var lastItemVal=array2[idx]
                            array1.splice(idx, 1)
                            array2.splice(idx, 1)
                            array1.push(lastItemName)
                            array2.push(lastItemVal)
                            // 合并两行扫码数据
                            qrcodeData.push(array1, array2)
                            for (var key2 in data.room) {
                                var total2 = 0
                                for (var j = 0; j < data.room[key2].length; j++) {
                                    total2 += data.room[key2][j]
                                }
                                array3.push(key2)
                                array4.push(total2)
                            }
                            // 合并两行订房数据
                            roomData.push(array3, array4)
                            self.qrcodeTable = qrcodeData
                            self.roomTable = roomData
                            self.loading = false
                        } else if (data.rescode == '401') {
                            alert('访问超时，请重新登录');
                            $state.go('login');
                        } else {
                            alert('修改失败' + data.errInfo);
                        }
                    }, function errorCallback (response) {
                        alert('连接服务器出错');
                    }).finally(function (value) {
                        self.saving = false;
                    });
                }

                // 获取下载链接
                self.export = function () {
                    self.sTime = util.format_yyyyMMdd(new Date(self.searchDate))
                    self.eTime = util.format_yyyyMMdd(new Date(self.endDate))
                    self.downloading = true
                    self.complete = false
                    var data = {
                        "action": "getDateStatisXlsLoad",
                        "token": util.getParams("token"),
                        "projectList": [util.getParams("projectName")],
                        "startDate": util.format_yyyyMMdd(new Date(self.searchDate)) + ' 00:00:00',
                        "endDate": util.format_yyyyMMdd(new Date(self.endDate)) + ' 00:00:00'
                    }
                    $http({
                        method: 'POST',
                        url: util.getApiUrl('luan/statistics', '', 'server'),
                        data: data
                    }).then(function successCallback (response) {
                        var data = response.data;
                        console.log(data)
                        if (data.rescode == '200') {
                            console.log(data)
                            self.downloadLink = data.file_url[0]
                            self.downloading = false
                            self.complete = true
                        } else if (data.rescode == '401') {
                            alert('访问超时，请重新登录');
                            $state.go('login');
                        } else {
                            alert('修改失败' + data.errInfo);
                        }
                    }, function errorCallback (response) {
                        alert('连接服务器出错');
                    }).finally(function (value) {
                        self.saving = false;
                    });
                }
            }
        ])
})();