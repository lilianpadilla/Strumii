export type Chord = {
    key: string
    suffix: string
}

export type Lesson = {
    title: string
    chords: Chord[]
    description: string[]
    expDuration: number
}