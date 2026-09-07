export const CONFIG = {
  // Global settings
  difficulty: 'gentle', // 'gentle' or 'hard'
  vaultCode: '19082026', // Anniversary date: 19.8.2026
  
  // Design palette - Little Einsteins vibe!
  colors: {
    sky: '#87CEEB', // Brighter, playful sky blue
    cloud: '#FFFFFF',
    ink: '#333333', // Softer black for better contrast on bright colors
    rocket: '#FF3B30', // Vibrant cartoon red
    sun: '#FFCC00', // Bright sunny yellow
    mint: '#4CD964', // Playful green
    lilac: '#AF52DE', // Fun purple accent
    grass: '#34C759', // Grassy green for landscapes
  },

  // Final Reveal Message
  finaleMessage: "Mission complete. One more mission… clear Saturday. 🏁",

  // ----------------------------------------------------
  // MISSION FINDING BIRTHDAY ACTIVITY #1
  // ----------------------------------------------------
  stageA: {
    crystalDigit: '1',
    // Part 1: Wordle
    wordle: {
      word: 'SILVER',
      successMessage: "You're not done yet, solve this puzzle next for the next clue!"
    },
    // Part 2: Acrostic
    acrostic: {
      // The target vertical word is spelled by the first letter of each answer
      targetWord: 'BRACELET',
      clues: [
        { answer: 'BILLIE', clue: "Nicki's fav artist" },
        { answer: 'RACING', clue: "One of Koei's favourite hobby" },
        { answer: 'APPLEJUICE', clue: "One of Nicki's fav drink" },
        { answer: 'CATS', clue: "Nicki's pets" },
        { answer: 'EGGPLANT', clue: "One of Nicki's fav veg (hint: it is not green)" },
        { answer: 'LYING', clue: "Something Nicki sucks at doing (you can always tell when she is ....)" },
        { answer: 'ENGINEER', clue: "Nicki's job title (she might work in IT but she's an IT .......)" },
        { answer: 'THAI', clue: "This is one of our fav cuisines" }
      ],
      revealMessage: "You got it! Your first stop is for a SILVER BRACELET!"
    }
  },

  // ----------------------------------------------------
  // STAGE B: MURDLE (The Birthday Murder)
  // ----------------------------------------------------
  stageB: {
    crystalDigit: '3',
    story: "Disaster has struck! A murder has occurred on the eve of the birthday! Use the clues below to deduce the killer, the murder weapon, and where they left the body. Hint: The clues don't use names—you must tap the cards and read their traits to decode them!",
    categories: {
      who: ['The Milkman', 'The Baker', 'The Neighbor'],
      what: ['Heavy Package', 'Stale Baguette', 'Picnic Basket'],
      where: ['The Porch', 'The Mailbox', 'El Camino Restaurant']
    },
    descriptions: {
      who: {
        'The Milkman': {
          text: "A towering figure who delivers fresh milk every morning. He claims he was dropping off a crate.",
          traits: "RIGHT-HANDED • VERY TALL"
        },
        'The Baker': {
          text: "Always covered in flour and smelling of fresh pastries. She was seen running from the scene.",
          traits: "LEFT-HANDED • SMELLS LIKE BREAD"
        },
        'The Neighbor': {
          text: "A notoriously nosy individual who is always watching the street through his half-closed blinds.",
          traits: "RIGHT-HANDED • WEARS GLASSES"
        }
      },
      what: {
        'Heavy Package': {
          text: "A densely packed box wrapped in brown paper and twine, heavy enough to bludgeon someone.",
          traits: "HEAVY • CARDBOARD"
        },
        'Stale Baguette': {
          text: "A loaf of bread that has been left out for at least three days. It is rock solid and deadly.",
          traits: "MEDIUM-WEIGHT • LONG"
        },
        'Picnic Basket': {
          text: "A classic woven basket with a checkered cloth. It's the perfect size for smuggling a severed head.",
          traits: "LIGHT-WEIGHT • WOVEN"
        }
      },
      where: {
        'The Porch': {
          text: "The covered area right by the front door. It provides some shelter and is highly visible.",
          traits: "OUTDOORS • COVERED"
        },
        'The Mailbox': {
          text: "Located down by the street, surrounded by tall bushes that provide excellent cover for anyone lurking.",
          traits: "OUTDOORS • SECLUDED"
        },
        'El Camino Restaurant': {
          text: "A lively spot in town known for its amazing fajitas and margaritas.",
          traits: "INDOORS • SMELLS LIKE TACOS"
        }
      }
    },
    clues: [
      "The suspect who is LEFT-HANDED did not go to an OUTDOORS location.",
      "The WOVEN item was found INDOORS.",
      "The VERY TALL suspect was seen carrying the HEAVY item.",
      { 
        isCipher: true,
        encryptedText: "Wkh ORQJ lwhp zdv ghilqlwhob qrw wdnhq wr wkh VHFOXGHG orfdwlrq.",
        shift: 3
      },
      "An anonymous tip just came in: The victim's body was definitely found at the INDOORS location!"
    ],
    // The correct final deduction that unlocks the stage
    solution: {
      who: 'The Baker',
      what: 'Picnic Basket',
      where: 'El Camino Restaurant'
    },
    // The message revealed after correctly solving
    revealMessage: "You cracked the case! The Baker murdered the victim with a Picnic Basket and left the body at El Camino Restaurant! Crystal #3 is yours! 💎\n\nWait... El Camino Restaurant? That's right! Get ready, because your birthday dinner tonight is at a MEXICAN RESTAURANT! 🌮🎉"
  }
};
