'use strict';
 angular.module('$localStorage', []).service('$localStorage', function () {  
        var localStorage = window.localStorage;
		return {
			get: function(key) {
				return localStorage.getItem(key);
			},
			set: function(key, value) {
				localStorage.setItem(key, value);
			},
			remove: function(key) {
				localStorage.removeItem(key);
			},
			clear: function() {
				localStorage.clear();
			}
		} 
    });  
