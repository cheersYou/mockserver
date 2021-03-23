import * as turf from "@turf/turf";
import { LAYER_TYPE } from "@/utils/Constants";
const types = Object.values(LAYER_TYPE);
export const topic3dtree = (Mock) => {
  const num = Mock.Random.integer(10, 20);
  const res = [];
  for (let i = 0; i < num; i++) {
    const childnum = Mock.Random.integer(0, 5);
    const item = {
      guid: Mock.Random.guid(),
      name: "@cname",
      "type|1": types,
      url: Mock.Random.url("http", "baidu.com"),
      "visible|1": [true, false],
      children: [],
    };
    for (let j = 0; j < childnum; j++) {
      const childitem = {
        guid: Mock.Random.guid(),
        name: "@cname",
        "type|1": types,
        url: Mock.Random.url("http", "baidu.com"),
        "visible|1": [true, false],
        children: [],
      };
      item.children.push(childitem);
    }
    res.push(item);
  }
  return {
    data: res,
  };
};

export const geojson_point = (Mock) => {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: [
            Mock.Random.float(-180, 180, 2, 6),
            Mock.Random.float(-90, 90, 2, 6),
          ],
        },
      },
    ],
  };
};
export const geojson_multipoint = (Mock) => {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "MultiPoint",
          coordinates: [
            [
              Mock.Random.float(-180, 180, 2, 6),
              Mock.Random.float(-90, 90, 2, 6),
            ],
            [
              Mock.Random.float(-180, 180, 2, 6),
              Mock.Random.float(-90, 90, 2, 6),
            ],
          ],
        },
      },
    ],
  };
};

export const geojson_line = (Mock) => {
  const num = Mock.Random.integer(5, 10);
  const points = [];
  for (let i = 0; i < num; i++) {
    points.push([
      Mock.Random.float(-180, 180, 2, 6),
      Mock.Random.float(-90, 90, 2, 6),
    ]);
  }
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: points,
        },
      },
    ],
  };
};
export const geojson_multiline = (Mock) => {
  const linenum = Mock.Random.integer(1, 5);
  const lines = [];
  for (let i = 0; i < linenum; i++) {
    const num = Mock.Random.integer(5, 10);
    const points = [];
    for (let j = 0; j < num; j++) {
      points.push([
        Mock.Random.float(-180, 180, 2, 6),
        Mock.Random.float(-90, 90, 2, 6),
      ]);
    }
    lines.push(points);
  }
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "MultiLineString",
          coordinates: lines,
        },
      },
    ],
  };
};
export const geojson_polygon = (Mock) => {
  const num = Mock.Random.integer(2, 6);
  const points = [];
  for (let i = 0; i < num; i++) {
    points.push([
      Mock.Random.float(-180, 180, 2, 6),
      Mock.Random.float(-90, 90, 2, 6),
    ]);
  }
  points.push(points[0]);
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [points],
        },
      },
    ],
  };
};

export const geojson_hole = (Mock) => {
  const num = Mock.Random.integer(2, 6);
  const holes = [];
  // 岛
  for (let i = 0; i < num; i++) {
    holes.push([
      Mock.Random.float(-180, 180, 2, 6),
      Mock.Random.float(-90, 90, 2, 6),
    ]);
  }
  holes.push(holes[0]);
  const polygon = turf.polygon([holes]);
  const polygonScale = turf.buffer(polygon, 5000, { units: "miles" });
  const points = polygonScale.geometry.coordinates[0];
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [points, holes],
        },
      },
    ],
  };
};
