window.addEventListener("load", async () => {
	addClickEventListenersForSidebar();
});

function addClickEventListenersForSidebar() {
	let registeredDevicesOption = document.getElementById(
		"registered-devices-sidebar-option"
	);
	registeredDevicesOption.addEventListener("click", () => {
		window.location.href = "/registered-devices/";
	});

	let newDeviceOption = document.getElementById("new-device-sidebar-option");
	newDeviceOption.addEventListener("click", () => {
		window.location.href = "/new-device/";
	});
}
