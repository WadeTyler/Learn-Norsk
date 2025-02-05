import {Question, Word} from "@/types/Types";

export const norskLetters: string[] = [
  "æ",
  "ø",
  "å"
]

const words: Word[] = [
  {
    id: 1,
    norsk: "Hund",
    eng: "Dog",
    image: "https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    norsk: "Katt",
    eng: "Cat",
    image: "https://images.unsplash.com/photo-1472491235688-bdc81a63246e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    norsk: "Fugl",
    eng: "Bird",
    image: "https://images.unsplash.com/photo-1486365227551-f3f90034a57c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    norsk: "Fisk",
    eng: "Fish",
    image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=2024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 5,
    norsk: "jeg",
    eng: "I"
  },
  {
    id: 6,
    norsk: "liker",
    eng: "like",
  },
  {
    id: 7,
    norsk: "min",
    eng: "my"
  },
  {
    id: 8,
    norsk: "egg",
    eng: "egg",
  },
  {
    id: 9,
    norsk: "hunden",
    eng: "the dog",
  }
]

const question1: Question = {
  id: 1,
  type: "image-choice",
  title: "Select the word for 'Dog'",
  options: [
    words[0],
    words[1],
    words[2],
    words[3]
  ],
  answer: [
    words[0]
  ]
}

const question2: Question = {
  id: 2,
  type: "sentence-forming",
  title: "I like my dog",
  options: [
    words[4],
    words[5],
    words[6],
    words[7],
    words[2],
    words[0],
    words[8]
  ],
  answer: [
    words[4], words[5], words[8], words[6]
  ]
}

const question3: Question = {
  id: 3,
  type: "sentence-typing",
  title: "I like my dog",
  options: [],
  answer: [
    words[4], words[5], words[8], words[6]
  ]
};

export const questions: Question[] = [
  question1,
  question2,
  question3
]

