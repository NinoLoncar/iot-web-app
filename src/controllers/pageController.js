const path = __dirname;
const ds = require("fs/promises");

class PageController {
	getDevicesPage = async function (req, res) {
		let html = await loadHtml("devices");
		res.send(html);
	};
}

function loadHtml(name) {
	return ds.readFile(path + "/../../public/html/" + name + ".html", "UTF-8");
}

module.exports = PageController;
