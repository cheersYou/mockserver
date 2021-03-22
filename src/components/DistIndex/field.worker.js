/*
 * @Author: weicong
 * @Date: 2021-03-22 21:20:48
 * @LastEditTime: 2021-03-22 22:07:39
 * @LastEditors: weicong
 * @Description:
 */
import Mock from "mockjs";
self.onmessage = (e) => {
  const { list, reslength, resdeep, hasID, hasChildren } = e.data;
  function generateRule(list, length, deep) {
    const res = [];
    for (let i = 0; i < length; i++) {
      let item = {};
      list.map((i) => {
        if (hasID) {
          item["id"] = Mock.Random.guid();
        }
        item[i.key] = getType(i.type, Number(i.length));
      });
      if (hasChildren && deep > 0) {
        item["children"] = generateRule(
          list,
          Mock.Random.integer(0, length),
          deep - 1
        );
      }
      res.push(item);
      item = null;
    }
    return res;
  }
  function getType(type, len) {
    let res = "";
    switch (type) {
      case "string":
      default:
        res = Mock.Random.ctitle(len);
        break;
      case "ystring":
        res = Mock.Random.word(len);
        break;
      case "int":
        res = Mock.Random.integer((len - 1) * 10, len * 10);
        break;
      case "float":
        res = Mock.Random.float((len - 1) * 10, len * 10);
        break;
      case "date":
        res = Mock.Random.date();
        break;
      case "color":
        res = Mock.Random.color();
        break;
      case "province":
        res = Mock.Random.province();
        break;
      case "city":
        res = Mock.Random.city();
        break;
      case "county":
        res = Mock.Random.county();
        break;
      case "url":
        res = Mock.Random.url("http");
        break;
      case "bool":
        res = Mock.Random.boolean();
        break;
    }
    return res;
  }
  const rules = generateRule(list, reslength, resdeep);
  const data = Mock.mock(rules);
  self.postMessage({
    data: data,
  });
  self.close();
};
