/*
 * @Author: weicong
 * @Date: 2021-03-02 16:42:52
 * @LastEditTime: 2021-03-22 21:36:08
 * @LastEditors: weicong
 * @Description:
 */
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  publicPath: process.env.NODE_ENV === "development" ? "/" : "./",
  // 禁止暴露源码
  productionSourceMap: true,
  devServer: {
    port: 9096,
    open: true,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/style/index.scss";`,
      },
    },
  },
  transpileDependencies: ["view-design/src"],
  chainWebpack: (config) => {
    config.resolve.alias.set("@", resolve("src"));
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.include
      .add(resolve("src/svg"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
    const imagesRule = config.module.rule("images");
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude.add(resolve("src/svg"))
      .end();
    config.module
      .rule("worker")
      .test(/\.worker\.js$/)
      .use("worker-loader")
      .loader("worker-loader")
      .options({
        inline: "fallback",
      })
      .end();
    config.module.rule("js").exclude.add(/\.worker\.js$/);
  },
};
