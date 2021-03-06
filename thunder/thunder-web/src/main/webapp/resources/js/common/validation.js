function validator(options) {
			this.rules = {
				double : {
					validate : function(value) {
						return /^-?\d+\.?\d{0,2}$/.test(value) && value >= 0.01;
					},
					errorMsg : '价格只能由数字组成且最多带有2位小数并且大于0.01',// 错误提示信息
					defaultValue : '0.01'// 默认值
				},
				required : {
					validate : function(value) {
						return value.trim().length > 0;
					},
					errorMsg : '这个字段是必须要填写的',// 错误提示信息
					defaultValue : '123'// 默认值
				},
				email : {
					/**
					 * 表单类型为email的验证方法
					 */
					validate : function(value) {
						return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
								.test(value);
					},
					errorMsg : '请输入正确的邮箱地址',// 错误提示信息
					defaultValue : 'kerbores@gmail.com'// 默认值
				},
				userName : {
					validate : function(value) {
						return /^[\d\w_]{3,12}$/.test(value);
					},
					defaultValue : 'dgj',
					errorMsg : '用户名输入不正确'
				},
				password : {
					validate : function(value) {
						return /^[a-z0-9]{6,}$/.test(value);
					},
					defaultValue : '111111',
					errorMsg : '密码输入不正确'
				},
				phone : {
					validate : function(value) {
						return /^(13[0-9]|15[0|3|6|7|8|9]|18[0-9])\d{8}$/
								.test(value);
					},
					defaultValue : '13888888888',
					errorMsg : '电话号码不符合规范'
				},
				number : {
					validate : function(value) {
						return /^[\d]+$/.test(value);
					},
					defaultValue : '0',
					errorMsg : '只能输入数字'
				},
				integer : {
					validate : function(value) {
						return /^[\d]+$/.test(value) && value >= 0;
					},
					defaultValue : '0',
					errorMsg : '只能输入正数'
				},
				chinese : {
					validate : function(value) {
						return /^[\u4e00-\u9fa5]*$/.test(value);
					},
					defaultValue : '中文',
					errorMsg : '只能输入中文汉字'
				},
				url : {
					validate : function(value) {
						return /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/
								.test(value);
					},
					defaultValue : 'http://www.kerbores.com',
					errorMsg : '请输入正确的url地址'
				},
				cardId : {
					validate : function(value) {
						return /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/
								.test(value);
					},
					defaultValue : '123456789000000000',
					errorMsg : '请输入正确的身份证号'
				}
			},
			/**
			 * 验证结束时的回调
			 * 
			 * @param status
			 *            验证状态
			 * @param dom
			 *            被验证的表单
			 * @param errorMsg
			 *            错误信息
			 * @param defaultValue
			 *            默认值
			 */
			this.validationcallBack = function(status, dom, errorMsg,
					defaultValue) {
				status ? $.noop() : function() {
					validationFail(errorMsg, dom);
				}.call();
			},
			this.allowedElement = [ 'input', 'INPUT', 'select', 'SELECT' ],
			this.isAllowed = function(input) {
				var tag = $(input)[0].tagName;
				$(this.allowedElement).each(function(i, item) {
					if (tag === item) {
						return true;
					}
				});
				return false;
			},
			/**
			 * 验证表单方法
			 */
			this.validationForm = function(input, callback) {
				callback = callback ? callback : this.validationcallBack;// 检查是否传入了回调,没有传入的话就按照默认的进行处理
				if (!this.isAllowed(input)) {
					console
							.log('u r kid me,  u r sure to validation a dom element without value');
				}
				var value = $(input).val();// 值
				var type = $(input).data("type");// 类型
				if (!type) {
					return true;
				}
				var defultValue = $(input).data("default") ? $(input).data(
						"default") : this.rules[type].defaultValue;// 默认值
				var errorMsg = $(input).data("error") ? $(input).data("error")
						: this.rules[type].errorMsg;// 错误信息
				var reg_ = type == "reg" ? eval($(input).data("reg")) : /^$/;// 正则
				var check_result = type != "reg" ? this.rules[type]
						.validate(value) : reg_.test(value);
				// 提供回调处理验证结果的提示方式 详见demo
				callback(check_result, input, errorMsg, defultValue);
				return check_result;
			},
			/**
			 * 添加规则
			 */
			this.addRule = function(name, value) {
				this.rules[name] = value;
			}
}
// 扩展成插件,此函数返回的失败则是整个form中的表单项的验证结果,只要有一项未通过,那么就是未通过
$.fn.validation = function() {
	var v1 = arguments[0];
	var v2 = arguments[1];
	var callback = $.isFunction(v1) ? v1 : undefined;
	var options = $.isFunction(v1) ? v2 : v1;
	var va = new validator(options);
	for ( var rule in options) {
		va.addRule(rule, options[rule]);
	}
	var waiteToVal = $(this).find('input,select').andSelf();
	if (!waiteToVal.length) {
		console ? console
				.warn("Nothing selected, can't validate, returning nothing.")
				: $.noop();
		return true;
	}
	// 修改为遇到错误即刻跳出循环
	var flag = true;
	$(waiteToVal).each(function(i, item) {
		if (flag) {
			flag = va.validationForm(item, callback);
		}
		if (!flag) {
			return flag;
		}
	})
	return flag;
}