<template>
    <div
      class="pause-menu"
      @click="onClick"
    >
        <p>Resume</p>
        <a :href="apk_dl_url">Download APK</a>
    </div>
</template>

<script>

import data from "data/data.json"

console.log(data)

export default {
    data () {
        return {
            apk_dl_url: data.apk_dl_url
        }
    },
    methods: {
        onClick ( evt ) {
            this.$store.state.paused = false
            this.$root.$emit( "wonderland.render" )
        }
    }
}
   
</script>

<style lang="sass">

</style>