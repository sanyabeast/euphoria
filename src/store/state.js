import translations from "store/state/translations"
import Device from "device.js/dist/device"
import bowser from "bowser/src/bowser"

const device = new Device()

console.log(device, bowser)

var state = {
	$root: null,
	paused: false,
	/*l18n*/
	language : "ukr",
	routes: {
		"main": [ "contacts", "projects" ],
		"projects": [ "main", "contacts" ],
		"contacts": [ "projects", "main" ]
	},
	currentPage: "main",
	translations: translations
};

export default state;