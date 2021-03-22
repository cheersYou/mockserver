<template>
  <div class="editor-container" ref="editorRef"></div>
</template>
<script>
import ace from "ace-builds";
import "ace-builds/webpack-resolver";
import ResizeObserver from "resize-observer-polyfill";

const Events = [
  "blur",
  "input",
  "change",
  "changeSelectionStyle",
  "changeSession",
  "copy",
  "focus",
  "paste",
];
export default {
  name: "Editor",
  props: {
    value: {
      type: String,
      required: true,
    },
    lang: {
      type: String,
      default: "javascript",
    },
    theme: {
      type: String,
      default: "chrome",
    },
    options: Object,
    placeholder: String,
    readonly: Boolean,
  },
  data() {
    return {
      contentBackup: "", // 旧的value值记录
      roHandleIns: null, // resize监听实例
      editorIns: null, // 编辑器实例
    };
  },
  emits: ["update:value", "init", ...Events],
  watch: {
    value(val) {
      if (this.contentBackup !== val) {
        this.editorIns.setValue(val, 1);
        this.contentBackup = val;
      }
    },
    theme(val) {
      this.editorIns.setTheme("ace/theme/" + val);
    },
    options(val) {
      this.editorIns.setOptions(val);
    },
    readonly(val) {
      this.editorIns.setReadOnly(val);
    },
    placeholder(val) {
      this.editorIns.setOption("placeholder", val);
    },
  },
  mounted() {
    this.initEditor();
  },
  beforeDestroy() {
    this.roHandleIns && this.roHandleIns.disconnect();
    this.editorIns && this.editorIns.destroy();
  },
  methods: {
    initEditor() {
      const editor = (this.editorIns = ace.edit(this.$el, {
        placeholder: this.placeholder,
        readOnly: this.readonly,
        value: this.value,
        mode: "ace/mode/" + this.lang,
        theme: "ace/theme/" + this.theme,
        ...this.options,
      }));
      editor.session.setTabSize(4);
      this.contentBackup = this.value;
      editor.on("change", () => {
        const content = editor.getValue();
        this.contentBackup = content;
        this.$emit("update:value", content);
      });
      Events.forEach((evt) => {
        if (typeof this.$listeners[evt] === "function") {
          editor.on(evt, this.$emit.bind(this, evt));
        }
      });
      this.roHandleIns = new ResizeObserver(() => editor.resize());
      this.roHandleIns.observe(this.$el);
      this.$emit("init", editor);
    },
    focus() {
      this.editorIns.focus();
    },
    blur() {
      this.editorIns.blur();
    },
    selectAll() {
      this.editorIns.selectAll();
    },
    capitalize(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
};
</script>
<style scoped>
.editor-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
