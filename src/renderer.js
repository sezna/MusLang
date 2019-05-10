import abcjs from 'abcjs';

const render = (notes) => {
    let ABCText = "M:4/4\nL:1/16\n";
    console.log("renderer is looking at", notes)
    for (const note of notes) {
        ABCText = ABCText + " " + formatNote(note.value);
    }
    abcjs.renderAbc("paper", ABCText);

    return ABCText;
}

const formatNote = (str) => {
    let characters = str.split('');
    let notes = ['', 'C', 'D', 'E', 'F', 'G', 'A', 'B'];
    let numbers = [1,2,3,4,5,6,7, '^', '_'];
    if (numbers.indexOf(characters[0]) < 0) {
        characters.unshift("=");
    }
    console.log("characters is", characters);
    characters[1] = notes[Number(characters[1])];
    // ^ 1 e .
    // 0 1 2 3    
    let durations = {
        'w': 16,
        'h': 8,
        'q': 4,
        'e': 2,
        's': 1
    }
    characters[2] = durations[characters[2]];
    if (characters[3] === '.') {
        characters[2] = characters[2] + 1;
    }
    console.log("now characters is", characters);
    characters[1] = String(characters[1]);
    console.log("converted", str, "to", characters.join(''));
    if (characters[0] === '=') {
        characters.splice(0, 1);
    }
    return characters.join('');
}

export default render;