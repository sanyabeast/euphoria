<template>
    <div
      class="pause-menu"
      @click="onClick"
    >
        <p>Resume</p>
    </div>
</template>

<script>

export default {
    props: {

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