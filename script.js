const runeData = [
  { rune: "ᚠ", name: "Fehu" },
  { rune: "ᚢ", name: "Uruz" },
  { rune: "ᚦ", name: "Thurisaz" },
  { rune: "ᚨ", name: "Ansuz" },
  { rune: "ᚱ", name: "Raidho" },
  { rune: "ᚲ", name: "Kenaz" },
  { rune: "ᚷ", name: "Gebo" },
  { rune: "ᚹ", name: "Wunjo" },
  { rune: "ᚺ", name: "Hagalaz" },
  { rune: "ᚾ", name: "Nauthiz" },
  { rune: "ᛁ", name: "Isa" },
  { rune: "ᛃ", name: "Jera" },
  { rune: "ᛇ", name: "Eihwaz" },
  { rune: "ᛈ", name: "Perthro" },
  { rune: "ᛉ", name: "Algiz" },
  { rune: "ᛊ", name: "Sowilo" },
  { rune: "ᛏ", name: "Tiwaz" },
  { rune: "ᛒ", name: "Berkano" },
  { rune: "ᛖ", name: "Ehwaz" },
  { rune: "ᛗ", name: "Mannaz" },
  { rune: "ᛚ", name: "Laguz" },
  { rune: "ᛜ", name: "Ingwaz" },
  { rune: "ᛞ", name: "Dagaz" },
  { rune: "ᛟ", name: "Othala" }
];

const maxCastLength = 8;

const ritualSequences = [
  {
    key: "ᚺᚾᚲᛊ",
    label: "Open the sealed vault door",
    kind: "door-open",
    message: "Failure named. Need witnessed. Fire bound. Dawn withheld. The door opens reluctantly."
  },
  {
    key: "ᛊᚲᚾᚺ",
    label: "Close and reseal the vault door",
    kind: "door-close",
    message: "Dawn withheld. Fire buried. Need silenced. Failure sealed. The door closes stone by stone."
  },
  {
    key: "ᛗᚨᚾᛃᛖᛈᚦᛊ",
    label: "Stabilize the Primer Anchor",
    kind: "anchor-stop",
    message: "Bell, Chain, Eye, Flame. The four rings align. The Anchor stabilizes and the pulse weakens."
  },
  {
    key: "ᛊᚦᛈᛖᛃᚾᚨᛗ",
    label: "Wake the Primer Anchor",
    kind: "anchor-start",
    message: "The stabilizing logic reverses. The Anchor wakes and grey-amber light begins to breathe."
  }
];

const knownWrongCombinations = {
  "ᚺᚾᛊᚲ": {
    title: "Premature Dawn",
    text: "The machine tries to claim the sun before the flame is bound. All creatures within 10 ft of the mechanism make a DC 13 Constitution save. Fail: 2d6 radiant damage and blinded until end of next turn. Success: half damage, not blinded."
  },
  "ᛊᚾᚲᚺ": {
    title: "Inverted Dawn",
    text: "The sequence begins with the thing that never came. Advance the Anchor escalation by 1 round. The sickroom above worsens immediately."
  },
  "ᚲᚲᚲᚲ": {
    title: "Overfed Flame",
    text: "The bowl grows white-hot. The acting character takes 1d6 radiant damage. The next stabilization check made before the end of their next turn is DC 16 instead of DC 14."
  },
  "ᚾᚾᚾᚾ": {
    title: "Need Loop",
    text: "The machine repeats the idea of need until it becomes panic. One Dawnhall Desperate tries to flee or interfere. Social checks against locals are made at disadvantage until someone calms them."
  },
  "ᛗᚨᛗᚨ": {
    title: "Bell Echo",
    text: "A low bell-note rolls through the vault. One Light-Sick Echo appears near the Bell plinth at the next initiative count 20."
  },
  "ᚾᛃᚾᛃ": {
    title: "Chain Mislock",
    text: "The Chain logic closes without a target. Choose one creature near a plinth. They are restrained by spectral links until they spend an action and pass DC 13 Athletics or Acrobatics."
  },
  "ᛖᛈᛈᛖ": {
    title: "Eye Opened Backwards",
    text: "The hidden thing looks back. Reveal one secret clue, but the acting character takes 1d6 psychic or radiant damage from the memory shock."
  },
  "ᚦᛊᚦᛊ": {
    title: "Giant Force Pointed at the Sun",
    text: "The Flame logic overloads. The Anchor flares. Creatures within 10 ft make DC 13 Constitution save. Fail: 2d6 radiant damage. Success: half."
  },
  "ᚠᚢᚦᚨ": {
    title: "Scholar's Alphabet",
    text: "The machine rejects a simple alphabetic pattern. No damage, but it marks the attempt as childish: the next rune cast shudders before being accepted or rejected."
  }
};

const clues = [
  "The machine does not ask for victory. It asks for the order of failure.",
  "The last answer is not what the makers reached. It is what they were trying to reach.",
  "The middle of the door sequence turns danger into method. Look for the idea of a flame that is held, shaped, or contained.",
  "Anchor clue: each plinth has two runes. The stopping sequence is not four single ideas, but four paired mechanisms: Bell, Chain, Eye, Flame.",
  "The machine gives no further help. The rest must come from the Dawnhall, the plinths, and Ixa's memory."
];

const punishmentDeck = [
  "Radiant feedback. The acting character takes 1d6 radiant damage. Their next stabilization check before the end of their next turn is DC 16.",
  "Anchor backlash. Creatures within 10 ft of the Anchor make a DC 13 Constitution save. Fail: 2d6 radiant damage. Success: half.",
  "Grey pulse. Advance the Anchor escalation by 1 round.",
  "Sickroom worsens. Ilya shouts from above: 'Someone is seizing. Stop the pulse.' Social checks against locals are at disadvantage until someone helps.",
  "Echo manifestation. A Light-Sick Echo appears near the nearest uncalibrated plinth at initiative count 20.",
  "Panic break. One Dawnhall Desperate moves toward the stairs or grabs the nearest PC unless calmed with an action.",
  "Lens crack. One calibrated ring flickers. The next failed stabilization check also deals 1d6 radiant damage to one adjacent creature.",
  "Memory wound. Each PC hears a voice from above asking for dawn. DC 13 Wisdom save or disadvantage on the next attack roll or ability check."
];

const secretDeck = [
  "Secret: the vault was not built for storage. It was a second-attempt site created after the first ritual failed.",
  "Secret: the makers did not leave because they succeeded. They sealed the vault because they understood the design was dangerous.",
  "Secret: the Anchor is not failing. It is doing what it was designed to do. The design is the problem.",
  "Secret: someone with Spire document access gave Maerin the map and sequence. She was used as a delivery mechanism.",
  "Secret: the sealed containment alcove is connected to Dawnborn research. Ixa recognizes the logic before she understands why.",
  "Secret: the plinths are not decorative. Bell, Chain, Eye, and Flame are the emergency shutoff grammar.",
  "Secret: the second attempt failed quietly, not catastrophically. That means the Anchor can be stabilized if the party preserves the evidence."
];

const app = document.getElementById("app");
const ring = document.getElementById("runeRing");
const channels = document.getElementById("channels");
const bowlContent = document.getElementById("bowlContent");
const statusBox = document.getElementById("status");
const sequenceBox = document.getElementById("sequenceBox");
const hintBox = document.getElementById("hintBox");
const hintButton = document.getElementById("hintButton");
const clearButton = document.getElementById("clearButton");
const resetButton = document.getElementById("resetButton");
const fullscreenButton = document.getElementById("fullscreenButton");
const forceOpenButton = document.getElementById("forceOpenButton");
const forceCloseButton = document.getElementById("forceCloseButton");
const startAnchorButton = document.getElementById("startAnchorButton");
const stopAnchorButton = document.getElementById("stopAnchorButton");
const punishmentButton = document.getElementById("punishmentButton");
const secretButton = document.getElementById("secretButton");
const doorState = document.getElementById("doorState");
const anchorState = document.getElementById("anchorState");
const anchorBanner = document.getElementById("anchorBanner");

let currentCast = [];
let clueIndex = 0;
let punishmentIndex = 0;
let secretIndex = 0;
let doorOpen = false;
let anchorActive = false;

function runeName(rune) {
  return runeData.find((item) => item.rune === rune)?.name || "Unknown";
}

function sequenceToText(sequence) {
  return sequence.map((rune) => `${rune} ${runeName(rune)}`).join("<br>");
}

function renderRing() {
  const existingButtons = ring.querySelectorAll("button.rune");
  existingButtons.forEach((button) => button.remove());

  const count = runeData.length;
  const radius = "calc(min(37vw, 325px) - 2.2rem)";

  runeData.forEach((item, index) => {
    const angle = (360 / count) * index;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "rune";
    button.style.setProperty("--a", `${angle}deg`);
    button.style.setProperty("--r", radius);
    button.setAttribute("aria-label", `${item.rune} ${item.name}`);
    button.dataset.rune = item.rune;
    button.dataset.name = item.name;
    button.innerHTML = `<span>${item.rune}</span><small>${item.name}</small>`;
    button.addEventListener("click", () => castRune(item.rune, item.name, button));
    ring.appendChild(button);
  });
}

function renderChannels() {
  channels.innerHTML = "";

  for (let i = 0; i < maxCastLength; i += 1) {
    const slot = document.createElement("div");
    slot.className = "channel" + (currentCast[i] ? " full" : "");
    slot.textContent = currentCast[i] || "·";
    channels.appendChild(slot);
  }
}

function updateSequenceBox() {
  if (currentCast.length === 0) {
    sequenceBox.innerHTML = "none";
    bowlContent.textContent = "empty";
    return;
  }

  const lines = currentCast.map((rune, index) => `${index + 1}. ${rune} ${runeName(rune)}`);
  sequenceBox.innerHTML = lines.join("<br>");
  bowlContent.textContent = currentCast.join(" ");
}

function updateState() {
  doorState.textContent = doorOpen ? "open" : "sealed";
  anchorState.textContent = anchorActive ? "active" : "dormant";
  anchorBanner.textContent = anchorActive ? "ANCHOR ACTIVE" : "ANCHOR DORMANT";
  app.classList.toggle("opened", doorOpen);
  app.classList.toggle("anchor-active", anchorActive);
}

function setStatus(text, kind = "") {
  statusBox.className = "status" + (kind ? ` ${kind}` : "");
  statusBox.textContent = text;
}

function castRune(rune, name, button) {
  if (currentCast.length >= maxCastLength) {
    wrongCombination("Overfull Bowl", "The bowl is already full. Clear the current cast before adding more runes.");
    return;
  }

  currentCast.push(rune);
  pulseButton(button);
  renderChannels();
  updateSequenceBox();

  const key = currentCast.join("");
  const exact = ritualSequences.find((sequence) => sequence.key === key);

  if (exact) {
    resolveRitual(exact);
    return;
  }

  const possiblePrefix = ritualSequences.some((sequence) => sequence.key.startsWith(key));

  if (!possiblePrefix && currentCast.length >= 4) {
    const knownWrong = knownWrongCombinations[key];
    if (knownWrong) {
      wrongCombination(knownWrong.title, knownWrong.text);
    } else {
      wrongCombination(
        "Rejected Combination",
        "The bowl turns once, then stops. Teeth fail to catch somewhere inside the stone. Deploy a punishment if the table needs pressure."
      );
    }
    return;
  }

  setStatus(`${rune} ${name} drops into the bowl. The mechanism waits for the next rune.`);
}

function pulseButton(button) {
  button.classList.remove("cast", "bad");
  void button.offsetWidth;
  button.classList.add("cast");
}

function resolveRitual(sequence) {
  if (sequence.kind === "door-open") {
    openDoor(false);
  }

  if (sequence.kind === "door-close") {
    closeDoor(false);
  }

  if (sequence.kind === "anchor-stop") {
    stopAnchor(false);
  }

  if (sequence.kind === "anchor-start") {
    startAnchor(false);
  }

  setStatus(sequence.message, "good");
}

function wrongCombination(title, text) {
  app.classList.remove("wrong");
  void app.offsetWidth;
  app.classList.add("wrong");
  setStatus(`${title}. ${text}`, "bad");
}

function openDoor(forced = true) {
  doorOpen = true;
  updateState();
  if (forced) setStatus("GM control: the vault door opens.", "good");
}

function closeDoor(forced = true) {
  doorOpen = false;
  updateState();
  if (forced) setStatus("GM control: the vault door closes and seals.", "good");
}

function startAnchor(forced = true) {
  anchorActive = true;
  updateState();
  if (forced) setStatus("GM control: the Primer Anchor starts. Grey-amber light begins to pulse.", "bad");
}

function stopAnchor(forced = true) {
  anchorActive = false;
  updateState();
  if (forced) setStatus("GM control: the Primer Anchor stabilizes. Echoes vanish. The sick above stop worsening.", "good");
}

function clearCast() {
  currentCast = [];
  renderChannels();
  updateSequenceBox();
  setStatus("The bowl clears. The machine waits for a new combination.");
}

function resetMachine() {
  currentCast = [];
  clueIndex = 0;
  punishmentIndex = 0;
  secretIndex = 0;
  doorOpen = false;
  anchorActive = false;
  hintBox.textContent = "No clue revealed.";

  document.querySelectorAll("button.rune").forEach((button) => {
    button.classList.remove("cast", "bad");
  });

  renderChannels();
  updateSequenceBox();
  updateState();
  setStatus("The mechanism resets. All twenty-four rune-tokens can be cast into the bowl.");
}

function revealClue() {
  const clue = clues[Math.min(clueIndex, clues.length - 1)];
  hintBox.textContent = clue;
  clueIndex += 1;
}

function deployPunishment() {
  const punishment = punishmentDeck[punishmentIndex % punishmentDeck.length];
  punishmentIndex += 1;
  setStatus(`GM punishment: ${punishment}`, "bad");
}

function revealSecret() {
  const secret = secretDeck[secretIndex % secretDeck.length];
  secretIndex += 1;
  setStatus(`GM secret: ${secret}`, "secret");
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

hintButton.addEventListener("click", revealClue);
clearButton.addEventListener("click", clearCast);
resetButton.addEventListener("click", resetMachine);
fullscreenButton.addEventListener("click", toggleFullscreen);
forceOpenButton.addEventListener("click", () => openDoor(true));
forceCloseButton.addEventListener("click", () => closeDoor(true));
startAnchorButton.addEventListener("click", () => startAnchor(true));
stopAnchorButton.addEventListener("click", () => stopAnchor(true));
punishmentButton.addEventListener("click", deployPunishment);
secretButton.addEventListener("click", revealSecret);

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (key === "h") revealClue();
  if (key === "c") clearCast();
  if (key === "r") resetMachine();
  if (key === "f") toggleFullscreen();
  if (key === "o") openDoor(true);
  if (key === "l") closeDoor(true);
});

renderRing();
renderChannels();
updateSequenceBox();
updateState();
