if (localStorage.getItem("her_input") === null) {
  localStorage.setItem("her_input", DEFAULT.her_input);
}

if (localStorage.getItem("your_input") === null) {
  localStorage.setItem("your_input", DEFAULT.your_input);
}
if (localStorage.getItem("accept") === null) {
  localStorage.setItem("accept", "false");
}

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

const app = Vue.createApp({
  setup() {
    const $q = useQuasar();
    const leftDrawerOpen = ref(false);
    const her_input = ref(localStorage.getItem("her_input"));
    const your_input = ref(localStorage.getItem("your_input"));
    const her_platform = ref("ncm");
    const your_platform = ref("ncm");
    const her_playlist = ref([]);
    const your_playlist = ref([]);
    const her_playlist_len = ref(0);
    const your_playlist_len = ref(0);
    const same = ref([]);
    const accept = ref(localStorage.getItem("accept") === "true");
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
    const percentHer = computed(() =>
      (
        (her_playlist_len.value /
          (her_playlist_len.value + your_playlist_len.value)) *
        100
      ).toFixed(2)
    );
    const percentYour = computed(() =>
      (
        (your_playlist_len.value /
          (her_playlist_len.value + your_playlist_len.value)) *
        100
      ).toFixed(2)
    );
    const percentSame = computed(() =>
      (
        ((same.value.length * 2) /
          (her_playlist_len.value + your_playlist_len.value)) *
        100
      ).toFixed(2)
    );

    watch(accept, (accept) => {
      localStorage.setItem("accept", accept);
    });
    watch(her_input, (her_input) => {
      localStorage.setItem("her_input", her_input || "");
    });
    watch(your_input, (your_input) => {
      localStorage.setItem("your_input", your_input || "");
    });
    return {
      filter: ref(""),
      her_input,
      your_input,
      accept,
      message,
      idRules,
      your_platform,
      her_platform,
      her_playlist_len,
      your_playlist_len,
      percentHer,
      percentYour,
      percentSame,
      same,
      columns,
      options: [
        {
          label: "网易云音乐",
          value: "ncm",
        },
        {
          label: "QQ音乐",
          value: "qqm",
          disable: true,
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

          let response = await getSame_test(your_id, her_id);
          same.value = response.common_songs;
          her_playlist_len.value = response.her_playlist_len;
          your_playlist_len.value = response.your_playlist_len;
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
          message:
            "你发送给服务器的信息，会被保存在服务器上，并且用于数据分析。",
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
