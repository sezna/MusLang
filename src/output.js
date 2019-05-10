import React from 'react';
const Output = (props) => <div className="output">
		<div style={{height: "500px", width: "500px"}} id="paper" />
		{props.output}
	</div>

export default Output;
