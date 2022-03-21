const formFilter = {
	numberFilter: (val) => {
		if (val === '') {
			return ''
		}
		val = Math.abs(val)
		return parseInt(val)
	},

	priceFilter: (value) => {
		let result
		var decimalReg = /^\d{0,8}\.{0,1}(\d{1,2})?$/; //var decimalReg=/^[-\+]?\d{0,8}\.{0,1}(\d{1,2})?$/;
		result = (decimalReg.test(value));
		return result;
	},
}

export default formFilter;