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
                @bumpmapping="$refs.wonderland.setBumpmapping($event)"
                @bumpmappingLevel="$refs.wonderland.setBumpmappingLevel($event)"
                @lightDistance="$refs.wonderland.setLightDistance($event)"
                @lightIntensity="$refs.wonderland.setLightIntensity($event)"
                @physicEnabled="$refs.wonderland.setPhysicsEnabled($event)"
                @matterObjectsFriction="$refs.wonderland.setMatterObjectsFriction($event)"
                @matterObjectsRestitution="$refs.wonderland.setMatterObjectsRestitution($event)"
                @gyroGravityEnabled="$refs.wonderland.setGyroGravityEnabled($event)"
                @gravityX="$refs.wonderland.setGravityX($event)"
                @gravityY="$refs.wonderland.setGravityY($event)"
                @lightAColor="$refs.wonderland.setLightColor(`A`, $event)"
                @lightBColor="$refs.wonderland.setLightColor(`B`, $event)"
                @backgroundShader="$refs.wonderland.setBackgroundShader($event)"
                @backgroundEnabled="$refs.wonderland.modules.bg.visible = $event; $refs.wonderland.renderFrame()"
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