import P from 'parsimmon';
import runtime from './runtime';
const _ = P.whitespace;
const opt_ = P.optWhitespace;
const str = P.string;
// TODO Op Exp, Fn Application, Return Value from Functions
// Op Exp is blocked by implementing symbol/true "Expression" (fun app, other op exp, etc)
const Lang = P.createLanguage({
	ValidProgram: (r) => P.alt(r.Expression,
							   r.ForLoop,
							   r.VarDecl,
							   r.FuncDecl)
						  .sepBy(_),
	Literal: (r) => P.alt(r.Note, r.Chord),
	Note: function() {
		return P.regexp(/[1-7](s|e|q|h|w)(\.?)/).node("Note");
	},
	Chord: (r) => str('<')
				   .then((r.Note.skip(opt_)).atLeast(2)).desc("Chord needs at least two notes")
				   .skip(str('>'))
				   .node("Chord"),
	ExpressionSequence: (r) => r.Expression.sepBy(_),
	Statement: (r) => P.alt(r.FuncDecl, r.VarDecl, r.ForLoop),
	Expression: (r) => P.alt(r.OpExp, r.Literal, r.VarExp),
	Block: (r) => str("{")
					.skip(opt_)
					.then(P.alt(r.Statement, r.Expression).sepBy(_))
					.skip(opt_)
					.skip(str("}")),
	ForLoop: (r) => P.seqObj(
						str("for").then(_),
						['iterator', P.letters],
						_.then(str("in")).then(_),
						['collection', P.letters],
						opt_,
						['loopBody', r.Block],
					).node("ForLoop"),
	VarDecl: (r) => P.seqObj(
						str("let").then(_),
						['varName', P.letters],
						_.then(str("=")).then(_),
						['varDef', r.Expression],
					).node("VarDecl"),
	FuncDecl: (r) => P.seqObj(
						str("fn").then(_),
						['funcName', P.letters],	
						opt_.then(str("(")),
						['argList', P.letters.sepBy1(str(',').skip(opt_))], 
						opt_.then(str(")")).then(opt_),
						['funcBody', r.Block],
					).node("FuncDecl"),
	VarExp: () => str("$")
					.then(P.letters)
					.node("VarExp"),
	OpExp: (r) => P.seqObj(
					str("op").skip(opt_),
					["left", r.Expression],
					opt_,
					["op", r.ValidOp],
					opt_,
					["right", r.Expression]
				).node("OpExp"),
	// TODO more ops later
	ValidOp: () => P.alt(str("+"), // Sequential Appending
						 str("-"), // Subtracting somehow
						 str(">"), // If a list is >, or if a scale degree is higher than
						 str("<"), // If a list is <, or if a scale degree is less than
						).node("ValidOp")

});	



const Parse = (inputString) => {
	let parseResult = Lang.ValidProgram.parse(inputString);
	if (parseResult.status === false) {
		console.log("parse error: ", parseResult.expected);
		return `Parse Error: expected ${parseResult.expected}`
	}
	console.log(parseResult);
	runtime(parseResult);
	return parseResult.toString();
}

export default Parse;
