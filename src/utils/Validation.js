export const emailcheck= function(email){
	let regex=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
	return (typeof(email) !== 'undefined' && email !== '' && regex.test(email));
}
export default {
	emailcheck
}