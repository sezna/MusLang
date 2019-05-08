import React from 'react';
import Editor from 'react-simple-code-editor';
import './input.css';

export default class Input extends React.Component {
	testForLoop = "for x in y { 1q. }";
	testVarDecl = "let x = 5q";
	testStrings = this.testForLoop + '\n' + this.testVarDecl;
	
	state = {
		inputText: this.testStrings
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
