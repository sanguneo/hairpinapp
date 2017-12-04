export const pad= function(num, size = 2) {
	let s = '0000' + num;
	return s.substr(s.length - size);
}
export const readablized= function(number) {
	if(number < 1000) return number;
	const s = ['', 'k', 'm', 'g'];
	let e = Math.floor(Math.log(number) / Math.log(1000));
	return (number / Math.pow(1000,e)).toFixed(1) + " " + s[e];
}

export default {
	pad,
	readablized
};
