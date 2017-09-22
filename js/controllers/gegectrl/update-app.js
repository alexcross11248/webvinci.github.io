'use strict';

app
	.controller('UpdateAppCtrl', ['$scope', 'commonService', 'modelService', function($scope, commonService, modelService) {
		console.log('更新管理');
		$scope.appInfo = {};
		console.log(modelService.rootUrl);
		$scope.subFlag = true;
		$scope.fileCompleted = false;
		$scope.progressLoad = 0;
		$scope.btnName = '发布更新';
		$scope.subAppInfo = function() {
			if($scope.subFlag) {
				$scope.subFlag = false;
				var fd = new FormData();
				var file = document.querySelector('input[type=file]').files[0];
				fd.append('fileToUpload', file);
				if(file == null || file == '' || file == undefined) {
					alert('请上传app文件');
					return;
				} else {
					console.log(fd);
					$scope.fileCompleted = true;
					$scope.btnName = '提交中...';
					$.ajax({
						url: modelService.rootUrl + 'APKHandler.ashx',
						type: "POST",
						async: false,
						cache: false,
						processData: false,
						contentType: false,
						data: fd,
						success: function(res) {
							console.log(res);
							$scope.subFlag = true;
							$scope.btnName = '发布更新';
						},
						error: function(error) {
							console.log(error);
						}
					});

				}
			}
		}
	}]);