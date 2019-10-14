import React, { useState, createRef } from "react";
import * as CM from "codemirror";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/monokai.css";
import "codemirror/theme/3024-day.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/sql/sql.js";
// import "./js_modify.js";

import "codemirror/addon/hint/show-hint.css";

import "codemirror/addon/hint/show-hint";

import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/search.js";
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/edit/closebrackets.js";
import "codemirror/addon/comment/comment.js";
import "codemirror/addon/wrap/hardwrap.js";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/keymap/sublime.js";
import "codemirror/mode/javascript/javascript.js";

import "./cellblock.less";

export class KnexInput extends React.Component {
  editorAnchor = createRef();
  editor = null;
  componentDidMount() {
    this.editor = CM.fromTextArea(this.editorAnchor.current, {
      mode: "javascript",
      keyMap: "sublime",
      autoCloseBrackets: true,
      matchBrackets: true,
      showCursorWhenSelecting: true,
      tabSize: 2,
      theme: "3024-day"
    });
    this.editor.setOption("extraKeys", {
      "Shift-Enter": this.handleChange
    });
    this.editor.setValue(this.props.value || "");
  }

  // componentDidUpdate() {
  //   const { value } = this.props;
  //   this.editor.setValue(value || "");
  // }

  handleChange = (ins, change) => {
    // if (change.origin !== "setValue")
    this.props.onChange && this.props.onChange(ins.getValue(), change);
  };

  render() {
    return (
      <div className="codemirror-wrapper">
        <textarea className="codemirror" ref={this.editorAnchor} />
      </div>
    );
  }
}

class KnexOutput extends React.Component {
  editorAnchor = createRef();
  editor = null;
  componentDidMount() {
    this.editor = CM.fromTextArea(this.editorAnchor.current, {
      mode: "sql",
      keyMap: "sublime",
      autoCloseBrackets: true,
      matchBrackets: true,
      tabSize: 2,
      theme: "3024-day",
      readOnly: true
    });
    this.editor.setValue(this.props.value || "");
  }

  componentDidUpdate() {
    const { value } = this.props;
    console.log(value);
    this.editor.setValue(value || "");
  }

  render() {
    return (
      <div className="codemirror-wrapper">
        <textarea className="codemirror" ref={this.editorAnchor} />
      </div>
    );
  }
}

const Prompt = ({ value, mode }) => (
  <div className="prompt">
    {mode} [<span className="identifier">{value}</span>]:{" "}
  </div>
);

export const CellBlock = ({ convertInstance, id, removeSelf }) => {
  const [code, setCode] = useState("");
  const formatValue = convertInstance(code);
  console.log(formatValue);
  return (
    <div className="cellblock">
      <div className="removeSelf" onClick={removeSelf}>
        remove
      </div>
      <div className="cellblock_content">
        <div className="cellblock_content_unit">
          <Prompt value={id} mode="IN"></Prompt>
          <KnexInput onChange={setCode} />
        </div>
        {formatValue && (
          <div className="cellblock_content_unit">
            <Prompt value={id} mode="OUT"></Prompt>
            <KnexOutput value={formatValue}></KnexOutput>
          </div>
        )}
      </div>
    </div>
  );
};
