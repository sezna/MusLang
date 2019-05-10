import render from './renderer'
const interpret = (parseResult)  => {
    // let mainFunction = parseResult.value.filter((x) => x.value.funcName == "main")[0];
    // if (mainFunction === []) {
    //     return "No main function."
    // }
    let {modifiedVarEnv, modifiedFuncEnv} = evaluateFunction(parseResult.value);
    let mainFunction = modifiedFuncEnv["main"];
    let {retVal} = evaluate(mainFunction, modifiedVarEnv, modifiedFuncEnv);
    console.log("retVal", retVal)
    if (retVal === undefined) {
        return "Main function doesn't return a value";
    }
    console.log("main returned", retVal.retVal);
    if (retVal && retVal.retVal && retVal.retVal.retVal) {
        retVal = retVal.retVal;
    }
    return render(retVal.retVal);
    //evaluateFunction(mainFunction.value.funcBody, modifiedVarEnv, modifiedFuncEnv);
};

const evaluateFunction = (func, varEnv = {}, funcEnv = {}) => {
    let myRetVal = undefined;
    for (const stmt of func) {
        console.log("stmt", stmt);
        let {retVal, modifiedVarEnv, modifiedFuncEnv} = evaluate(stmt, varEnv, funcEnv);
        varEnv = modifiedVarEnv;
        funcEnv = modifiedFuncEnv;
        myRetVal = retVal;
    }
    return {retVal: myRetVal, modifiedVarEnv: varEnv, modifiedFuncEnv: funcEnv};
}

const evaluate = (stmt, varEnv, funcEnv) => {
    console.log("evaluating: ", stmt);
    let retVal = undefined;
    switch (stmt.name) {
        case "VarDecl":
            varEnv[stmt.value.varName] = evaluate(stmt.value.varDef, varEnv, funcEnv).retVal;
            break;
        case "Note":
            console.log("evaluating note:", stmt)
            retVal = stmt;
            break;
        case "Chord":
            console.log("Shape of chord: ", stmt.value);
            retVal = stmt.value;
            break;
        case "OpExp":
            retVal = handleOp(stmt.value, varEnv, funcEnv);
            break;
        case "VarExp":
            console.log("var exp", stmt)
            console.log("var env is: ", );
            retVal = varEnv[stmt.value];
            break;
        case "FuncDecl":
            funcEnv[stmt.value.funcName] = {value: {funcName: stmt.value.funcName, argList: stmt.value.args, body: stmt.value.funcBody}, name: "FuncApp"};
            break;
        case "FuncApp":
            let { value } = funcEnv[stmt.value.funcName];
            let {argList, body} = value;
            if (argList && stmt.value.argList && argList.length !== stmt.value.argList.length) {
                console.log("Wrong number of parameters supplied to function", stmt.value.funcName);
            }
            let argEnv = {}
            if (argList !== undefined) {
                for (let i in argList) {
                    argEnv[argList[i]] = stmt.value.argList[i];
                }
            }
            let {retVal: myRetVal} = evaluateFunction(body, {...varEnv, ...argEnv}, funcEnv);
            retVal = myRetVal;
            break;
        case "ForLoop":
            let {iterator, collection, loopBody} = stmt.value;
            console.log("Collection is", collection);
            let result = evaluate(collection, varEnv, funcEnv);
            console.log("result is", result);
            collection = result.retVal;
            for (const i of collection) {
                let {modifiedVarEnv, modifiedFuncEnv} = evaluateFunction(loopBody, {...varEnv, [iterator]: i}, funcEnv);
                varEnv = modifiedVarEnv;
                funcEnv = modifiedFuncEnv;
            }
            break;
        case "Return":
            retVal = evaluate(stmt.value.returnVal, varEnv, funcEnv);
            break;
        default:
            console.log("Unimplemented evaluation: ", stmt.name);
    }
    console.log("returning ", retVal, stmt);
    return {
        retVal: retVal,
        modifiedVarEnv: varEnv,
        modifiedFuncEnv: funcEnv
    };
    
} 

const handleOp = (opExp, varEnv, funcEnv) => {
    let {left, op, right} = opExp;
    left = evaluate(left, varEnv, funcEnv).retVal;
    right = evaluate(right, varEnv, funcEnv).retVal;

    switch (op.value) {
        case "+":
            return addLiterals(left, right);
        default:
            console.log("Unimplemented op in OpExp:", op);
            break;
    }
}

const addLiterals = (left, right) => {
    switch(left.name) {
        case "Note":
            if (right.name === "Note") {
                return [left, right]
            }
            else {
                // Else we are adding a note to a chord, so we push the note into the chord
                return [...right, left]
            }

        default:
            // Adding chord to chord
            if (right.name === "Note") {
                return [...left, right]
            }
            else {
                // Else we are adding a note to a chord, so we push the note into the chord
                return [...left, ...right]

            }  
        }
}
export default interpret;