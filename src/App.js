import React, { useState } from 'react';


export default (props) => {
  const [ count, setCount ] = useState(0);
  return <div>
    APP
    <button onClick={() => setCount(count + 1)}>Add</button>
    <div>{count}</div>
    <button onClick={() => setCount(count - 1)}>Sub</button>
  </div>
}
