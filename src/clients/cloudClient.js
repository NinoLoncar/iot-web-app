const baseUrl =
	"https://eu-central-1.aws.data.mongodb-api.com/app/application-0-cpcnkro/endpoint";

class CloudClient {
	getDevices = async function () {
		let response = await fetch(baseUrl + "/devices");
		if (response.status == 200) {
			let devices = await response.text();
			return JSON.parse(devices);
		} else {
			return null;
		}
	};

	postDevices = async function (device, apiKey) {
		let parameters = {
			headers: {
				"Content-Type": "application/json",
				"Api-Key": apiKey,
			},
			method: "POST",
			body: JSON.stringify(device),
		};
		let response = await fetch(baseUrl + "/devices", parameters);
		return response.status;
	};

	getDevice = async function (androidId) {
		let response = await fetch(baseUrl + "/device?android-id=" + androidId);
		if (response.status == 200) {
			let device = await response.text();
			return JSON.parse(device);
		}
		return null;
	};

	getSensorData = async function (androidId) {
		let url = baseUrl + "/sensordata";
		if (androidId) url += "?android-id=" + androidId;

		let response = await fetch(url);

		if (response.status == 200) {
			let data = await response.text();
			return JSON.parse(data);
		}
		return null;
	};
}
module.exports = CloudClient;
