module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "/toyweb/plscp/" : "/",
    productionSourceMap: false,
    transpileDependencies: ["vuetify"],
};
