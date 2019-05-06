<template>
    <div 
        class="euphoria root"
    >

        hi
        <Wonderland

        ></Wonderland>
    </div>
</template>

<script>

import Button from "components/Button.vue"
import Wonderland from "components/Wonderland.vue"

export default {
	components: { Button, Wonderland },
	mount () {
		// this.$store.commit( "currentPage", "projects" )
	},
    methods: {

    }

}
   
</script>

<style lang="sass">
    import "sass/app.scss"
    import "sass/fonts.scss"
</style>