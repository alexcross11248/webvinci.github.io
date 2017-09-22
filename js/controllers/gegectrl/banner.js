'use strict';


app
	// Flot Chart controller
	.controller('BannerCtrl', ['$scope', 'commonService', 'modelService', function($scope, commonService, modelService) {
		console.log('banner管理');

		$scope.getBanner = function() {
			modelService.getBanner().then(function(res) {
				console.log(res);
				if(res.code == 0) {
					//处理返回数据
					$scope.bannerList = _.map(commonService.translateServerData(res.body), function(item) {
						item.bannerImg = modelService.rootUrl + 'Banner/' + item.BannerUrl;
						item.btnName = '编辑';
						item.btnState = true;
						return item;
					});

				} else {
					alert('数据为空');
					$scope.pageList = [];
				}
			}, function(err) {});
		}
		$scope.getBanner();

		//显示大图及改变图片
		$scope.showPic = function(item) {
			//编辑状态下放大图片并可以改变图片
			if(!item.btnState) {
				$scope.bannerPic = item;
				$('#modal_showAudit').modal('show');
			}
		}

		//更改图片并提交
		$scope.changeBannerPic = function() {
			//			var fd = new FormData();
			//			var file = document.querySelector('#fileToUpload').files[0];
			//			fd.append('fileToUpload', file);
			//
			//			if(file == null || file == '' || file == undefined) {
			//
			//			} else {
			//				$.ajax({
			//					url: modelService.BATHURL+'ImgHandler.ashx',
			//					type: "POST",
			//					async: false,
			//					cache: false,
			//					processData: false,
			//					contentType: false,
			//					data: fd,
			//					success: function(res) {
			//						$scope.bannerPic.bannerImg = res;
			//						modelService.updateBanner({
			//							model: $scope.bannerPic
			//						}).then(function(da) {
			//							if(da.code == 0) {
			//								//处理返回数据
			//								alert('更新成功');
			//							} else {
			//								alert('更新失败');
			//							}
			//						}, function(err) {});
			//					},
			//					error: function(err) {
			//						console.log(err);
			//					}
			//				});
			//			}
			$('#modal_showAudit').modal('hide');
		}
		
		//关闭图片modal
		$scope.closeModal = function() {
			$('#modal_showAudit').modal('hide');
		}

		//编辑或显示
		$scope.editOrShow = function(item) {
			if(item.btnName == '编辑') {
				item.btnName = '保存';
				item.btnState = false;
			} else {
				//更新banner信息
				modelService.updateBanner({
					model: item
				}).then(function(res) {
					console.log(res);
					if(res.code == 0) {
						//处理返回数据
						alert('更新成功');
					} else {
						alert('更新失败');
					}
					item.btnName = '编辑';
					item.btnState = true;
				}, function(err) {});
			}
		}

		//是否包含链接处理
		$scope.onOroffUrl = function(item) {
			console.log(item.IsFlag);
			if(item.IsFlag == 0) {
				item.BannerToUrl = '';
			}
		}

	}]);