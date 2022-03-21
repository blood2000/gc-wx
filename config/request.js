import store from '@/store'
import apiUrl from '../api/api'
import urlConfig from './urlConfig.js'
const PRO_URL = urlConfig.BASE_URL;
// const baseUrl = process.env.NODE_ENV === 'development' ? "/api" : PRO_URL;
const baseUrl = PRO_URL;
// let token = 'de896e55-d6d3-43ca-bde0-8100e96409aa';
// uni.setStorageSync('token', token)
const defaultHeader = {
  // "Authorization": "ab3b6e7b-5d89-4b47-946a-03cdae6c9ffb",
  "App-Type": "1",
  // "App-Code": "625d02d3efbd4823962651f387cdc3d5",
  "App-Code": "a837654fa9e540eca0502d612ba1b178",
  "App-Version": "1.0.0",
  "Produce-Code": "1c3646219beb4c7b978b4600965b2c9f",
  "Terminal-Type": "WeChat",
};
// console.log(defaultHeader)

//config:url, method, params, data, util
export const uniRequest = function(config) {
	if (!config.noToken) {
		const token = uni.getStorageSync('token');
		if (!token) {
			uni.reLaunch({
				url: config.jumpUrl || '../login/login' //跳转到登录页面
			})
			return;
		}
		defaultHeader['Authorization'] = token;
	}
	
	uni.showLoading();
	
	let util = config.resFun;
	if (!util) {
		util = {
			showError: true, //开启错误提示
		}
	}
	// let defaultHeader = config.header;
	console.log(defaultHeader)
	if (config.contentType) {
		defaultHeader['Content-Type'] = config.contentType;
	} else {
		defaultHeader['Content-Type'] = 'application/json;charset=utf-8';
	}
	let url = '';
	if (config.querys) {
		url = apiUrl[config.url] + '?';
		console.log(apiUrl[config.url])
		for (const key of Object.keys(config.querys)) {
			url += key + '=' + config.querys[key] + '&'
		}
		url = url.slice(0, -1);
	} else if (config.params) {
		url =  apiUrl[config.url];
		for (const key of Object.keys(config.params)) {
			url += '/' + config.params[key];
		}
	} else {
		url = apiUrl[config.url]
	}
	console.log('请求地址', baseUrl + url)
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + url,
			method: config.method || 'GET',
			data: config.data || {},
			header: defaultHeader,
			timeout: 10000,
			success: (res) => {
				uni.hideLoading();
				if (res.data.code === 200) {
					resolve(res)
				} else if (res.data.code === 401) {
					uni.reLaunch({
						url: config.jumpUrl || '../login/login' //跳转到登录页面
					})
				} else {
					// if(util.showError){
					// 	showError(res);
					// }
					uni.showModal({
						title: '提示',
						content: res.data.msg,
						showCancel: false,
					});
					// resolve(res)
				}
			},
			fail: (err) => {
				uni.hideLoading();
				// 失败做处理
				if (util.showError) {
					showError(err);
				}
				reject(err)
				// uni.showModal({
				// 	title: '提示',
				// 	content: err,
				// 	showCancel: false,
				// });
			}
		})
	})

}
// 文件上传
export const uniUpload = function(config) {
	if (!config.noToken) {
		const token = uni.getStorageSync('token');
		if (!token) {
			uni.reLaunch({
				url: config.jumpUrl || '../login/login' //跳转到登录页面
			})
			return;
		}
		defaultHeader['Authorization'] = token;
	}
	

	let util = config.resFun;
	if (!util) {
		util = {
			showError: true, //开启错误提示
		}
	}
	// let defaultHeader = config.header;
	console.log(defaultHeader)
	
	let url = apiUrl[config.url];
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: baseUrl + url,
			header: defaultHeader,
			filePath: config.file,
			name: 'file',
			timeout: 10000,
			success: (res) => {
				// console.log('文件上传', res)
				let resData = JSON.parse(res.data);
				if (resData.code === 200) {
					resolve(resData)
				} else if (resData.code === 401) {
					uni.reLaunch({
						url: config.jumpUrl || '../login/login' //跳转到登录页面
					})
				} else {
					// if(util.showError){
					// 	showError(res);
					// }
					uni.hideLoading();
					uni.showModal({
						title: '提示',
						content: resData.msg,
						showCancel: false,
					});
					// resolve(res)
				}
			},
			fail: (err) => {
				uni.hideLoading();
				// 失败做处理
				if (util.showError) {
					showError(err);
				}
				reject(err)
			}
		})
	})

}
const showError = (error) => {
	console.log(error)
	if (error && error.data && error.data.code) {
		switch (error.data.code) {
			case 401:
				uni.showToast({
					title: '没有权限',
					icon: 'none',
					duration: 1000
				});
				break;

			case 403:
				uni.showToast({
					title: '拒绝访问',
					icon: 'none',
					duration: 1000
				});
				break;

			case 404:
				uni.showToast({
					title: '很抱歉，资源未找到!',
					icon: 'none',
					duration: 1000
				});
				break;

			case 500:
				uni.showToast({
					title: '没有权限',
					icon: 'none',
					duration: 1000
				});
				break;

			case 502:
				uni.showToast({
					title: '服务器异常',
					icon: 'none',
					duration: 1000
				});
				break;

			case 504:
				uni.showToast({
					title: '网络超时',
					icon: 'none',
					duration: 1000
				});
				break;

			default:
				uni.showToast({
					title: "网络错误",
					icon: 'none',
					duration: 1000
				});
				break
		}
	}
}



// export default {uniRequest, uniUpload};
