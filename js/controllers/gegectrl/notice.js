'use strict';

/* Controllers */

app
	// Flot Chart controller
	.controller('NoticeCtrl', ['$scope', 'commonService', 'modelService', function($scope, commonService, modelService) {
		console.log('公告管理');
		$(document).ready(function() {
			$('#summernote').summernote({
				lang: 'zh-CN', // default: 'en-US'
				height: 100,
				placeholder: '在此编辑你的内容',
				toolbar: [
					// [groupName, [list of button]]
					['style', ['bold', 'italic', 'underline', 'clear']],
					['font', ['strikethrough', 'superscript', 'subscript']],
					['fontsize', ['fontsize']],
					['color', ['color']],
					['para', ['ul', 'ol', 'paragraph']],
					['height', ['height']],
					['insert', ['link', 'picture']]
				]
			});
		});

		$('.form_datetime').datetimepicker({
			minView: "month", //选择日期后，不会再跳转去选择时分秒 
			language: 'zh-CN',
			format: 'yyyy-mm-dd',
			todayBtn: 1,
			autoclose: 1,
		});

		$scope.currentPageNo = 1;
		$scope.pageSize = 16;
		$scope.noticeList = [];
		$scope.noticeDetail = {};
		$scope.pageList = [];
		$scope.initNoticeDetail = {
			DisplayOrder: 0,
			DepartmentId: '',
			HospitalName: '',
			Name: '',
			Contact: '',
			Phone: '',
			OperatorId: ''
		};
		//根据分页获取公告列表
		$scope.getNoticeList = function(page) {
			modelService.getNoticeList({
				pageNumber: page,
				pageSize: $scope.pageSize
			}).then(function(res) {
				console.log(res);
				if(res.code == 0) {
					//处理返回数据
					$scope.noticeList = _.map(commonService.translateServerData(res.body), function(item) {
						item.NoticeTime = commonService.str2date(item.NoticeTime, 'yyyy-MM-dd');
						item.OperatorTime = commonService.str2date(item.OperatorTime, 'yyyy-MM-dd');
						if (item.Type==0) {
							item.acceptArea='平台';
						}else if (item.Type==1) {
							item.acceptArea='全院';
						}else if (item.Type==2) {
							item.acceptArea='科室';
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
		$scope.getNoticeList($scope.currentPageNo);

		//后一页
		$scope.goNext = function(i) {
			if(i == $scope.pages) {
				return;
			} else {
				i++;
				$scope.getNoticeList(i);
			}

		}
		//前一页
		$scope.goPre = function(i) {
			if(i == 1) {
				return;
			} else {
				i--;
				$scope.getNoticeList(i);
			}
		}
		//指定页
		$scope.goCurrentPage = function(i) {
			$scope.getNoticeList(i);
		}

		$scope.operateData = function($index, item) {
			console.log($index);
			$('tbody tr').removeClass('tr-success');
			$('tbody tr:eq(' + $index + ')').addClass('tr-success');
			$scope.selectData = true;
			$scope.noticeDetail = item;
		}

		//添加公告
		$scope.addNotice = function() {
			$scope.operateState = 'add';
			$('tbody tr').removeClass('tr-success');
			$scope.selectData = false;
			$('#modal_showAudit').modal('show');
			$scope.noticeDetail = angular.copy($scope.initNoticeDetail);

		}

		//删除公告
//		$scope.deleteNotice = function() {
//			$('#modal_showAudit').modal('show');
//			$scope.noticeDetail = angular.copy($scope.initNoticeDetail);
//
//		}

		//显示公告
		$scope.editNotice = function() {
			$scope.operateState = 'edit';
			if($scope.selectData) {
				var noticeContent = $scope.noticeDetail.Content;
				$('#summernote').summernote('code', noticeContent);
				$('#modal_showAudit').modal('show');
			} else {
				alert('请选择要编辑的公告');
			}

			console.log($scope.noticeDetail);
		}
		//更新公告信息
		$scope.subNotice = function(item) {
			var content = $('#summernote').summernote('code');
			$scope.noticeDetail.Content=content;
			console.log($scope.noticeDetail);
			var fd = new FormData();
			var file = document.querySelector('#fileToUpload').files[0];
			fd.append('fileToUpload', file);

			if(file == null || file == '' || file == undefined) {

			} else {
				$.ajax({
					url: 'http://zh.buzzlysoft.com/ImgHandler.ashx',
					type: "POST",
					async: false,
					cache: false,
					processData: false,
					contentType: false,
					data: fd,
					success: function(res) {
						$scope.noticeDetail.Attachment = res;
						console.log(res);
					},
					error: function(err) {
						console.log(err);
					}
				});
			}
			if($scope.operateState == 'add') {
				console.log(JSON.stringify({
					model: $scope.noticeDetail
				}));
				modelService.addNoticeList({
					model: $scope.noticeDetail
				}).then(function(result) {
					if(result.code == 0) {
						alert('添加成功');
					} else {
						alert('添加失败');
					}
				}, function(error) {
					console.log(error);
				});

			} else if($scope.operateState == 'edit') {
				modelService.updateNoticeList({
					model: $scope.noticeDetail
				}).then(function(result) {
					if(res.code == 0) {
						alert('添加成功');
					} else {
						alert('添加失败');
					}
				}, function(error) {
					console.log(error);
				});
				
			}
			$('#modal_showAudit').modal('hide');
			$scope.noticeDetail = {};
		}
		//关闭公告框
		$scope.closeModal = function() {
			$('#modal_showAudit').modal('hide');
			$scope.noticeDetail = angular.copy($scope.initSystemNewsDetail);
		}

		//刷新页面
		$scope.refresh = function() {
			window.location.reload();
		}

	}]);