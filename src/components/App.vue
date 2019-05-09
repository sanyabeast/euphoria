<template>
    <div 
        class="euphoria root"
        :data-browser-name="$store.state.browserName"
        :data-mobile-device="$store.state.mobileDevice ? 1 : 0"
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

        document.body.addEventListener( "touchstart", ( evt )=>{
            evt.stopPropagation()
            evt.preventDefault()
        } )

        document.body.addEventListener( "touchmove", ( evt )=>{
            evt.stopPropagation()
            evt.preventDefault()
        } )

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