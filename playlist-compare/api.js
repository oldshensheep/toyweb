const APIurl = {
  ncm: "https://ncmapi.v2nd.com",
  qqm: "https://service-c41ch70i-1257843962.gz.apigw.tencentcs.com/release/json_proxy/https://c.y.qq.com/v8/fcg-bin/fcg_v8_playlist_cp.fcg?id=",
};
const SHEEP_API =
  "https://api.oldshensheep.com";
const DEFAULT = {
  her_input:
    "https://i.y.qq.com/n2/m/share/details/taoge.html?platform=11&appshare=android_qq&appversion=11050108&hosteuin=oKosNe6kNKoAoc**&id=8399616661&ADTAG=qfshare",
  her_platform: "qqm",
  your_input:
    "分享oldshensheep创建的歌单「oldshensheep喜欢的音乐」: http://music.163.com/playlist/444265995/319475460/?userid=319475460 (来自@网易云音乐)",
  your_platform: "ncm",
};
function check() {
  if (!localStorage.getItem("ncm_api_server")) {
    localStorage.setItem("ncm_api_server", APIurl.ncm);
  }
  if (!localStorage.getItem("qqm_api_server")) {
    localStorage.setItem("qqm_api_server", APIurl.qqm);
  }
}
function reset() {
  localStorage.setItem("ncm_api_server", APIurl.ncm);
  localStorage.setItem("qqm_api_server", APIurl.qqm);
  APIurl.qqm = localStorage.getItem("qqm_api_server");
  APIurl.ncm = localStorage.getItem("ncm_api_server");
}

//网易云音乐不在此获取歌名
async function getNCMPlaylist(id) {
  let playlist = [];
  //不在这里获取歌名，因为可以只获取相同歌曲的歌名，节省流量。
  await fetch(`${APIurl.ncm}/playlist/detail?id=${id}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.playlist) {
        data.playlist.trackIds.forEach((i) => {
          playlist.push({
            id: i.id,
            name: "请求数据中",
          });
        });
      }
    });
  return playlist;
}

async function getQQMPlaylist(id) {
  let playlist = [];
  let resp = await axios.get(`${APIurl.qqm}${id}&format=json`);
  resp.data.data.cdlist[0].songlist.forEach((i) => {
    playlist.push({
      id: i.songid,
      name: i.songname,
    });
  });
  return playlist;
}
async function getSongDetail(ids) {
  let idsString = "";
  if (ids[0].id === undefined) {
    idsString = ids.join();
  } else {
    ids.forEach((id, index) => {
      if (index != ids.length - 1) {
        idsString += id.id + ",";
      } else {
        idsString += id.id;
      }
    });
  }
  return (await fetch(`${APIurl.ncm}/song/detail?ids=${idsString}`)).json();
  //FIXME 歌单数量过多请求会失败，要分次请求，或者改/增加API
}

//网易云音乐要获取歌名，所以要和QQ音乐分开
async function getSame(yourPlaylist, herPlaylist, yourPlatfrom, herPlatfrom) {
  let same = [];
  console.log(yourPlaylist, herPlaylist, yourPlatfrom, herPlatfrom);
  if (yourPlatfrom === "ncm" && herPlatfrom === "ncm") {
    for (let y = 0; y < yourPlaylist.length; y++) {
      for (let h = 0; h < herPlaylist.length; h++) {
        if (yourPlaylist[y].id === herPlaylist[h].id) {
          same.push(yourPlaylist[y]);
        }
      }
    }
    if (same.length === 0) {
      return same;
    } else {
      let resp = await getSongDetail(same);
      resp.songs.forEach((i, index) => {
        same[index].name = i.name;
      });
    }
    return same;
  } else if (yourPlatfrom === "qqm" && herPlatfrom === "qqm") {
    for (let y = 0; y < yourPlaylist.length; y++) {
      for (let h = 0; h < herPlaylist.length; h++) {
        if (yourPlaylist[y].id === herPlaylist[h].id) {
          same.push(yourPlaylist[y]);
        }
      }
    }
    return same;
  } else {
    //平台不同时，暂规定id以网易云音乐平台为准
    if (yourPlatfrom === "ncm") {
      let resp = await getSongDetail(yourPlaylist);
      yourPlaylist = resp.data.songs;
    } else {
      let resp = await getSongDetail(herPlaylist);
      herPlaylist = resp.data.songs;
      //以网易云音乐id为准
      [yourPlaylist, herPlaylist] = [herPlaylist, yourPlaylist];
    }
    for (let y = 0; y < yourPlaylist.length; y++) {
      for (let h = 0; h < herPlaylist.length; h++) {
        if (yourPlaylist[y].name === herPlaylist[h].name) {
          same.push(yourPlaylist[y]);
        }
      }
    }
    return same;
  }
}
/**
 * 根据歌单id获取歌曲列表
 * @param {*} id 歌单的id
 * @param {*} platform 平台,可取ncm，qqm
 */
async function getPlaylist(id, platform) {
  let playlist = [];
  if (platform === "ncm") {
    playlist = await getNCMPlaylist(id);
  } else if (platform === "qqm") {
    playlist = getQQMPlaylist(id);
  }
  return playlist;
}
async function getSongUrl(id) {
  return axios.get(`${APIurl.ncm}/song/url?id=${id}`);
}

async function getSame_test(
  your_id,
  her_id,
  yourPlatfrom = "ncm",
  herPlatfrom = "ncm"
) {
  return fetch(
    `${SHEEP_API}/?your_id=${your_id}&her_id=${her_id}&your_platform=${yourPlatfrom}&her_platform=${herPlatfrom}`
  );
}
