import React from 'react';
import './content.css';
import Parsimmon from 'parsimmon';
import Input from './input';
import Output from './output';
import Parse from './parse';
export default class Content extends React.Component {
	state = {
		output: "Awaiting input..."
	}

	render() {
		return <div className="content">
			<Input getInput={this.getInput} />
			<Output output={this.state.output} />
		</div>
	}

	getInput = (text) => {
		this.setState({ ...this.state, input: text, output: Parse(text) });
	}

	parse(text) {
		return text;
	}
}

