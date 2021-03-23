<!--
 * @Author: weicong
 * @Date: 2021-03-10 17:39:06
 * @LastEditTime: 2021-03-23 11:15:31
 * @LastEditors: weicong
 * @Description: 
-->
<template>
  <div class="container">
    <Form ref="formRef" inline class="form">
      <FormItem>
        <div class="option-field">
          <div>
            <span>ID</span>
            <i-Switch v-model="hasID" size="small" />
          </div>
          <div>
            <span>Children</span>
            <i-Switch v-model="hasChildren" size="small" />
          </div>
          <div>
            <span>长度</span>
            <InputNumber :max="100" :min="1" v-model="reslength"></InputNumber>
          </div>
          <div v-if="hasChildren">
            <span>深度</span>
            <InputNumber :max="5" :min="1" v-model="resdeep"></InputNumber>
          </div>
        </div>
      </FormItem>
      <FormItem :prop="i.key" v-for="(i, index) in formlist" :key="index">
        <Row
          @mouseenter.native="mouseenter(i)"
          @mouseleave.native="mouseleave(i)"
        >
          <Col span="8">
            <Input type="text" v-model="i.key" placeholder="输入键名">
              <span slot="prepend">KEY</span>
            </Input>
          </Col>
          <Col span="8">
            <span>TYPE</span>
            <Select v-model="i.type" placeholder="选择类型">
              <Option
                v-for="item in typelist"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </Col>
          <Col span="8">
            <Input type="text" v-model="i.length" placeholder="输入长度">
              <span slot="prepend">LENGTH</span>
            </Input>
            <Icon
              type="md-close-circle"
              :style="{ opacity: i.hover ? 1 : 0 }"
              @click="removeHandler(i)"
            />
          </Col>
        </Row>
      </FormItem>
      <FormItem>
        <Button type="dashed" long @click="handleAdd" icon="md-add"
          >添加字段</Button
        >
      </FormItem>
      <FormItem>
        <Button type="primary" long @click="handleSubmit">生成数据</Button>
      </FormItem>
    </Form>
    <div class="result">
      <editor :value.sync="editorCode" :options="editorOptions"></editor>
      <div class="copy" @click="copyHandler">复制</div>
      <Spin v-if="loading" fix></Spin>
    </div>
    <div class="default-container">
      <div class="default-container-title">
        <span>默认自定义MOCK列表</span>
        <Input v-model="searchVal" size="small" style="width:40%" search />
      </div>
      <div class="default-list">
        <Button
          v-for="(i, index) in defaultlist"
          type="dashed"
          :key="index"
          style="margin:0 5px"
          @click="handleDefault(i.type)"
        >
          {{ i.name }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import Editor from "./Editor";
import Worker from "./field.worker.js";
import mixins from "./mixins";
export default {
  name: "DistIndex",
  components: { Editor },
  mixins: [mixins],
  data() {
    return {
      editorCode: "",
      editorOptions: {
        fontSize: 14,
        lang: "json",
      },
      formlist: [
        {
          key: "name",
          type: "string",
          length: 5,
        },
      ],
      defaultlist: [
        {
          name: "GEOJSON",
          type: "geojson",
        },
        {
          name: "三维专题树",
          type: "topic3d",
        },
      ],
      typelist: [
        {
          label: "整数类型",
          value: "int",
        },
        {
          label: "浮点类型",
          value: "float",
        },
        {
          label: "中文字符",
          value: "string",
        },
        {
          label: "英文字符",
          value: "ystring",
        },
        {
          label: "颜色类型",
          value: "color",
        },
        {
          label: "布尔类型",
          value: "bool",
        },
        {
          label: "链接类型",
          value: "url",
        },
        {
          label: "日期类型",
          value: "date",
        },
        {
          label: "省级名称",
          value: "province",
        },
        {
          label: "市级名称",
          value: "city",
        },
        {
          label: "县级名称",
          value: "county",
        },
      ],
      hasID: true,
      hasChildren: true,
      reslength: 20,
      resdeep: 1,
      loading: false,
      searchVal: "",
      clonedefaultlist: [],
    };
  },
  watch: {
    searchVal(newVal) {
      if (newVal) {
        this.defaultlist = this.clonedefaultlist.filter((i) => {
          return ~i.name.toLowerCase().indexOf(newVal.toLowerCase());
        });
      } else {
        this.defaultlist = JSON.parse(JSON.stringify(this.clonedefaultlist));
      }
    },
  },
  mounted() {
    this.clonedefaultlist = JSON.parse(JSON.stringify(this.defaultlist));
  },
  methods: {
    handleDefault(type) {
      let res = null;
      switch (type) {
        case "geojson":
          res = this.getGeoJson();
          break;
        case "topic3d":
          res = this.get3DTopicTree();
          break;
      }
      this.editorCode = JSON.stringify(res, null, 2);
    },
    removeHandler(i) {
      if (i.hover) {
        const index = this.formlist.indexOf(i);
        this.formlist.splice(index, 1);
        this.$Message.success("删除成功！");
      }
    },
    async copyHandler() {
      try {
        await navigator.clipboard.writeText(this.editorCode);
        this.$Message.success("复制成功！");
      } catch {
        this.$Message.error("复制失败！");
      }
    },
    mouseenter(i) {
      this.$set(i, "hover", true);
    },
    mouseleave(i) {
      this.$set(i, "hover", false);
    },
    handleAdd() {
      this.formlist.push({
        key: "name",
        type: "string",
        length: 5,
      });
    },
    handleSubmit() {
      this.loading = true;
      const list = this.formlist.reduce((prev, cur) => {
        const index = prev.findIndex((i) => {
          return i.key === cur.key;
        });
        if (!~index) {
          prev.push(cur);
        }
        return prev;
      }, []);
      const worker = new Worker();
      worker.postMessage({
        list: list,
        reslength: this.reslength,
        resdeep: this.resdeep - 1,
        hasID: this.hasID,
        hasChildren: this.hasChildren,
      });
      worker.onmessage = (e) => {
        const data = e.data.data;
        const res = {
          status: 200,
          message: "success",
          data: data,
        };
        this.editorCode = JSON.stringify(res, null, 2);
        this.loading = false;
      };
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  .form {
    padding: 1rem;
    .option-field {
      display: flex;
      align-items: center;
      & > div {
        display: flex;
        align-items: center;
        border-left: 1px solid #dcdee2;
        padding: 0 0.5rem;
        span {
          font-weight: 1000;
          margin-right: 0.3rem;
        }
      }
      & > div:last-child {
        border-right: 1px solid #dcdee2;
      }
    }
  }
  .result {
    position: relative;
    width: 50%;
    height: 60%;
    border: 1px solid #dcdee2;
    margin: auto;
    .copy {
      display: inline-block;
      position: absolute;
      top: 0;
      right: 0;
      background: #dcdee2;
      padding: 0.2rem 1.2rem;
      color: #000;
      cursor: pointer;
    }
  }
  .default-container {
    position: absolute;
    top: 0;
    right: 0;
    width: 20%;
    min-height: 20%;
    padding: 1rem;
    background: #dcdee2;
    border-radius: 0.2rem;
    &-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: left;
      padding-left: 0.5rem;
      line-height: 1;
      font-size: 1rem;
      font-weight: 1000;
      margin-bottom: 1rem;
      & > span {
        margin-left: -1.5rem;
      }
    }
    &-title::before {
      content: "";
      width: 3px;
      height: 1rem;
      background: #515a6e;
    }
    .default-list {
      display: flex;
    }
  }
}

/deep/ .ivu-form-item {
  display: flex !important;
  justify-content: center;
}
/deep/ .ivu-col {
  padding: 0 1rem;
  display: flex;
  align-items: center;
  & > i {
    font-size: 1.5rem;
    color: #ff0000;
    margin-left: 0.5rem;
    cursor: pointer;
  }
  & > span {
    display: flex;
    align-items: center;
    padding: 8px 7px;
    background: #f8f8f9;
    border-radius: 4px;
    font-weight: 400;
    color: #515a6e;
    text-align: center;
    line-height: 1;
    font-size: inherit;
    border: 1px solid #dcdee2;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-right: 0 !important;
  }
}
</style>
