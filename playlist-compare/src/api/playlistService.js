import axios from "axios";
import { APIurl } from "./config";

//网易云音乐不能在此获取歌名
async function getNCMPlaylist(id) {
    let playlist = [];
    //不在这里获取歌名，因为可以只获取相同歌曲的歌名，节省流量。
    await axios
        .get(`${APIurl.ncm}/playlist/detail?id=${id}`)
        .then((response) => {
            response.data.playlist.trackIds.forEach((i) => {
                playlist.push({
                    id: i.id,
                    name: "请求数据中",
                });
            });
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
    return axios.get(`${APIurl.ncm}/song/detail`, {
        params: {
            ids: idsString,
        },
    });
    //FIXME 歌单数量过多请求会失败，要分次请求，或者改/增加API
}
// 00 01 11 0代表网易云音乐，1代表QQ音乐---
//  QQ音乐和网易云音乐的json的结构不同可以自动判断
//
// function getPlatfromType(playlist) {
//     if (playlist[0] === undefined) {
//         return "ncm";
//     }
//     return "qqm";
// }

//网易云音乐要获取歌名，所以要和QQ音乐分开
export async function getSame(
    yourPlaylist,
    herPlaylist,
    yourPlatfrom,
    herPlatfrom
) {
    let same = [];
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
            resp.data.songs.forEach((i, index) => {
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
export async function getPlaylist(id, platform) {
    let playlist = [];
    if (platform === "ncm") {
        playlist = await getNCMPlaylist(id);
    } else if (platform === "qqm") {
        playlist = await getQQMPlaylist(id);
    }
    return playlist;
}
export async function getSongUrl(id) {
    return axios.get(`${APIurl.ncm}/song/url?id=${id}`);
}
