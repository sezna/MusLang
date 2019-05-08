// `runtime`, which needs to be renamed, adds declarations to the environment
let runtime = (parseResult) => {
	let varEnv = {};
	let funcEnv = {};
	let warnings = [];
	if (parseResult.status === false) {
		console.log("Failed parse passed to runtime");
		return "Failed parse";
	}
	let parseResults = parseResult.value;
	console.log("iterating on", parseResults);
	for (var result of parseResults) {
		switch (result.name) {
			case "FuncDecl":
				let { funcName, ...rest }  = result.value;
				funcEnv[funcName] = rest;
				break;
			case "VarDecl":
				let { varName, varDef } = result.value;
				varEnv[varName] = varDef;
				break;
			default:
				warnings.push(`Unused ${result.name} at line ${result.start.line} column ${result.start.column}`)
				break;
		}
		console.log("Runtime is inspecting: ", result);
	}
	return { warnings: warnings,
			 funcEnv: funcEnv,
			 varEnv: varEnv };

}

// `compile` takes the object generated by the parser and determines which order things should be evaluated and evaluates them.
const compile = (parseResult) => {

}

// `evaluate` is a recursive function which takes an expression and an environment and returns a new environment
const evaluate = (result, parentVarEnv, parentFuncEnv) => {
	console.log("evaluating", result);
	// Runtime is only needed inside of a block.
		switch (result.name) {
			case "Return":
				let { retExp } = result.value;
				let { warnings: retWarnings, result: retResult}  = evaluate(retExp, parentVarEnv, parentFuncEnv);
				return { error: false, funcEnv: parentVarEnv, varEnv: parentFuncEnv, warnings: retWarnings, result: retResult};
				break;
			case "VarExp":
//				let varVal = localVarEnv[result.value];
				// If it isn't in the local env, check the parent env. 
				let varVal = parentVarEnv[result.value];
				if (varVal === undefined) {
					// TODO
					return { error: true, funcEnv: {}, varEnv: {}, warnings: 
					 [ `ERROR: Undefined variable ${result.value} on line ${result.start.line} column ${result.start.column}` ], result: null};
				}
				return evaluate(varVal); // it could be an expression or a literal, so we need to evaluate it 
				break;
			case "Literal":
				return { error: false, funcEnv: parentFuncEnv, varEnv: parentVarEnv, warnings: [], result: [] }
				break;
		    // Things that involve blocks:
			case "ForLoop":
				let { iterator, collection, loopBody } = result.value;
				console.log("Evaluating ForLoop:", iterator, collection, loopBody)
				// TODO insert iterator into block's scope
				let res = evalBlock(loopBody, parentVarEnv, parentFuncEnv);
				return res;
			default: 
				return { error: true, funcEnv: {}, varEnv: {}, warnings: 
						[ `ERROR: Unimplemented evaluation type: ${result.name}` ] };
		}

} 

// `evalBlock` will be needed to evaluate a block, stepping through it, recursively if necessary.
// It will function like `main` but can be used on any function.
const evalBlock = (parseResults, parentVarEnv, parentFuncEnv) => {
	let { funcEnv: localFuncEnv,
		  varEnv: localVarEnv,
		  warnings: warnings } = runtime(parseResults);
	// Give precedence to local environment
	// Construct new object from global environment, insert local envs into them
	let varEnv = { ...parentVarEnv, ...localVarEnv };
	let funcEnv = { ...parentFuncEnv, ...localFuncEnv};
	let blockWarnings = [];
	for (const parseResult of parseResults) {
		let { error, funcEnv: newFuncEnv, varEnv: newVarEnv, warnings, result} = evaluate(parseResult);
		console.log("parse result is: ", evaluate(oarseResult))
		blockWarnings = [...blockWarnings, ...warnings];
		varEnv = { ...varEnv, ...newVarEnv };
		funcEnv = { ...funcEnv, ...newFuncEnv };
	}
	
	return { error: error, funcEnv: funcEnv, varEnv: varEnv, warnings: blockWarnings, result: result}
}

const main = (parseResult) => {
	let { funcEnv: globalFuncEnv,
		  varEnv:  globalVarEnv,
		  warnings: warnings } = runtime(parseResult);
	if (globalFuncEnv["main"] === undefined) {
		console.log("Could not find main function.");
		return "Could not find main function";
	}

	// I should iterate through the lines in main, evaluating as I go.
	// Evaluate should only evaluate one expression at a time. If it encounters
	// Another nested block, it creates a runtime and steps through that.
	// Don't need to worry about main's args here, they can never be used.
	console.log("Main is", globalFuncEnv["main"]["funcBody"]);
	let mainParseResult = globalFuncEnv["main"]["funcBody"];
	for (const result of mainParseResult) {
		let { funcEnv, varEnv, warnings } = evaluate(result, globalVarEnv, globalFuncEnv);
	}

	console.log("warnings: ", warnings);
	console.log("Global func env is:", globalFuncEnv);
 	
}	

export default main;
