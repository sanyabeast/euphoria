<template>
    <v-card
        class="pause-menu"
    >
      <v-list>
        <v-list-tile avatar>
          <v-list-tile-content>
            <v-list-tile-title>DEMO 101</v-list-tile-title>
            <v-list-tile-sub-title>Pause menu</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-divider></v-divider>

      <!-- <v-list>
        <v-list-tile>
          <v-list-tile-action>
            <v-switch v-model="message" color="purple"></v-switch>
          </v-list-tile-action>
          <v-list-tile-title>Enable messages</v-list-tile-title>
        </v-list-tile>

        <v-list-tile>
          <v-list-tile-action>
            <v-switch v-model="hints" color="purple"></v-switch>
          </v-list-tile-action>
          <v-list-tile-title>Enable hints</v-list-tile-title>
        </v-list-tile>
      </v-list> -->

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn flat @click="onResumeClick">Resume</v-btn>
        <v-btn color="primary" flat @click="onSettingsClick">Settings</v-btn>
      </v-card-actions>
    </v-card>
    <!-- <div
      class="pause-menu"
      @click="onResumeClick"
    >
        <p>Resume</p>
        <a :href="apk_dl_url">Download APK</a>
        
    </div> -->

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
        onResumeClick ( evt ) {
            this.$emit( "resume" )
        },
        onSettingsClick ( evt ) {
            this.$emit( "showSettings" )
        }
    }
}
   
</script>

<style lang="sass">

</style>