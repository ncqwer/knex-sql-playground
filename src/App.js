import React, { useState, useRef, useEffect } from "react";
import "./App.less";
import sqlFormatter from "sql-formatter";
import { CellBlock } from "./component/cellblock.js";
import Knex from "knex";

import { uniq } from "ramda";

function App() {
  const knex = useRef(null);
  const [cellblockIds, setCellblockIds] = useState(["hello", "world"]);
  const [newId, setNewId] = useState("");
  useEffect(() => {
    knex.current = Knex({ client: "mysql" });
  }, []);
  return (
    <div className="App">
      {renderCellblocks()}
      <div className="blockAdd">
        <input
          type="text"
          value={newId}
          onChange={e => setNewId(e.target.value)}
        />

        <div className="addIcon" onClick={handleAddNewBlock}>
          add
        </div>
      </div>
    </div>
  );

  //render function
  function renderCellblocks() {
    return cellblockIds.map(id => (
      <CellBlock
        convertInstance={handleConvert}
        key={id}
        id={id}
        removeSelf={handleRemoveSelf(id)}
      ></CellBlock>
    ));
  }

  //handle function
  function handleConvert(code) {
    if (!knex.current) return "";
    let output = null;
    try {
      // const blocks = code.split("\n\n");
      // blocks[blocks.length - 1] = `return (${
      //   blocks[blocks.length - 1]
      // }).toString()`;
      /* eslint-disable no-new-func */
      output = new Function("knex", "trx", code)(knex.current);
      if (typeof output !== "string")
        output = {
          error: "result is not string,\n maybe you forget call tostring method"
        };
    } catch (e) {
      output = { error: e.message };
    }
    return output.error
      ? "[error]: " + output.error
      : sqlFormatter.format(output);
  }

  function handleRemoveSelf(targetId) {
    return () => setCellblockIds(prev => prev.filter(id => id !== targetId));
  }

  function handleAddNewBlock() {
    return setCellblockIds(prev => uniq([...prev, newId]));
  }
}

export default App;
