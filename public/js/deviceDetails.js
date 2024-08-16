var map;
var marker;

window.addEventListener("load", async () => {
	initializeUiElements();
	loadData();
	addButtonClickListeners();
});

function initializeUiElements() {
	map = L.map("map").setView([46.308034203743695, 16.337867259412704], 15);
	L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution:
			'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	}).addTo(map);

	flatpickr("#before-date", {
		enableTime: true,
		dateFormat: "H:i:S d.m.Y",
		maxDate: "today",
		enableSeconds: true,
		time_24hr: true,
	});

	flatpickr("#after-date", {
		enableTime: true,
		dateFormat: "H:i:S d.m.Y",
		maxDate: "today",
		enableSeconds: true,
		time_24hr: true,
	});
}

async function loadData(afterDate, beforeDate) {
	clearTables();
	showDataLoaders();
	let data = JSON.parse(await getSensorData(afterDate, beforeDate));
	hideDataLoaders();
	displayLocationData(data);
	displaySensorDataTable(data);
}

function addButtonClickListeners() {
	let deleteButton = document.getElementById("delete-button");
	deleteButton.addEventListener("click", async () => {
		if (validateData()) {
			hideDeleteButton();
			showDeleteLoader();
			let status = await deleteDevice();
			processDeleteStatus(status);
		}
	});

	let filterButton = document.getElementById("filter-button");
	filterButton.addEventListener("click", async () => {
		showRemoveFilterButton();
		filterData();
	});

	let removeFilterButton = document.getElementById("remove-filter-button");
	removeFilterButton.addEventListener("click", async () => {
		loadData();
		hideRemoveFilterButton();
	});
}

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
			showDeleteButton();
			break;
		}
		default: {
			showMessage("Dogodila se greška");
			hideDeleteLoader();
			showDeleteButton();
		}
	}
}

async function filterData() {
	let afterDate = document.getElementById("after-date").value;
	let beforeDate = document.getElementById("before-date").value;
	let data = await loadData(afterDate, beforeDate);
}

function hideDeleteButton() {
	let button = document.getElementById("delete-button");
	button.style.display = "none";
}
function showDeleteButton() {
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

function showRemoveFilterButton() {
	let button = document.getElementById("remove-filter-button");
	button.style.visibility = "visible";
}
function hideRemoveFilterButton() {
	let button = document.getElementById("remove-filter-button");
	button.style.visibility = "hidden";
}
function showDataLoaders() {
	let locationLoader = document.getElementById("location-loader");
	locationLoader.style.display = "block";
	let sensorDataLoader = document.getElementById("sensor-data-loader");
	sensorDataLoader.style.display = "block";
}
function hideDataLoaders() {
	let locationLoader = document.getElementById("location-loader");
	locationLoader.style.display = "none";
	let sensorDataLoader = document.getElementById("sensor-data-loader");
	sensorDataLoader.style.display = "none";
}

function showMessage(message) {
	let messageDiv = document.getElementById("message");
	messageDiv.style.visibility = "visible";
	messageDiv.innerHTML = message;
}

async function getSensorData(afterDate, beforeDate) {
	let androidId = document.getElementById("android-id").innerHTML;
	let url = "/sensor-data?android-id=" + androidId;
	if (afterDate) url += "&after-date=" + afterDate;
	if (beforeDate) url += "&before-date=" + beforeDate;
	let response = await fetch(url);
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
		html += "</tr>";
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

function displaySensorDataTable(sensorData) {
	let table = document.getElementById("sensor-data-table");
	let html = "<thead><tr>";
	html += "<th scope='col'>Datum</th>";
	html += "<th scope='col'>Broj koraka</th>";
	html += "<th scope='col'>X akceleracija</th>";
	html += "<th scope='col'>Y akceleracija</th>";
	html += "<th scope='col'>Z akceleracija</th>";
	html += "</tr></thead><tbody>";
	for (let data of sensorData) {
		html += "<tr>";
		html += "<td>" + data.time + "</td>";
		html += "<td>" + data.stepCount + "</td>";
		html += "<td>" + data.accelerationX + "</td>";
		html += "<td>" + data.accelerationY + "</td>";
		html += "<td>" + data.accelerationZ + "</td>";
		html += "</tr>";
	}
	html += "</tbody>";
	table.innerHTML = html;
}
function clearTables() {
	let sensorDataTable = document.getElementById("sensor-data-table");
	sensorDataTable.innerHTML = "";
	let tablocationTablele = document.getElementById("location-table");
	tablocationTablele.innerHTML = "";
}

function addMarker(latitude, longitude) {
	if (marker) map.removeLayer(marker);
	map.setView([latitude, longitude], 15);
	marker = L.marker([latitude, longitude]).addTo(map);
}
