<template>

	  <v-list
	    subheader
	    two-line
	  >
	    <v-subheader>Настройки эффектов освещения</v-subheader>

	    <v-subheader>Настройки бамаппинга</v-subheader>

	    <v-list-tile @click="$emit(`bumpmapping`, bumpmapping)">
	      <v-list-tile-action>
	        <v-checkbox v-model="bumpmapping"></v-checkbox>
	      </v-list-tile-action>

	      <v-list-tile-content @click="bumpmapping = !bumpmapping">
	        <v-list-tile-title>Бампмаппинг</v-list-tile-title>
	        <v-list-tile-sub-title>Включает или отключает бампмаппинг</v-list-tile-sub-title>
	      </v-list-tile-content>
	    </v-list-tile>

	    <v-card flat color="transparent">
	    	<v-subheader>Уровень бампмаппинга</v-subheader>
  
		    <v-card-text class="pt-0">
		      	<v-slider
	            	v-model="bumpmappingLevel"
	            	thumb-label="always"
	            	min="1"
	            	max="100"
	            	@change="$emit(`bumpmappingLevel`, $event)"
		        ></v-slider>
		    </v-card-text>
    		
    	</v-card>

    	<v-subheader>Источники света</v-subheader>

	    <v-card flat color="transparent">
	    	<v-subheader>Высота источника света</v-subheader>
  
		    <v-card-text class="pt-0">
		      <v-slider
	          	v-model="lightDistance"
	          	thumb-label="always"
	          	min="1"
	          	max="2000"
	          	@change="$event.preventDefault(); $emit(`lightDistance`, $event)"
		      ></v-slider>
		    </v-card-text>
    		
    	</v-card>

    	<v-list-tile @click="$emit(`bumpmapping`, bumpmapping)">
	      	<swatches
		      	v-model="color"
	
		      	:colors="colors"
	
		      	row-length="6"
		      	shapes="circles"
		      	show-border
		      	popover-to="left"
		    ></swatches>
	    </v-list-tile>
	 </v-list>
	
</template>

<script type="text/javascript">
	
	import Swatches from 'vue-swatches'

	export default {
		data () {
			return {
				bumpmapping: true,
				bumpmappingLevel: 10,
				lightDistance: 300,
				color: '#F64272',
      			colors: ['#F64272', '#F6648B', '#F493A7', '#F891A6', '#FFCCD5', '']
			}
		},
		components: { Swatches }
	}
</script>