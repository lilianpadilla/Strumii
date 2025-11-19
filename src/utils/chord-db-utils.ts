import chords from "~/utils/guitar"
// console.log(chords)

export function getChordName(key: string, suffix: string): string {
    return `${key} ${suffix}`
}

export function getFret(key: string, suffix: string): string {
    // console.log(key, suffix)
    const list = chords.chords[key]; 
    // console.log(list)
    if(!list) return null;
    const chordObj = list.find(c => c.suffix === suffix);
    // console.log(chordObj)
    if(!chordObj) return null;
    return chordObj.positions[0].frets
}

export function getAllChords(): string[] {
    return chords.keys
}

export function getAllSuffixes(): string[] {
    return chords.suffixes
}

// fretToList("x33452") -> [null, 3, 3, 4, 5, 2]
export function fretToList(fret: string): (number | null)[] {
  const list: (number | null)[] = [];

  for (let char of fret) {
    if (char.toLowerCase() === "x") {
      list.push(null);
    } else {
      list.push(Number(char));
    }
  }
  return list;
}

