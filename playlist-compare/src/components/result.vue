<template>
  <div class="minwidth">
    <comparetable
      :your="yourPlaylist.length"
      :her="herPlaylist.length"
      :same="sameMusic.length"
    ></comparetable>
    <vuetify-audio
      :file="playingurl"
      color="success"
      :autoPlay="true"
      downloadable
    ></vuetify-audio>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="sameMusic"
        :search="search"
      ></v-data-table>
    </v-card>
    <!-- <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th>序号</th>
            <th>ID</th>
            <th>歌名</th>
            <th>
              <v-text-field
                v-model="search"
                placeholder="输入歌名搜索"
                outlined
                dense
                hide-details="auto"
              ></v-text-field>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(song, index) in sameMusicFilter" :key="song.id">
            <td class="text-left">{{ index + 1 }}</td>
            <td class="text-left">{{ song.id }}</td>
            <td class="text-left">{{ song.name }}</td>
            <td class="text-left">
              <v-btn @click="play(song.id)">
                <v-icon color="red" left>mdi-play-circle</v-icon>
                播放
              </v-btn>
              <v-btn @click="viewSongPage(song.id)">
                <v-icon left>mdi-eye</v-icon>
                查看歌曲页面
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table> -->
  </div>
</template>

<script>
import { getPlaylist, getSame, getSongUrl } from "@/api/playlistService";
export default {
  props: ["form"],
  components: {
    comparetable: () => import("./CompareTable"),
    VuetifyAudio: () => import("@/components/vuetifyaudio"),
  },
  created() {
    this.onSubmit();
  },
  data() {
    return {
      yourPlaylist: [],
      herPlaylist: [],
      sameMusic: [],
      headers: [
        { text: "序号", value: "item.index" },
        { text: "ID", value: "id" },
        { text: "歌名", value: "name" },
        //   { text: "序号", value: "index" },
      ],
      search: "",
      playingurl: "",
      platform: "",
    };
  },
  methods: {
    viewSongPage(id) {
      window.open("https://music.163.com/song?id=" + id);
    },
    // TODO 播放的音乐来源可能是QQ音乐
    // 网易云音乐   网易云音乐    -> 列表 网易云音乐
    // 网易云音乐   QQ音乐       -> 列表 网易云音乐
    // QQ音乐       QQ音乐       -> 列表 QQ音乐
    async play(id) {
      let resp = await getSongUrl(id);
      this.playingurl = resp.data.data[0].url;
    },
    setPlatfrom() {
      this.platform = "ncm";
      if (this.form.yourPlatform === "qqm" && this.form.herPlatform === "qqm") {
        this.platform = "qqm";
      }
    },
    async onSubmit() {
      this.setPlatfrom();
      this.yourPlaylist = await getPlaylist(
        this.form.yourId,
        this.form.yourPlatform
      );
      console.log(this.yourPlaylist);
      this.herPlaylist = await getPlaylist(
        this.form.herId,
        this.form.herPlatform
      );
      console.log(this.herPlaylist);
      this.sameMusic = await getSame(
        this.yourPlaylist,
        this.herPlaylist,
        this.form.yourPlatform,
        this.form.herPlatform
      );
      this.$root.$data.isLoading = false;
      console.log(this.sameMusic);
    },
  },
};
</script>
<style scoped>
.minwidth {
  min-width: 450px;
}
</style>
