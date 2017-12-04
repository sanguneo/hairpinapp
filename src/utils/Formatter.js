import {pad} from './Num';

export const formatter = function(date, format = 'Y-M-D h:i') {
	if (date.getTimezoneOffset() === 0) {
		date.setHours(date.getHours() + 9);
	}
	return format
		.replace('Y', pad(date.getFullYear(), 4))
		.replace('M', pad(date.getMonth() + 1))
		.replace('D', pad(date.getDate()))
		.replace('h', pad(date.getHours()))
		.replace('i', pad(date.getMinutes()))
		.replace('s', pad(date.getSeconds()));
}
export const dateFormatter= function(timestamp, format = 'Y-M-D h:i') {
	let date = new Date(parseInt(timestamp));
	return this.formatter(date, format);
}
export const isoFormatter= function(isodate, format = 'Y-M-D h:i') {
	let date = new Date(isodate);
	return this.formatter(date, format);
}

export default {
	formatter,
	dateFormatter,
	isoFormatter
}
