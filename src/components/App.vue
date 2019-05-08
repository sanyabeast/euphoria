<template>
    <div 
        class="euphoria root"
    >

        hi
        <Wonderland

        ></Wonderland>

        <transition name="pause-menu-fade">
            <Pause
                v-if="$store.state.paused === true"
            />

        </transition>
    </div>
</template>

<script>

import Button from "components/Button.vue"
import Pause from "components/Pause.vue"
import Wonderland from "components/Wonderland.vue"

export default {
	components: { Button, Wonderland, Pause },
    data () {
        return {}
    },
	mounted () {
		window.addEventListener( "android.key.back.pressed", ()=>{
            this.$store.dispatch( "native", {
                method: "showExitDialog",
                args: [
                    "Really?",
                    "Yes",
                    "No"
                ]
            } )
        } )

	},
    methods: {

    }

}
   
</script>

<style lang="sass">
    import "sass/app.scss"
    import "sass/fonts.scss"
</style>