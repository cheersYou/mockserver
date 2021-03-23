/*
 * @Author: weicong
 * @Date: 2021-03-23 10:24:26
 * @LastEditTime: 2021-03-23 10:52:38
 * @LastEditors: weicong
 * @Description:
 */
import Mock from "mockjs";
import {
  topic3dtree,
  geojson_point,
  geojson_multipoint,
  geojson_line,
  geojson_multiline,
  geojson_polygon,
  geojson_hole,
} from "./rules";
export default {
  name: "mixin",
  methods: {
    get3DTopicTree() {
      const rules = topic3dtree(Mock);
      const data = Mock.mock(rules);
      return data;
    },
    getGeoJson() {
      const random = Mock.Random.integer(1, 6);
      let geojson = null;
      switch (random) {
        case 1:
          geojson = geojson_point(Mock);
          break;
        case 2:
          geojson = geojson_line(Mock);
          break;
        case 3:
          geojson = geojson_polygon(Mock);
          break;
        case 4:
          geojson = geojson_multipoint(Mock);
          break;
        case 5:
          geojson = geojson_multiline(Mock);
          break;
        case 6:
          geojson = geojson_hole(Mock);
          break;
      }
      return geojson;
    },
  },
};
