import dateFormat from "dateformat";

function getCurrentDateString() {
	let date = new Date();
	return dateFormat(date, "HH:MM dd.mm.yyyy");
}
export { getCurrentDateString };
