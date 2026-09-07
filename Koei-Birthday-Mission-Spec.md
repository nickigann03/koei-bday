# Koei's Birthday Mission — Brainstorm & Build Spec

A complete plan for the scavenger-hunt/escape-the-day experience. Review it, then hand the **DIGITAL APP** section to Antigravity to build. The **PHYSICAL** and **CONTENT** sections are for you to prep.

---

## 1. Concept

The day is framed as **"Rocket's Birthday Mission."** A cute rocket (with Koei's face in the window) needs power to fly. Each puzzle she solves powers Rocket up by one **crystal** — and the crystals are secretly the digits to **the Vault** (her gift box), which she cracks at dinner.

You drive her clue-to-clue, so she's never alone: each puzzle's job is to reveal **where you're going next**, which she doesn't know until she solves it. Escalates from gentle in the morning to the big reveal at dinner.

The theme is deliberately **not** racing (that's saved as Saturday's twist). Tone is playful + cute + clean, matching her aesthetic.

---

## 2. The day → puzzle map

| Time | Stop | Puzzle | Type | Reveals | Gives |
|------|------|--------|------|---------|-------|
| 9:30 | Pickup + car breakfast | Puzzle 1 — "SILVER BANGLE" acrostic | Physical (printed) | Zocraft (bangle workshop) | Digit 1 |
| 10:30 | Zocraft — make matching bangles | — | — | — | — |
| 12:30 | The Five — lunch, dessert, gifts | Puzzle 2 — Crossword | Digital (iPad) | Sunway Pyramid (gel blaster) | Digit 2 |
| ~2:30 | Gel blaster — Bomb Battle, Sunway | — | — | — | — |
| ~4:30 | Home to wash up + change | — | — | — | — |
| 6:00 | Poblano — dinner | Puzzle 3 — Murdle | Digital (iPad) | Confirms the "cake" is here → Vault | Digit 3 |
| 6:00 | Poblano — the Vault | Vault unlock | Digital or physical | Gift + Saturday teaser | — |

She wears the bangle she made that morning to the Vault dinner.

---

## 3. The Vault mechanic

- A real lockable gift box with a **3-digit combination padlock** (cheap, off Shopee).
- Each of the 3 puzzles ends by revealing **one digit** of the code (styled as "power crystal charged: ▮").
- A small progress indicator (3 crystal slots) shows how many she's collected.
- She collects digits 1 & 2 during the day; the 3rd comes from the Murdle at the table, then she enters all 3 → the box opens → main gift + a sealed envelope: *"One more mission… clear Saturday."*
- **You choose the 3-digit code** (e.g., a meaningful date). Each digit is assigned to a puzzle in the app config.

---

## PHYSICAL COMPONENTS (you prep these)

## 4. Puzzle 1 — "SILVER BANGLE" acrostic (printed, done in the car)

She likes crosswords, but a true interlocking grid is fiddly in a moving car. Use a **double acrostic** that reveals the two words **SILVER** and **BANGLE** — so she reads "silver bangle" and realises you're off to make matching ones.

Six clues, each about *you two*. She writes each answer. Two hidden reads come out of the six answers:
- **First letter of each answer**, top to bottom → **B A N G L E**
- **One highlighted letter inside each answer**, top to bottom → **S I L V E R**

```
B _ _ _ _   (a highlighted cell in this word = S)
A _ _ _ _   (= I)
N _ _ _ _   (= L)
G _ _ _ _   (= V)
L _ _ _ _   (= E)
E _ _ _ _   (= R)
```
Bottom of card: *"Two words. Rocket's first stop is where they meet. Crystal 1 charged: [digit]."*

**Constraint when you write it:** each answer must start with the B/A/N/G/L/E letter *and* contain the matching S/I/L/V/E/R letter somewhere to highlight.

**Easier fallback if that's too constrained:** make the first letters spell **BANGLE** only, then add a one-line anagram at the bottom — *"Unscramble: R E V L I S"* → **SILVER**. Same reveal, far easier to fill.

Sign the card: *"— Mission Control 🚀"*

## 5. Other physical props
- **Opening card** — rocket illustration with Koei's face in the window; "Mission: Birthday Adventure! Rocket needs 3 crystals to reach the final destination."
- **Clean bouquet** from her usual florist (white/pastel, no red roses).
- **Instax camera** — bring your own; snap her making the bangle. Tuck one polaroid into the Vault.
- **The Vault** — gift box + 3-digit padlock.
- **Sealed "Saturday" envelope** — inside the Vault.
- **Oreo cheesecake** — for the dinner reveal.
- **Hint cards** (optional) — a peelable hint on the back of each physical clue (see §10).

---

## DIGITAL APP (hand this section to Antigravity)

## 6. App overview

Build a **single-page web app** ("Rocket Mission Control") that runs on an iPad, **fully offline** (no external CDNs/APIs — bundle all assets and fonts locally). It contains the two digital puzzles plus the Vault, in this order:

**Boot / mission intro → Stage A (Crossword) → Stage B (Murdle) → Vault unlock → finale.**

> Puzzle 1 (the acrostic) is physical/offline, so it's not in the app. The app opens Stage A after lunch and Stage B at dinner.

All editable content lives in a single **CONFIG object** at the top of the code (see §9) so it can be changed without touching logic. Stages are gated: Stage B stays locked until you advance it (you can open it at the table), so she doesn't run ahead.

## 7. Stage specs

### Stage A — Crossword (reveals Sunway Pyramid)
A small crossword whose clues are **facts about you / about the two of you** ("how well do you know me"). Solving the whole grid unlocks a reveal.

- Grid + clues come from config (list of entries: answer, clue, direction, coordinates).
- Keep it **small and warm** — ~6–8 answers, gentle clues. She types answers into the grid; cells validate.
- **Win condition:** all answers correct.
- **On win → reveal panel:** a short riddle from config that points to **Sunway Pyramid**, e.g. *"Next stop: where a giant lion guards the mall, and you can shoot me without hurting me. Go there."* + "Crystal 2 charged" + the digit.
- *(Alternative reveal if you prefer: highlight one cell per answer that together spell the destination. The riddle is simpler to build — recommended.)*
- **Hint:** reveal one crossword answer, or the first letter of the currently selected clue.

### Stage B — Murdle deduction (dinner finale → cues the Vault)
A one-grid logic puzzle: **The Case of the Missing Birthday Cake.** She deduces WHO took it, WHAT they carried it in, and WHERE they hid it. The WHERE resolves to **Poblano** — i.e. the cake's been *right here* all along — which cues the Vault.

**Categories (3×3), all from config:**
- WHO: `S1`, `S2`, `S3` (swap for her plushies or 3 friends)
- CARRIED IN: `Glitter tin`, `Nutella jar`, `Balloon bag`
- HIDDEN AT: `Poblano` · `The Five` · `Sunway` — *(a callback: the three places she went today)*

**Clues (from config, shown as a list):**
1. Whoever carried the **balloon bag** was seen at **Sunway**.
2. The **glitter tin** was spotted at **The Five**.
3. `S2` can't stand chocolate — never touched the **Nutella jar**.
4. `S3` was nowhere near **Poblano**.
5. `S2` came home covered in glitter.

**Solution (the app validates against this):**
- `S1` — Nutella jar — **Poblano** ✅
- `S2` — Glitter tin — The Five
- `S3` — Balloon bag — Sunway

*(Verified uniquely solvable. Clue 3 is a redundant "helper" that makes it gentler; drop it or add a red-herring 4th category to make it harder.)*

**UI:** a Murdle-style grid of cells she marks by tapping (tap cycles blank → ✗ → ✓ → blank), plus three final selectors: *Who? / What? / Where?*
- **Win condition:** the three final answers match the solution. (Don't require the grid marks — just the conclusion.)
- **On win:** reveal *"The cake's been here at Poblano all along. Time to unlock it."* + "Crystal 3 charged" + digit → routes to the Vault screen.
- **Hint:** reveal one clue's implication at a time.
- **Difficulty (config flag):** `gentle` keeps clue 3; `hard` removes it and adds a 4th category + one red-herring clue.

### Vault unlock screen
- Three digit inputs (big keypad or number spinners).
- On correct code (from config): one orchestrated **rocket-launch animation** (the single big motion moment) → final message: *"Mission complete. One more mission… clear Saturday. 🏁"*
- On wrong code: gentle shake + "Not quite — check your crystals," never harsh.
- **Hidden override** for you (e.g., long-press the rocket logo 3s) that jumps to any stage, in case of a tech hiccup.

## 8. Design direction (for the builder)

Ground it in *cute rocket adventure meets her clean, minimal aesthetic* — not racing, not generic.

**Palette (named hex):**
- `--sky` `#EAF2FB` — pale morning-sky background
- `--cloud` `#FFFFFF` — cards/surfaces
- `--ink` `#22314F` — soft deep-navy text
- `--rocket` `#FF4D5E` — clean bright red, primary action/accent
- `--sun` `#FFC24B` — star/crystal glow (earned crystals)
- `--mint` `#37D0A6` — correct/success
- `--lilac` `#A98CF0` — secondary playful accent

**Type:** headings in a rounded friendly sans (e.g., **Fredoka** or **Baloo 2**); body/UI in a clean neutral sans (e.g., **Inter** or **Nunito Sans**). Self-host both for offline use; fall back to system rounded/sans.

**Layout:** a single centered "mission card" on the soft sky background, with a small rocket + 3 crystal slots as the persistent progress indicator at the top. Large tap targets (iPad). Left-aligned body text, centered hero.

**Motion:** keep everything calm except **two** moments — a small "crystal charges + rocket nudges upward" beat when a stage is solved, and the **full launch** on Vault unlock. No section fade-ins, no hover flourishes.

**Tone/copy:** warm, playful, sentence case, short. Errors are gentle and encouraging.

## 9. Technical spec (for the builder)

- **Stack:** single self-contained HTML file (or a tiny React build) with **no external network calls** — must run offline on iPad Safari.
- **No browser storage APIs** required; keep linear state in memory.
- **Config object at top** holding: the crossword entries, all Murdle categories + clues + solution, the crossword reveal riddle, the two crystal digits (Stage A & B), the final Vault code, difficulty flag, and the finale message.
- **Stage locking:** Stage B inaccessible until you advance it; the hidden override bypasses this.
- **Responsive:** iPad portrait + landscape; big touch targets; readable at arm's length.
- **Accessibility floor:** visible focus, sufficient contrast, `prefers-reduced-motion` respected (disable launch animation, keep the state change).
- **Hint system:** per §7, one gentle hint mechanism per stage.

## 10. Hint / lifeline system (whole day)

Escape-room fans love the "aha," but nobody wants to be stuck on their birthday. For every puzzle:
- Physical clue (acrostic): a peelable hint on the back, or "radio Mission Control" (she texts you) for a nudge.
- Digital stages: the built-in hint buttons above.
- Front-load the easy puzzle (acrostic), keep the crossword and Murdle gentle, make sure she always feels clever.

---

## 11. Saturday — Race Day (the twist)

Lighter on puzzles. One reveal that her colleagues are already there → **go-karting** → podium (cheap medals + a "P1 — Birthday Girl" printout) → **Haidilao**. This is where the racing payoff finally lands. Heads-up: most kart tracks ban skirts/open-toe shoes, so steer her Saturday outfit without spoiling it.

---

## 12. CONTENT YOU NEED TO FILL IN

Puzzle 1 — acrostic (printed):
- [ ] 6 "about us" answers whose first letters spell **BANGLE** (and, if using the fancy version, that each contain an **S/I/L/V/E/R** letter to highlight) + a one-line clue for each

Puzzle 2 — crossword (Stage A):
- [ ] 6–8 "facts about me / about us" (answer + clue each) for the grid
- [ ] The reveal riddle that points to Sunway Pyramid (or use the sample)

Puzzle 3 — Murdle (Stage B):
- [ ] 3 suspect names (her plushies / 3 friends) to replace S1–S3
- [ ] Confirm the "carried in" items

Vault:
- [ ] The 3-digit code
- [ ] Which digit each puzzle reveals (order)
- [ ] The main gift + the Saturday envelope wording

Global:
- [ ] Difficulty: gentle / medium / hard
- [ ] Confirm the look (palette/type above, or adjust)
- [ ] The two digital reveal lines (crossword + Murdle) in your own voice

---

*Once you've filled in §12, Antigravity has everything it needs for the digital app, and you have your checklist for the physical props.*
