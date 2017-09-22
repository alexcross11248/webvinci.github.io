'use strict';

app
	// Flot Chart controller
	.controller('ManagerOperateCtrl', ['$scope', 'commonService', 'modelService', function($scope, commonService, modelService) {

		$scope.currentPageNo = 1;
		$scope.pageSize = 16;
		$scope.managerList = [];
		$scope.managerInfo = {};
		$scope.pageList = [];
		$scope.initManagerInfo = {

		};
		//根据分页获取管理员列表
		$scope.getManagerInfoList = function(page) {
			modelService.getAdmin({
				pageNumber: page,
				pageSize: $scope.pageSize
			}).then(function(res) {
				if(res.code == 0) {
					//处理返回数据
					$scope.managerList = _.map(commonService.translateServerData(res.body), function(item) {
						item.OperatorTime = commonService.str2date(item.OperatorTime, 'yyyy-MM-dd');
						for(var i = 0; i < item.Admpermissionlist.length; i++) {
							if(item.Admpermissionlist[i].PermissionId == '000000001') {
								item.isblsj = true;
							}
							if(item.Admpermissionlist[i].PermissionId == '000000002') {
								item.ispb = true;
							}
							if(item.Admpermissionlist[i].PermissionId == '000000003') {
								item.isxf = true;
							}
						}
						return item;
					});
					$scope.pageList = [];
					//获取数据总条数
					$scope.totalNum = parseInt(res.msg);
					//计算页数
					$scope.pages = Math.ceil($scope.totalNum / $scope.pageSize);
					//存储页数
					for(var i = 1; i <= $scope.pages; i++) {
						$scope.pageList.push(i);
					}
				} else {
					alert('数据为空');
					$scope.pageList = [];
				}
			}, function(err) {});
		}
		$scope.getManagerInfoList($scope.currentPageNo);

		//后一页
		$scope.goNext = function(i) {
			if(i == $scope.pages) {
				return;
			} else {
				i++;
				$scope.getManagerInfoList(i);
			}

		}
		//前一页
		$scope.goPre = function(i) {
			if(i == 1) {
				return;
			} else {
				i--;
				$scope.getManagerInfoList(i);
			}
		}
		//指定页
		$scope.goCurrentPage = function(i) {
			$scope.getManagerInfoList(i);
		}

		$scope.operateData = function($index, item) {
			$('tbody tr').removeClass('tr-success');
			$('tbody tr:eq(' + $index + ')').addClass('tr-success');
			$scope.selectData = true;
			$scope.managerInfo = item;
			console.log($scope.managerInfo);
		}

		//获取医院列表
		modelService.getHospitalList().then(function(res) {
			if(res.code == 0) {
				//处理返回数据
				$scope.hospitalList = res.body;

			} else {
				alert('数据为空');
			}
		}, function(err) {
			alert('网络出错，请刷新重试！');
		});

		//根据医院改变科室
		$scope.changeHospital = function(hospitalId) {
			//调用获取科室服务
			modelService.getDepByHospId({
				HospitalId: hospitalId
			}).then(function(res) {
				console.log(res);
				if(res.code == 0) {
					$scope.depList = res.body;
					if($scope.operateState == 'edit') {
						for(var i = 0; i < $scope.depList.length; i++) {
							for(var j = 0; j < $scope.managerInfo.Admdepartmentlist.length; j++) {
								if($scope.managerInfo.Admdepartmentlist[j].DepartmentId == $scope.depList[i].DepartmentId) {
									$scope.depList[i].DepartmentChecked = true;
								}
							}
						}
						
					}
				}

			}, function(err) {});
		}

		//全选
		$scope.selectAll = function() {
			for(var i = 0; i < $scope.depList.length; i++) {
				if($scope.managerInfo.selectAll === true) {
					$scope.depList[i].DepartmentChecked = true;
				} else {
					$scope.depList[i].DepartmentChecked = false;
				}
			}
		}

		//添加管理员
		$scope.addManager = function() {
			$scope.operateState = 'add';
			$scope.depList=[];
			$('tbody tr').removeClass('tr-success');
			$scope.selectData = false;
			$('#modal_showAudit').modal('show');
			$scope.managerInfo = angular.copy($scope.initManagerInfo);
			$scope.managerInfo.Admpermissionlist = [];
			$scope.managerInfo.Admdepartmentlist = [];

		}

		//删除管理员
		$scope.deleteManager = function() {
			if($scope.selectData) {
				modelService.deleteAdmin({
					AdmId: $scope.managerInfo.AdmId
				}).then(function(res) {
					if(res.code == 0) {
						alert('删除成功');
						$scope.getManagerInfoList($scope.currentPageNo);
					} else {
						alert('删除失败');
					}
				}, function(err) {

				});
			} else {
				alert('请选择要删除的管理员');
			}

		}

		//显示编辑框
		$scope.editManager = function() {
			$scope.operateState = 'edit';
			if($scope.selectData) {
				console.log($scope.managerInfo);
				$('#modal_showAudit').modal('show');
				$scope.changeHospital($scope.managerInfo.HospitalId);
				console.log($scope.depList);
			} else {
				alert('请选择要编辑的管理员');
			}

			console.log($scope.managerInfo);
		}
		//更新管理员
		$scope.subManagerInfo = function(item) {
			if($scope.operateState == 'add') {
				//处理不良事件、排版和学分的选择
				if($scope.managerInfo.isblsj) {
					var obj1 = {
						AdmId: $scope.managerInfo.UserId,
						PermissionId: "000000001"
					}
					$scope.managerInfo.Admpermissionlist.push(obj1);
				}
				if($scope.managerInfo.ispb) {
					var obj2 = {
						AdmId: $scope.managerInfo.UserId,
						PermissionId: "000000002"
					}
					$scope.managerInfo.Admpermissionlist.push(obj2);
				}
				if($scope.managerInfo.isxf) {
					var obj3 = {
						AdmId: $scope.managerInfo.UserId,
						PermissionId: "000000003"
					}
					$scope.managerInfo.Admpermissionlist.push(obj3);
				}
				//处理选择的科室
				for(var i = 0; i < $scope.depList.length; i++) {
					if($scope.depList[i].DepartmentChecked) {
						var obj = {
							AdmId: $scope.managerInfo.UserId,
							DepartmentId: $scope.depList[i].DepartmentId
						};
						$scope.managerInfo.Admdepartmentlist.push(obj);
					}
				}
				var data = JSON.stringify({
					model: $scope.managerInfo
				});
				modelService.addAdmin(data).then(function(res) {
					if(res.code == 0) {
						alert('添加成功');
					} else {
						alert('添加失败');
					}
					$('#modal_showAudit').modal('hide');
					$scope.managerInfo = angular.copy($scope.initManagerInfo);
				}, function(err) {
					alert('网络出错，请刷新重试！');
				});
			} else if($scope.operateState == 'edit') {
				if($scope.managerInfo.isblsj) {
					var obj1 = {
						AdmId: $scope.managerInfo.UserId,
						PermissionId: "000000001"
					}
					$scope.managerInfo.Admpermissionlist.push(obj1);
				}
				if($scope.managerInfo.ispb) {
					var obj2 = {
						AdmId: $scope.managerInfo.UserId,
						PermissionId: "000000002"
					}
					$scope.managerInfo.Admpermissionlist.push(obj2);
				}
				if($scope.managerInfo.isxf) {
					var obj3 = {
						AdmId: $scope.managerInfo.UserId,
						PermissionId: "000000003"
					}
					$scope.managerInfo.Admpermissionlist.push(obj3);
				}
				for(var i = 0; i < $scope.depList.length; i++) {
					if($scope.depList[i].DepartmentChecked) {
						var obj = {
							AdmId: $scope.managerInfo.UserId,
							DepartmentId: $scope.depList[i].DepartmentId
						};
						$scope.managerInfo.Admdepartmentlist.push(obj);
					}
				}
				var data = JSON.stringify({
					model: $scope.managerInfo
				});
				modelService.updateAdmin(data).then(function(res) {
					if(res.code == 0) {
						alert('更新成功');
					} else {
						alert('更新失败');
					}
					$('#modal_showAudit').modal('hide');
				}, function(err) {
					alert('网络出错，请刷新重试！');
				});
				$('#modal_showAudit').modal('hide');
			}

			//			$scope.managerInfo = {};
		}
		//关闭编辑框
		$scope.closeModal = function() {
			$('#modal_showAudit').modal('hide');
			$scope.managerInfo = angular.copy($scope.initManagerInfo);
		}

		//刷新页面
		$scope.refresh = function() {
			window.location.reload();
		}

	}]);