<template>

	  <v-list
	    subheader
	    two-line
	  >
	    <v-subheader>Настройки физической симуляции</v-subheader>

	    <v-list-tile @click="$emit(`physicEnabled`, physicEnabled)">
	      <v-list-tile-action>
	        <v-checkbox v-model="physicEnabled"></v-checkbox>
	      </v-list-tile-action>

	      <v-list-tile-content @click="physicEnabled = !physicEnabled">
	        <v-list-tile-title>Активно</v-list-tile-title>
	        <v-list-tile-sub-title>Включить отключить физику</v-list-tile-sub-title>
	      </v-list-tile-content>
	    </v-list-tile>
	  </v-list>
	
</template>

<script type="text/javascript">
	
	export default {
		data () {
			return {
				physicEnabled: true
			}
		}
	}
</script>