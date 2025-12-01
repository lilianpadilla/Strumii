import chords from "~/utils/guitar"
// console.log(chords)

// https://fretboardfrenzy.com/guitar-tuning-frequencies-charts/
const standardOpenFreqs = [82.4, 110.0, 146.83, 196.0, 246.94, 329.6];


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

export function getPitchFromPositionAndString(stringPosition, stringNote) {
  const newStringPosition = `${stringPosition}P`;
  const newStringNote = stringNote.toLowerCase()



  return null;
}
// export function getExpectedFreqs(
//   key: string,
//   suffix: string
// ): (number | null)[] {
//   const fretStr = getFret(key, suffix);
//   if (!fretStr) {
//     // fallback: all nulls if chord not found
//     return Array(6).fill(null);
//   }

//   const positions = fretToList(fretStr);

//   return positions.map((fret, stringIndex) => {
//     if (fret === null) return null; // muted string
//     const openFreq = standardOpenFreqs[stringIndex];
//     return openFreq * Math.pow(2, fret / 12);
//   });
// }
