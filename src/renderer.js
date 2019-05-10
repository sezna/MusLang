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
    characters[0] = notes[Number(characters[0])];

    let durations = {
        'w': 16,
        'h': 8,
        'q': 4,
        'e': 2,
        's': 1
    }
    characters[1] = durations[characters[1]];
    if (characters[2] === '.') {
        characters[1] = characters[1] + 1;
    }
    characters[1] = String(characters[1]);
    delete characters[2];
    console.log("converted", str, "to", characters.join(''));
    return characters.join('');
}

export default render;