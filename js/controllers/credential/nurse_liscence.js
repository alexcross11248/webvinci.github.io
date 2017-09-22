'use strict';

/* Controllers */

app
	// Flot Chart controller
	.controller('NurseLiscenceCtrl', ['$scope', 'commonService', 'modelService', function($scope, commonService, modelService) {
		$scope.currentPageNo = 1;
		$scope.pageSize = 10;
		$scope.liscenceList = [];
		$scope.liscenceDetail = {};
		$scope.pageList = [];
		$scope.selectData = false; //是否选中一行
		$scope.searchOption = {}; //搜索条件
		$scope.searchState = 'all'; //页面初始显示全部
		console.log('护士资格证');

		$scope.getLiscenceList = function(page) {
			if($scope.searchState == 'all') {
				var data = {
					pageNumber: page,
					pageSize: $scope.pageSize,
					CertificateId: '',
					Name: ''
				};
			} else {
				var data = {
					pageNumber: page,
					pageSize: $scope.pageSize,
					CertificateId: $scope.searchOption.liscenceID,
					Name: $scope.searchOption.Name
				};
			}

			//获取资格证列表
			modelService.getLiscenceList(data).then(function(res) {
				console.log(res);
				if(res.code == 0) {
					//处理返回数据
					$scope.liscenceList = _.map(commonService.translateServerData(res.body), function(item) {
						item.DateBirth = commonService.str2date(item.DateBirth, 'yyyy-MM-dd');
						item.ApproveDate = commonService.str2date(item.ApproveDate, 'yyyy-MM-dd');
						item.IssuingDate = commonService.str2date(item.IssuingDate, 'yyyy-MM-dd');
						item.Picture1 = modelService.rootUrl + 'QC/' + item.Picture1;
						item.Picture2 = modelService.rootUrl + 'QC/' + item.Picture2;
						if(item.VerifyStatus == 1) {
							item.auditState = '待审核';
						} else if(item.VerifyStatus == 2) {
							item.auditState = '已拒绝';
						} else if(item.VerifyStatus == 3) {
							item.auditState = '已通过';
						}
						return item;
					});
					//获取数据总条数
					$scope.totalNum = Number(res.msg);
					//计算页数
					$scope.pages = Math.ceil($scope.totalNum / $scope.pageSize);
					//存储页数
					for(var i = 1; i <= $scope.pages; i++) {
						$scope.pageList.push(i);
					}
					console.log($scope.pageList);
				} else {
					alert('数据为空');
				}
			}, function(err) {});
		}

		$scope.getLiscenceList($scope.currentPageNo);

		$scope.searchByOption = function() {
			$scope.searchState = 'byOption';
			if($scope.searchOption.Name && $scope.searchOption.liscenceID) {
				$scope.getLiscenceList(1);
			}
		}
		$scope.searchAll = function() {
			$scope.searchState = 'all';
		}

		//提交审核
		$scope.updateAuditStatus = function(status) {
			$scope.liscenceDetail.Type = 1;
			if(status == 'ok') {
				//通过审核
				$scope.liscenceDetail.VerifyStatus = 3;
				modelService.UpdateAuditStatus({
					model: $scope.liscenceDetail
				}).then(function(res) {
					console.log(res);
				}, function(err) {});
			}
			if(status == 'deny') {
				//拒绝通过
				$scope.liscenceDetail.VerifyStatus = 2;
				modelService.UpdateAuditStatus({
					model: $scope.liscenceDetail
				}).then(function(res) {
					console.log(res);
				}, function(err) {});
			}
		}
		//后一页
		$scope.goNext = function(i) {
			if(i == $scope.pages) {
				return;
			} else {
				i++;
				$scope.getLiscenceList(i);
			}

		}
		//前一页
		$scope.goPre = function(i) {
			if(i == 1) {
				return;
			} else {
				i--;
				$scope.getLiscenceList(i);
			}
		}
		//指定页
		$scope.goCurrentPage = function(i) {
			$scope.getLiscenceList(i);
		}

		
		//选中行
		$scope.operateData = function($index, item) {
			console.log($index);
			$('tbody tr').removeClass('tr-success');
			$('tbody tr:eq(' + $index + ')').addClass('tr-success');
			$scope.selectData = true;
			$scope.liscenceDetail = item;
		}

		//显示审核框
		$scope.editLiscenceDetail = function(item) {
			if($scope.selectData) {
				$('#modal_showAudit').modal('show');
			} else {
				alert('请选中需要审核的证件');
			}

			console.log($scope.liscenceDetail);
		}

		//刷新页面
		$scope.refresh = function() {
			window.location.reload();
		}

	}]);