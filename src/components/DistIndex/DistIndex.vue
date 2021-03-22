<!--
 * @Author: weicong
 * @Date: 2021-03-10 17:39:06
 * @LastEditTime: 2021-03-22 14:40:40
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
      <FormItem prop="inline" v-for="(i, index) in formlist" :key="index">
        <Row>
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
    </div>
  </div>
</template>

<script>
import Editor from "./Editor";
import Mock from "mockjs";
export default {
  name: "DistIndex",
  components: { Editor },
  data() {
    return {
      formInline: {},
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
    };
  },
  methods: {
    handleAdd() {
      this.formlist.push({
        key: "name",
        type: "string",
        length: 5,
      });
    },
    handleSubmit() {
      const rules = this.generateRule(this.reslength, this.resdeep - 1);
      const data = Mock.mock(rules);
      const res = {
        status: 200,
        message: "success",
        data: data,
      };
      this.editorCode = JSON.stringify(res, null, 2);
    },
    generateRule(length, deep) {
      const res = [];
      for (let i = 0; i < length; i++) {
        const item = {};
        this.formlist.map((i) => {
          if (this.hasID) {
            item["id"] = Mock.Random.guid();
          }
          item[i.key] = this.getType(i.type, Number(i.length));
          if (this.hasChildren && deep > 0) {
            item["children"] = this.generateRule(
              Mock.Random.integer(0, length),
              deep - 1
            );
          }
        });
        res.push(item);
      }
      return res;
    },
    getType(type, len) {
      let res = "";
      switch (type) {
        case "string":
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
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
    flex: 1;
    margin: 0 1rem 1rem 1rem;
    width: 50%;
    border: 1px solid #dcdee2;
  }
}

/deep/ .ivu-form-item {
  display: flex !important;
  justify-content: center;
}
/deep/ .ivu-col {
  padding: 0 1rem;
  display: flex;
  & > span {
    display: flex;
    align-items: center;
    padding: 4px 7px;
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
