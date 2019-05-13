<template>
    <v-app
        class="euphoria root"
        v-bind:class="{ overlayActive: (pauseMenuShown || settingsShown) }"
        :data-browser-name="$store.state.browserName"
        :data-mobile-device="$store.state.mobileDevice ? 1 : 0"
    >
        <Wonderland
            @pauseClick="onPauseClick"
            ref="wonderland"
        ></Wonderland>

        <div class="overlay"
            v-if="pauseMenuShown || settingsShown"
        ></div>

        <Pause
            v-show="pauseMenuShown"
            @showSettings="onShowSettings"
            @resume="onResumeClick"
        />
        
        <transition 
            :css="false"
            @enter="onSettingsEnter"
            @leave="onSettingsLeave"
        >
            <Settings 
                v-show="settingsShown"
                ref="settingsMenu"
                @exit="onSettingsExit"
            />
        </transition>
    </v-app>
</template>

<script>

import Button from "components/Button.vue"
import Pause from "components/Pause.vue"
import Settings from "components/Settings.vue"
import Wonderland from "components/Wonderland.vue"
import screenfull from "screenfull"

export default {
	components: { Button, Wonderland, Pause, Settings },
    data () {
        return {
            settingsShown: false,
            pauseMenuShown: false
        }
    },
	mounted () {
        this.$store.dispatch( "load" )
        // document.body.addEventListener( "touchstart", ( evt )=>{
        //     evt.stopPropagation()
        //     evt.preventDefault()
        // } )

        if ( !this.$store.state.isHybridApp && this.$store.state.mobileDevice && this.$store.state.browserName != "safari" ) {
            document.body.addEventListener( "click", ()=>{
                screenfull.request()
            } )
        }

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
            this.$store.dispatch( "save" )
            this.settingsShown = false
            this.pauseMenuShown = false
            this.$refs.wonderland.startRendering()
        },
        onSettingsEnter ( el, done ) {
            this.$refs.settingsMenu.reset()
            done()
        },
        onSettingsLeave ( el, done ) {
            done()
        },
        onAppClick () {            
        }
    }

}
   
</script>

<style lang="sass">
    import "sass/app.scss"
    import "sass/fonts.scss"
</style>