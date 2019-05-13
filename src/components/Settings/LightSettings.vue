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
	    	<v-subheader>Высота источников света</v-subheader>
  
		    <v-card-text class="pt-0">
		      <v-slider
	          	v-model="lightDistance"
	          	thumb-label="always"
	          	min="1"
	          	max="2000"
	          	@change="$emit(`lightDistance`, $event)"
		      ></v-slider>
		    </v-card-text>
    		
    	</v-card>

    	<v-card flat color="transparent">
	    	<v-subheader>Интенсивность источников света</v-subheader>
  
		    <v-card-text class="pt-0">
		      <v-slider
	          	v-model="lightIntensity"
	          	thumb-label="always"
	          	min="0"
	          	step="0.1"
	          	max="3"
	          	@change="$emit(`lightIntensity`, $event)"
		      ></v-slider>
		    </v-card-text>
    		
    	</v-card>

    	<v-list-tile>
    		<v-list-tile-action>
		        <swatches
			      	v-model="lightAColor"
			      	:colors="colors"
			      	row-length="5"
			      	shapes="circles"
			      	show-border
			      	popover-to="left"
			      	@input="$emit(`lightAColor`, $event)"
			    ></swatches>
		    </v-list-tile-action>

		    <v-list-tile-content>
		      	<v-list-tile-title>Цвет источника #1</v-list-tile-title>
		      	<v-list-tile-sub-title>Цвет источника #1</v-list-tile-sub-title>
		    </v-list-tile-content>

	      	
	    </v-list-tile>

	    <v-list-tile>
    		<v-list-tile-action>
		        <swatches
			      	v-model="lightBColor"
			      	:colors="colors"
			      	row-length="5"
			      	shapes="circles"
			      	show-border
			      	popover-to="left"
			      	@input="$emit(`lightBColor`, $event)"
			    ></swatches>
		    </v-list-tile-action>

		    <v-list-tile-content>
		      	<v-list-tile-title>Цвет источника #2</v-list-tile-title>
		      	<v-list-tile-sub-title>Цвет источника #2</v-list-tile-sub-title>
		    </v-list-tile-content>

	      	
	    </v-list-tile>

	 </v-list>
	
</template>

<script type="text/javascript">
	
	import Swatches from 'vue-swatches'
	import "vue-swatches/dist/vue-swatches.min.css"

	export default {
		data () {
			return {
				bumpmapping: true,
				bumpmappingLevel: 6,
				lightDistance: 300,
				lightAColor: '#F64272',
				lightBColor: '#51e5db',
				lightIntensity: 1.7,
      			colors: [
      				['#F64272', '#F6648B', '#F493A7', '#F891A6', '#FFCCD5' ],
			        ['#8b5aff', '#a27bff', '#b99cff', '#d0bdff', '#e8deff' ],
			        ['#51e5db', '#74ebe3', '#96f0ea', '#b9f5f1', '#dcfaf8' ],
			        ['#98f642', '#90f665', '#b1f494', '#b0f891', '#dbffcc' ],
			        ['#ffa51a', '#ffb748', '#ffc976', '#ffdba3', '#ffedd1' ]
      			]
			}
		},
		components: { Swatches },
		methods: {

		}
	}
</script>