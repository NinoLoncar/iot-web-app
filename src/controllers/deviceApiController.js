const CloudClient = require("../clients/cloudClient");

const cloudClient = new CloudClient();

class DeviceApiController {
	getDevices = async function (req, res) {
		let data = await cloudClient.getDevices();
		if (data != null) {
			res.status(200);
			res.send(data);
		} else {
			res.status(503);
			res.send({ message: "Usluga nije dostupna" });
		}
	};
}
module.exports = DeviceApiController;
