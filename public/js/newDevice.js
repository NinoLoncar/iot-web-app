window.addEventListener("load", async () => {
	let button = document.getElementById("button-add-device");
	button.addEventListener("click", async () => {
		await sendData();
	});
});

async function sendData() {
	if (validateData() == false) return;

	let device = createDeviceJson();
	let apiKey = getApiKey();
	let parameters = {
		headers: {
			"Content-Type": "application/json",
			"Api-Key": apiKey,
		},
		method: "POST",
		body: JSON.stringify(device),
	};
	let response = await fetch("/devices", parameters);
	let body = JSON.parse(await response.text());
	processResponse(response.status, body);
}

function validateData() {
	let inputApiKey = document.getElementById("input-api-key");
	let inputAndroidId = document.getElementById("input-android-id");

	if (inputApiKey.value == "") {
		displayErrorMessage("Unesite API ključ");
		return false;
	} else if (inputAndroidId.value == "") {
		displayErrorMessage("Unesite Android ID");
		return false;
	}
	return true;
}

function createDeviceJson() {
	let inputAndroidId = document.getElementById("input-android-id");
	let inputModel = document.getElementById("input-model");

	let device = { androidId: inputAndroidId.value };
	if (inputModel.value) {
		device.model = inputModel.value;
	}
	return device;
}
function getApiKey() {
	let inputApiKey = document.getElementById("input-api-key");
	return inputApiKey.value;
}

function processResponse(status, body) {
	switch (status) {
		case 200: {
			displayMessage("Uređaj uspješno registriran");
			displayAuthenticationKey(body.authenticationKey);
			clearInputs();
			break;
		}
		case 400: {
			displayErrorMessage("Uređaj s unesenim ID-om već postoji");
			break;
		}
		case 401: {
			displayErrorMessage("Neispravan API ključ");
			break;
		}
		case 500: {
			displayErrorMessage("Dogodila se greška");
			break;
		}
	}
}

function displayErrorMessage(message) {
	let formMessage = document.getElementById("form-message");
	formMessage.style.color = "red";
	formMessage.innerHTML = message;
}
function displayMessage(message) {
	let formMessage = document.getElementById("form-message");
	formMessage.style.color = "black";
	formMessage.innerHTML = message;
}

function displayAuthenticationKey(authKey) {
	let message =
		"Ovo je autentifikacijski ključ za vaš mobilni uređaj:\n" +
		authKey +
		"\nSpremite ga u vaš mobilni uređaj preko aplikacije." +
		"Nakon što zatvorite ovaj dijalog, autentifikacijski ključ više nećete moći vidjeti.";
	alert(message);
}

function clearInputs() {
	let inputAndroidId = document.getElementById("input-android-id");
	let inputModel = document.getElementById("input-model");
	inputAndroidId.value = "";
	inputModel.value = "";
}
