const format = {
	dateFormat: (time, pattern) => {
		time = time || new Date()
		time = new Date(time);
		const format = pattern || '{y}-{m}-{d}';
		let date;
		if (typeof time === 'object') {
			date = time;
		} else {
			if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
				time = parseInt(time);
			} else if (typeof time === 'string') {
				time = time.replace(new RegExp(/-/gm), '/');
			}
			if ((typeof time === 'number') && (time.toString().length === 10)) {
				time = time * 1000;
			}
			date = new Date(time);
		}
		const formatObj = {
			y: date.getFullYear(),
			m: date.getMonth() + 1,
			d: date.getDate(),
			h: date.getHours(),
			i: date.getMinutes(),
			s: date.getSeconds(),

		};
		const time_str = format.replace(/{(y|m|d|h|i|s)+}/g, (result, key) => {
			let value = formatObj[key];
			// Note: getDay() returns 0 on Sunday
			if (result.length > 0 && value < 10) {
				value = '0' + value;
			}
			return value || 0;
		});
		return time_str;
	},

	//手机号脱敏
	desensitize(str, start, end) {
		start = start || 3
		end = end || 6
		let headStr = str.slice(0, start);
		let endStr = str.slice(end + 1);
		let dLen = end - start;
		let deStr = '';
		for (let i = 0; i <= dLen; i++) {
			deStr += '*'
		}
		return headStr + deStr + endStr;
	},

	//价格格式化
	priceFormat: (number, places, symbol, thousand, decimal) => {
		number = number || 0;
		places = !isNaN(places = Math.abs(places)) ? places : 2;
		symbol = symbol !== undefined ? symbol : " ";
		thousand = thousand || ",";
		decimal = decimal || ".";
		var negative = number < 0 ? "-" : "",
			a,
			i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
			j = (a = i.length) > 3 ? a % 3 : 0;
		return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
	}
}

export default format;