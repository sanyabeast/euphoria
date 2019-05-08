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
	},
	native ( store, params ) {
		if ( "native" in window ) {
			try {
				window.native[ params.method ]( ...params.args )
			} catch ( err ) {} 
		}
	} 
};

export default actions;