const baseUrl =
	"https://eu-central-1.aws.data.mongodb-api.com/app/application-0-cpcnkro/endpoint";

class CloudClient {
	getDevices = async function () {
		let resposne = await fetch(baseUrl + "/devices");
		if (resposne.status == 200) {
			let devices = await resposne.text();
			return JSON.parse(devices);
		} else {
			return null;
		}
	};
}
module.exports = CloudClient;
