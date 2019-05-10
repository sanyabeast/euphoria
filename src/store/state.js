import translations from "store/state/translations"
import Device from "device.js/dist/device"
import Bowser from "bowser"

const browser = Bowser.getParser(window.navigator.userAgent);
const device = new Device()


var state = {
	isHybridApp: typeof window.native == "object",
	$root: null,
	paused: false,
	browserName: browser.getBrowserName().toLowerCase(),
	mobileDevice: !device.desktop,
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