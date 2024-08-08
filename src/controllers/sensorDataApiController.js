const CloudClient = require("../clients/cloudClient");

const cloudClient = new CloudClient();

class DeviceApiController {
	getSensorData = async function (req, res) {
		res.type("application/json");
		let androidId = req.query["android-id"];
		console.log(androidId);
		let data = await cloudClient.getSensorData(androidId);
		res.status(200);
		res.send(data);
	};
}
module.exports = DeviceApiController;
