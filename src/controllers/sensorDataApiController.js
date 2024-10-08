const CloudClient = require("../clients/cloudClient");

const cloudClient = new CloudClient();

class DeviceApiController {
	getSensorData = async function (req, res) {
		res.type("application/json");
		let androidId = req.query["android-id"];
		let afterDate = req.query["after-date"];
		let beforeDate = req.query["before-date"];
		let data;
		try {
			data = await cloudClient.getSensorData(androidId, afterDate, beforeDate);
		} catch {
			res.status(500);
			res.send({ message: "Error" });
			return;
		}
		res.status(200);
		res.send(data);
	};
}
module.exports = DeviceApiController;
