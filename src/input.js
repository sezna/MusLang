import React from 'react';
import Editor from 'react-simple-code-editor';
import './input.css';

export default class Input extends React.Component {
	initialText = 
`fn main () { 
	for x in <1q 2q 3q> { $x }
	let x = 5q
	return twinkleTwinkle()
}
fn twinkleTwinkle() {
	let toReturn = <1q 1q 5q 5q 6q 6q 5q>
	let toReturn = op $toReturn + <4q 4q 3q 3q 2q 2q 1w>
	return $toReturn
}`;
	
	state = {
		inputText: this.initialText
	}
	
	onChange = (e) => {
		this.setState({ inputText: e });
	}
	// TODO custom syntax highlighting
	render = (props) => <div> 
				<Editor
					className="codeEditor"
					value={this.state.inputText}
					onValueChange={this.onChange}
					padding={10}
					highlight={x => x}
					style={{ fontFamily: '"Fira code", "Fira Mono", monospace',
          					fontSize: 12 }}
				/>
				<button onClick={() => this.props.getInput(this.state.inputText)}>Compile</button>
				</div>

	
}
