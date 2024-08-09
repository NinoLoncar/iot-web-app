window.addEventListener("load", async () => {
	let button = document.getElementById("delete-button");

	button.addEventListener("click", async () => {
		if (validateData()) {
			hideButton();
			showLoader();
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
			hideLoader();
			showButton();
			break;
		}
		default: {
			showMessage("Dogodila se greška");
			hideLoader();
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
function hideLoader() {
	let loader = document.getElementById("delete-loader");
	loader.style.display = "none";
}
function showLoader() {
	let loader = document.getElementById("delete-loader");
	loader.style.display = "block";
}

function showMessage(message) {
	let messageDiv = document.getElementById("message");
	messageDiv.style.visibility = "visible";
	messageDiv.innerHTML = message;
}
