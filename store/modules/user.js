const store = {
	state: {
		headerInfo: {
			a: 123
		},
		statusBarHeight: 0
	},
	getters: {
		headerInfo: state => state.headerInfo
	},
	mutations: {
		getLoginInfo: (state, val) => {
			state.headerInfo = {
				...val
			};
		},
		
		getStatusBarHeight: (state, val) => {
			state.statusBarHeight = val || 0;
		}
	},
	actions: {
		getLoginInfoAction: ({
			commit
		}, val) => {
			commit('getLoginInfo', val)
		},
		
		getStatusBarHeightAction: ({
			commit
		}, val) => {
			commit('getStatusBarHeight', val)
		}
	}
}
export default store