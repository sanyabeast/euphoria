<template>
    <v-app
        class="euphoria root"
        :data-browser-name="$store.state.browserName"
        :data-mobile-device="$store.state.mobileDevice ? 1 : 0"
    >
        <Wonderland
            @pauseClick="onPauseClick"
            ref="wonderland"
        ></Wonderland>

        <Pause
            v-if="pauseMenuShown"
            @showSettings="onShowSettings"
            @resume="onResumeClick"
        />
        <Settings 
            v-if="settingsShown"
            @exit="onSettingsExit"
        />
    </v-app>
</template>

<script>

import Button from "components/Button.vue"
import Pause from "components/Pause.vue"
import Settings from "components/Settings.vue"
import Wonderland from "components/Wonderland.vue"

export default {
	components: { Button, Wonderland, Pause, Settings },
    data () {
        return {
            settingsShown: false,
            pauseMenuShown: false
        }
    },
	mounted () {

        // document.body.addEventListener( "touchstart", ( evt )=>{
        //     evt.stopPropagation()
        //     evt.preventDefault()
        // } )

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
        onPauseClick () {
            console.log(1)
            this.$refs.wonderland.stopRendering()
            this.pauseMenuShown = true
        },
        onResumeClick () {
            this.pauseMenuShown = false
            this.$refs.wonderland.startRendering()
        },  
        onShowSettings () {
            this.pauseMenuShown = false;
            this.settingsShown = true;
        },
        onSettingsExit () {
            this.settingsShown = false
            this.pauseMenuShown = false
            this.$refs.wonderland.startRendering()
        }
    }

}
   
</script>

<style lang="sass">
    import "sass/app.scss"
    import "sass/fonts.scss"
</style>