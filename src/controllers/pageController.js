const path = __dirname;
const ds = require("fs/promises");
const CloudClient = require("../clients/cloudClient");

const cloudClient = new CloudClient();

class PageController {
	getDevicesPage = async function (req, res) {
		let html = await loadHtml("registeredDevices");
		res.send(html);
	};

	getNewDevicePage = async function (req, res) {
		let html = await loadHtml("newDevice");
		res.send(html);
	};

	getDeviceDetailsPage = async function (req, res) {
		let device = await cloudClient.getDevice(req.params.androidId);
		let html;
		console.log(device);
		if (device == null || JSON.stringify(device) == "{}") {
			html = await loadHtml("deviceNotRegistered");
		} else {
			html = await loadHtml("deviceDetails");
		}
		res.send(html);
	};
}

function loadHtml(name) {
	return ds.readFile(path + "/../../public/html/" + name + ".html", "UTF-8");
}

module.exports = PageController;
