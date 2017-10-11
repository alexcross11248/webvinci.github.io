'use strict';

app
	.controller('UpdateAppCtrl', ['$scope', 'commonService', 'modelService', '$newLocalStorage', '$state', function($scope, commonService, modelService, $newLocalStorage, $state) {
		console.log('更新管理');
		$scope.appInfo = {};
		console.log(modelService.rootUrl);
		$scope.subFlag = true;
		$scope.fileCompleted = false;
		$scope.progressLoad = 0;
		$scope.btnName = '发布更新';
		$scope.showContent = false;
		$scope.gegeUser = JSON.parse($newLocalStorage.get('gege_manager'));
		if($scope.gegeUser) {
			//判断是否有权限
			if($scope.$parent.gegePermisson.appPermisson) {
				$scope.showContent = true;
			} else {
				alert('您还没有相应权限，联系管理员给您开通吧！');
				return;
			}
		} else {
			$state.go('access.signin');
		}

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