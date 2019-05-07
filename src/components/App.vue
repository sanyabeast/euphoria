<template>
    <div 
        class="euphoria root"
    >

        hi
        <Wonderland

        ></Wonderland>

        <Pause
            v-if="$store.state.paused === true"
        />

    </div>
</template>

<script>

import Button from "components/Button.vue"
import Pause from "components/Pause.vue"
import Wonderland from "components/Wonderland.vue"

export default {
	components: { Button, Wonderland, Pause },
    data () {

    },
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