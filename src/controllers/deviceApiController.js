const CloudClient = require("../clients/cloudClient");
const keyGenerator = require("../utils/authKeyGenerator");
const cloudClient = new CloudClient();

class DeviceApiController {
	getDevices = async function (req, res) {
		res.type("application/json");
		let data;

		try {
			data = await cloudClient.getDevices();
		} catch {
			res.status(500);
			res.send({ message: "Error" });
			return;
		}

		if (data != null) {
			res.status(200);
			res.send(data);
		} else {
			res.status(500);
			res.send({ message: "Error" });
		}
	};

	postDevices = async function (req, res) {
		res.type("application/json");

		let device = req.body;
		if (!device.androidId) {
			res.status(400);
			res.send({ message: "Missing android id" });
			return;
		}

		let apiKey = req.headers["api-key"];
		if (!apiKey) {
			res.status(400);
			res.send({ message: "Missing api key" });
			return;
		}
		let dateFormat = await import("../utils/dateUtils.mjs");
		device.registrationDate = dateFormat.getCurrentDateString();
		let authKey = keyGenerator.generateAuthKey();
		device.authenticationKey = authKey;
		let status;
		try {
			status = await cloudClient.postDevices(device, apiKey);
		} catch {
			status = 500;
		}

		switch (status) {
			case 400: {
				res.status(400);
				res.send({ message: "Device with given id already exists" });
				break;
			}
			case 401: {
				res.status(401);
				res.send({ message: "Invalid api key" });
				break;
			}
			case 200: {
				res.status(200);
				res.send({ message: "Device was addes", authenticationKey: authKey });
				break;
			}
			default: {
				res.status(500);
				res.send({ message: "Error" });
				break;
			}
		}
	};
}
module.exports = DeviceApiController;
