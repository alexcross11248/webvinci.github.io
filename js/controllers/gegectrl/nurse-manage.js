'use strict';

/* Controllers */

app
	// Flot Chart controller
	.controller('NurseManageCtrl', ['$scope', 'commonService', 'modelService', function($scope, commonService, modelService) {
	console.log('护士管理');
	
	$scope.currentPageNo = 1;
		$scope.pageSize = 16;
		$scope.nurseInfoList = [];
		$scope.nurseInfo = {};
		$scope.pageList = [];
		$scope.initNurseInfo = {
			DisplayOrder: 0,
			DepartmentId: '',
			HospitalName: '',
			Name: '',
			Contact: '',
			Phone: '',
			OperatorId: ''
		};
		//根据分页获取医院列表
		$scope.getNurseInfoList = function(page) {
//			modelService.getNurseInfoList({
//				pageNumber: page,
//				pageSize: $scope.pageSize
//			}).then(function(res) {
//				console.log(res);
//				if(res.code == 0) {
//					//处理返回数据
//					$scope.departmentInfoList = _.map(commonService.translateServerData(res.body), function(item) {
//						(item.DisplayOrder == 1) ? item.DisplayOrderName = "是": item.DisplayOrderName = "否";
//						return item;
//					});
//					$scope.pageList = [];
//					//获取数据总条数
//					$scope.totalNum = parseInt(res.msg);
//					//计算页数
//					$scope.pages = Math.ceil($scope.totalNum / $scope.pageSize);
//					//存储页数
//					for(var i = 1; i <= $scope.pages; i++) {
//						$scope.pageList.push(i);
//					}
//				} else {
//					alert('数据为空');
//					$scope.pageList=[];
//				}
//			}, function(err) {});
		}
		$scope.getNurseInfoList($scope.currentPageNo);

		//后一页
		$scope.goNext = function(i) {
			if(i == $scope.pages) {
				return;
			} else {
				i++;
				$scope.getNurseInfoList(i);
			}

		}
		//前一页
		$scope.goPre = function(i) {
			if(i == 1) {
				return;
			} else {
				i--;
				$scope.getNurseInfoList(i);
			}
		}
		//指定页
		$scope.goCurrentPage = function(i) {
			$scope.getNurseInfoList(i);
		}

		$scope.operateData = function($index, item) {
			console.log($index);
			$('tbody tr').removeClass('tr-success');
			$('tbody tr:eq(' + $index + ')').addClass('tr-success');
			$scope.selectData = true;
			$scope.nurseInfo = item;
			console.log($scope.nurseInfo);
		}
		$scope.changefile=function () {
			
		}

		//添加用户
		$scope.addNurseInfo = function() {
			$('tbody tr').removeClass('tr-success');
			$scope.selectData = false;
			$('#modal_showAudit').modal('show');
			$scope.nurseInfo = angular.copy($scope.initNurseInfo);

		}

		//删除用户
		$scope.deleteNurseInfo = function() {
			$('#modal_showAudit').modal('show');
			$scope.nurseInfo = angular.copy($scope.initNurseInfo);

		}

		//显示编辑框
		$scope.editNurseInfo = function() {
			$scope.operateState = 'edit';
			if($scope.selectData) {
				$('#modal_showAudit').modal('show');
			} else {
				alert('请选择要编辑的科室');
			}

			console.log($scope.nurseInfo);
		}
		//更新用户信息
		$scope.subNurseInfo = function(item) {
			if($scope.operateState == 'add') {

			} else if($scope.operateState == 'edit') {

			}
			$('#modal_showAudit').modal('hide');
			$scope.nurseInfo = {};
		}
		//关闭编辑框
		$scope.closeModal = function() {
			$('#modal_showAudit').modal('hide');
			$scope.nurseInfo = angular.copy($scope.initNurseInfo);
		}

		//刷新页面
		$scope.refresh = function() {
			window.location.reload();
		}

	}]);