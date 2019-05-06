import Vue from 'vue';
import Vuex from 'vuex';
import _ from "Helpers";

import state from "Store/state";
import getters from "Store/getters";
import mutations from "Store/mutations";
import modules from "Store/modules";
import actions from "Store/actions";

Vue.use(Vuex);

class StoreCreator {
	constructor(params){
		
		this.store = new Vuex.Store({
		  	state : {...state, ...params},
		  	actions,
		  	mutations,
		  	getters,
		  	modules
		});

		return this.store;
	}
}


export default StoreCreator; 