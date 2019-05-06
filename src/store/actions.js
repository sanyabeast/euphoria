import _ from "Helpers";

var actions = {
	nextPage ( store ) {
		let currentPage = store.state.currentPage
		let currentPageRoutes = store.state.routes[ currentPage ]

		store.state.currentPage = currentPageRoutes[1]
	},
	prevPage ( store ) {
		let currentPage = store.state.currentPage
		let currentPageRoutes = store.state.routes[ currentPage ]

		store.state.currentPage = currentPageRoutes[0]
	}
};

export default actions;