const baseUrl =
	"https://eu-central-1.aws.data.mongodb-api.com/app/application-0-cpcnkro/endpoint";

class CloudClient {
	getDevices = async function () {
		let resposne = await fetch(baseUrl + "/devices");
		if (resposne.status == 200) {
			let devices = await resposne.text();
			console.log(devices);
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
		let resposne = await fetch(baseUrl + "/devices", parameters);
		return resposne.status;
	};
}
module.exports = CloudClient;
