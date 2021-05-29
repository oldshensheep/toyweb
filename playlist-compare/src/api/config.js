export const APIurl = {
  ncm: "https://ncmapi.v2nd.com",
  qqm:
    "https://service-c41ch70i-1257843962.gz.apigw.tencentcs.com/release/json_proxy/https://c.y.qq.com/v8/fcg-bin/fcg_v8_playlist_cp.fcg?id=",
};
export function check() {
  if (!localStorage.getItem("ncm_api_server")) {
    localStorage.setItem("ncm_api_server", APIurl.ncm);
    localStorage.setItem("qqm_api_server", APIurl.qqm);
  }
  console.log(localStorage.getItem("ncm_api_server"));
  console.log(localStorage.getItem("qqm_api_server"));
}
export function reset() {
  localStorage.setItem("ncm_api_server", APIurl.ncm);
  localStorage.setItem("qqm_api_server", APIurl.qqm);
  APIurl.qqm = localStorage.getItem("qqm_api_server");
  APIurl.ncm = localStorage.getItem("ncm_api_server");
}
