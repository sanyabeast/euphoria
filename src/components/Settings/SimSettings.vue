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

	    <v-subheader>Настройки гравитации</v-subheader>

	    <v-list-tile @click="$emit(`gyroGravityEnabled`, gyroGravityEnabled)">
	      <v-list-tile-action>
	        <v-checkbox v-model="gyroGravityEnabled"></v-checkbox>
	      </v-list-tile-action>

	      <v-list-tile-content @click="gyroGravityEnabled = !gyroGravityEnabled">
	        <v-list-tile-title>Гирометр (Android)</v-list-tile-title>
	        <v-list-tile-sub-title>Управлять гравитацией гирометром</v-list-tile-sub-title>
	      </v-list-tile-content>
	    </v-list-tile>

	    <v-card flat color="transparent">
	    	<v-subheader>Сила гравитации по оси X</v-subheader>
  
		    <v-card-text class="pt-0">
		      	<v-slider
	            	v-model="gravityX"
	            	thumb-label
	            	min="-1"
	            	step="0.1"
	            	max="1"
	            	@change=" gyroGravityEnabled = false; $emit(`gravityX`, $event)"
		        ></v-slider>
		    </v-card-text>
    		
    	</v-card>

    	<v-card flat color="transparent">
	    	<v-subheader>Сила гравитации по оси Y</v-subheader>
  
		    <v-card-text class="pt-0">
		      	<v-slider
	            	v-model="gravityY"
	            	thumb-label
	            	min="-1"
	            	step="0.1"
	            	max="1"
	            	@change=" gyroGravityEnabled = false; $emit(`gravityY`, $event)"
		        ></v-slider>
		    </v-card-text>
    		
    	</v-card>

	    <v-subheader>Параметры объектов</v-subheader>

	    <v-card flat color="transparent">
	    	<v-subheader>Трение объектов</v-subheader>
  
		    <v-card-text class="pt-0">
		      	<v-slider
	            	v-model="matterObjectsFriction"
	            	thumb-label
	            	min="0.1"
	            	step="0.1"
	            	max="5"
	            	@change="$emit(`matterObjectsFriction`, $event)"
		        ></v-slider>
		    </v-card-text>
    		
    	</v-card>

    	<v-card flat color="transparent">
	    	<v-subheader>Упругость объектов</v-subheader>
  
		    <v-card-text class="pt-0">
		      	<v-slider
	            	v-model="matterObjectsRestitution"
	            	thumb-label
	            	min="0.05"
	            	step="0.05"
	            	max="0.95"
	            	@change="$emit(`matterObjectsRestitution`, $event)"
		        ></v-slider>
		    </v-card-text>
    		
    	</v-card>


	  </v-list>
	
</template>

<script type="text/javascript">
	
	export default {
		data () {
			return {
				physicEnabled: true,
				matterObjectsFriction: 0.1,
				matterObjectsRestitution: 0.05,
				gyroGravityEnabled: true,
				gravityX: 0,
				gravityY: 0
			}
		}
	}
</script>