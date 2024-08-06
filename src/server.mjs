import express from "express";
import dotenv from "dotenv/config";
import PageController from "./controllers/pageController.js";
import DeviceApiController from "./controllers/deviceApiController.js";

const server = express();
const port = process.env.PORT || 3000;
const pageController = new PageController();
const deviceApiController = new DeviceApiController();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/css", express.static("./public/css"));
server.use("/js", express.static("./public/js"));
server.use("/images", express.static("./public/images"));

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.get("/", (req, res) => {
	res.redirect("/registered-devices");
});

server.get(
	"/registered-devices",
	pageController.getDevicesPage.bind(pageController)
);

server.get("/new-device", pageController.getNewDevicePage.bind(pageController));

server.get("/devices", deviceApiController.getDevices);
server.post("/devices", deviceApiController.postDevices);

server.listen(port, async () => {
	console.log(`Server pokrenut na portu: ${port}`);
});
