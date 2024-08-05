window.addEventListener("load", async () => {
	let devices = await getDevices();
	displayDevicesTable(devices);
});

async function getDevices() {
	let devices = await (await fetch("/devices")).text();
	return JSON.parse(devices);
}

function displayDevicesTable(devices) {
	let table = document.getElementById("registered-devices-table");

	let html = "<table><thead><tr>";
	html += "<th scope='col'> Android id</th>";
	html += "<th scope='col'> Model</th>";
	html += "<th scope='col'> Datum registracije</th>";
	html += "<tbody>";

	for (let device of devices) {
		html += "<tr data-androidid='" + device.androidId + "'>";
		html += "<td>" + device.androidId + "</td>";
		html += "<td>" + device.model + "</td>";
		html += "<td>" + device.registrationDate + "</td>";
		html += "</tr>";
	}
	html += "</tbody></table>";

	table.innerHTML = html;
	addClickListenersToRows();
}

function addClickListenersToRows() {
	let rows = document.querySelectorAll("#registered-devices-table tbody tr");

	for (let row of rows) {
		let androidId = row.dataset["androidid"];
		console.log(androidId);
		row.addEventListener("click", () => {
			window.location.href = "/registeredDevices/" + androidId;
		});
	}
}
