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
		if (device == null || JSON.stringify(device) == "{}") {
			html = await loadHtml("deviceNotRegistered");
		} else {
			html = await loadHtml("deviceDetails");
			html = html.replace("#androidId#", device.androidId);
			html = html.replace("#registrationDate#", device.registrationDate);
			console.log(device);
			if (device.model) {
				html = html.replace("#model#", device.model);
			} else {
				html = html.replace("#model#", "-");
			}
		}
		res.send(html);
	};
}

function loadHtml(name) {
	return ds.readFile(path + "/../../public/html/" + name + ".html", "UTF-8");
}

module.exports = PageController;
