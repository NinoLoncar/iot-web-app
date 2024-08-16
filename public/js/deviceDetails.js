var map;
var marker;

window.addEventListener("load", async () => {
	let button = document.getElementById("delete-button");
	map = L.map("map").setView([51.505, -0.09], 15);
	L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution:
			'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	}).addTo(map);

	flatpickr("#beforeDate", {
		enableTime: true,
		dateFormat: "H:i:S d.m.Y",
		maxDate: "today",
	});

	flatpickr("#afterDate", {
		enableTime: true,
		dateFormat: "H:i:S d.m.Y",
		maxDate: "today",
	});

	showLocationLoader();
	let data = JSON.parse(await getSensorData());
	hideLocationLoader();
	displayLocationData(data);
	button.addEventListener("click", async () => {
		if (validateData()) {
			hideButton();
			showDeleteLoader();
			let status = await deleteDevice();
			processDeleteStatus(status);
		}
	});
});

async function deleteDevice() {
	let input = document.getElementById("input-android-id");
	let apiKey = input.value;
	let androidId = document.getElementById("android-id").innerHTML;

	let parameters = {
		headers: {
			"Content-Type": "application/json",
			"Api-Key": apiKey,
		},
		method: "DELETE",
	};
	let response = await fetch("/devices/" + androidId, parameters);
	return response.status;
}

function validateData() {
	let input = document.getElementById("input-android-id");
	let apiKey = input.value;
	if (!apiKey || apiKey == "") {
		showMessage("Unesite API ključ");
		return false;
	}
	return true;
}

function processDeleteStatus(status) {
	switch (status) {
		case 200: {
			window.location.href = "/registered-devices/";
			break;
		}
		case 401: {
			showMessage("Pogrešan API ključ");
			hideDeleteLoader();
			showButton();
			break;
		}
		default: {
			showMessage("Dogodila se greška");
			hideDeleteLoader();
			showButton();
		}
	}
}

function hideButton() {
	let button = document.getElementById("delete-button");
	button.style.display = "none";
}
function showButton() {
	let button = document.getElementById("delete-button");
	button.style.display = "unset";
}
function hideDeleteLoader() {
	let loader = document.getElementById("delete-loader");
	loader.style.display = "none";
}
function showDeleteLoader() {
	let loader = document.getElementById("delete-loader");
	loader.style.display = "block";
}
function showLocationLoader() {
	let loader = document.getElementById("location-loader");
	loader.style.display = "block";
}
function hideLocationLoader() {
	let loader = document.getElementById("location-loader");
	loader.style.display = "none";
}

function showMessage(message) {
	let messageDiv = document.getElementById("message");
	messageDiv.style.visibility = "visible";
	messageDiv.innerHTML = message;
}

async function getSensorData() {
	let androidId = document.getElementById("android-id").innerHTML;
	let response = await fetch("/sensor-data?android-id=" + androidId);
	let data = await response.text();
	return data;
}
function displayLocationData(sensorData) {
	let table = document.getElementById("location-table");
	let html = "<thead><tr>";
	html += "<th scope='col'>Datum</th>";
	html += "<th scope='col'>Zempljopisna širina</th>";
	html += "<th scope='col'>Zempljopisna dužina</th>";
	html += "</tr></thead><tbody>";
	for (let data of sensorData) {
		html +=
			"<tr data-lon='" + data.longitude + "' data-lat='" + data.latitude + "'>";
		html += "<td>" + data.time + "</td>";
		html += "<td>" + data.latitude + "</td>";
		html += "<td>" + data.longitude + "</td>";
		html += "</td>";
	}
	html += "</tbody>";
	table.innerHTML = html;
	addClickListenersToRows();
}
function addClickListenersToRows() {
	let rows = document.querySelectorAll("#location-table tbody tr");
	for (let row of rows) {
		let latitude = row.dataset["lat"];
		let longitude = row.dataset["lon"];
		row.addEventListener("click", () => {
			addMarker(latitude, longitude);
		});
	}
}
function addMarker(latitude, longitude) {
	if (marker) map.removeLayer(marker);
	map.setView([latitude, longitude], 15);
	marker = L.marker([latitude, longitude]).addTo(map);
}
