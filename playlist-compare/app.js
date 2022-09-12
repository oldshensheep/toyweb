const id_reg = new RegExp("((?<=/playlist/)[0-9]*)|((?<=/?id=)[0-9]*)");
const columns = [
  {
    name: "index",
    label: "序号",
    align: "left",
    sortable: true,
  },
  {
    name: "id",
    label: "id",
    field: "id",
    align: "left",
    sortable: true,
  },
  {
    name: "name",
    label: "标题",
    field: "name",
    align: "left",
    sortable: true,
  },
];
const { useQuasar } = Quasar;
const { ref, watch, computed } = Vue;
const { useStorage } = VueUse;

const app = Vue.createApp({
  setup() {
    const $q = useQuasar();
    const leftDrawerOpen = ref(false);
    const her_input = useStorage("her_input", DEFAULT.her_input);
    const your_input = useStorage("your_input", DEFAULT.your_input);
    const her_platform = useStorage("her_platform", DEFAULT.her_platform);
    const your_platform = useStorage("your_platform", DEFAULT.your_platform);
    const accept = useStorage("accept", false);
    const your = ref({ name: "昵称", id: "319475460" });
    const her = ref({ name: "昵称", id: "319475460" });
    const her_playlist = ref({ name: "歌单名称", len: 0 });
    const your_playlist = ref({ name: "歌单名称", len: 0 });
    const same = ref([]);
    const message = "Hello Vue!";

    const idRules = [
      (v) => {
        if (!v) {
          return "请输入id或链接";
        }
        if (v.length > 15) {
          let d = id_reg.exec(v);
          if (d === null) return "请输入正确的id或url";
        }
        if (v.length < 4) {
          return "请输入正确的id或url";
        }
        return true;
      },
    ];
    const msg = computed(() => {
      let percent = Math.max(
        same.value.length / your_playlist.value.len,
        same.value.length / her_playlist.value.len
      );
      if (!Number.isNaN(percent)) {
        if (percent < 0.04) {
          return "虽然……但是何不尝试了解一下ta呢！";
        } else if (percent < 0.08) {
          return "不要辜负ta的好意！";
        } else if (percent < 0.16) {
          return "不错的结果，但还是要继续加油！";
        } else if (percent < 0.32) {
          return "原地结婚吧！";
        } else {
          return "应该是同一个人吧？？？";
        }
      } else {
        return "会是什么样的结果呢？";
      }
    });
    watch(her_input, (her_input) => {
      if (!her_input) return;
      if (her_input.match(/.*163\.com.*/)) {
        her_platform.value = "ncm";
      } else if (her_input.match(/.*qq\.com.*/)) {
        her_platform.value = "qqm";
      }
    });
    watch(your_input, (your_input) => {
      if (!your_input) return;
      if (your_input.match(/.*163\.com.*/)) {
        your_platform.value = "ncm";
      } else if (your_input.match(/.*qq\.com.*/)) {
        your_platform.value = "qqm";
      }
    });
    return {
      filter: ref(""),
      her_input,
      your_input,
      accept,
      message,
      idRules,
      your,
      her,
      your_platform,
      her_platform,
      her_playlist,
      your_playlist,
      same,
      msg,
      columns,
      options: [
        {
          label: "网易云音乐",
          value: "ncm",
        },
        {
          label: "QQ音乐",
          value: "qqm",
        },
      ],
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      async onSubmit() {
        if (accept.value !== true) {
          $q.notify({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message: "请先同意服务协议",
          });
        } else {
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "正在查询",
          });
          let her_id = her_input.value;
          let your_id = your_input.value;
          if (her_id.length > 15) {
            her_id = id_reg.exec(her_id)[0];
          }
          if (your_id.length > 15) {
            your_id = id_reg.exec(your_id)[0];
          }

          // her_playlist.value = await getPlaylist(her_id, her_platform.value);
          // your_playlist.value = await getPlaylist(your_id, your_platform.value);
          let data = null;
          try {
            const resp = await getSame_test(
              your_id,
              her_id,
              your_platform.value,
              her_platform.value
            );
            if (!resp.ok) {
              $q.notify({
                color: "red-5",
                textColor: "white",
                icon: "warning",
                message: resp.statusText,
              });
              return;
            }
            data = await resp.json();
          } catch (e) {
            $q.notify({
              color: "red-5",
              textColor: "white",
              icon: "warning",
              message: "网络错误",
            });
            return;
          }
          same.value = data.common_songs;
          her_playlist.value = data.her_playlist;
          your_playlist.value = data.your_playlist;
          your.value = data.your;
          her.value = data.her;
          console.log(same.value);
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "查询完成",
          });
        }
      },
      alert() {
        $q.dialog({
          title: "服务协议",
          message: "你发送给服务器的信息会被保存在服务器上，并且用于数据分析。",
        });
      },
      onReset() {
        her_input.value = "";
        your_input.value = "";
      },
      open_external_link(url) {
        open(url, (target = "_blank"));
      },
    };
  },
});

app.use(Quasar);
app.mount("#app");
