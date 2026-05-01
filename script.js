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

const correctSequence = ["ᚺ", "ᚾ", "ᚲ", "ᛊ"];

const meanings = {
  "ᚺ": "the breaking, what broke the sky",
  "ᚾ": "the need, what drove the hand",
  "ᚲ": "the bound flame, what caged the fire",
  "ᛊ": "the sun, what never came"
};

const hints = [
  "The machine does not ask for victory. It asks for the order of failure.",
  "The last answer is not what the makers reached. It is what they were trying to reach.",
  "The middle of the sequence turns danger into method. Look for the idea of a flame that is held, shaped, or contained."
];

const noMoreHints = "The machine gives no further help. The rest must come from the clues found in the Dawnhall.";

const app = document.getElementById("app");
const ring = document.getElementById("runeRing");
const channels = document.getElementById("channels");
const bowlContent = document.getElementById("bowlContent");
const statusBox = document.getElementById("status");
const sequenceBox = document.getElementById("sequenceBox");
const hintBox = document.getElementById("hintBox");
const hintButton = document.getElementById("hintButton");
const resetButton = document.getElementById("resetButton");
const fullscreenButton = document.getElementById("fullscreenButton");

let accepted = [];
let hintIndex = 0;
let opened = false;

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

  for (let i = 0; i < correctSequence.length; i += 1) {
    const slot = document.createElement("div");
    slot.className = "channel" + (accepted[i] ? " full" : "");
    slot.textContent = accepted[i] || "·";
    channels.appendChild(slot);
  }
}

function updateSequenceBox() {
  if (accepted.length === 0) {
    sequenceBox.innerHTML = "none";
    bowlContent.textContent = "empty";
    return;
  }

  const lines = accepted.map((rune, index) => {
    const name = runeData.find((item) => item.rune === rune)?.name || "Unknown";
    return `${index + 1}. ${rune} ${name}`;
  });

  sequenceBox.innerHTML = lines.join("<br>");
  bowlContent.textContent = accepted.join(" ");
}

function setStatus(text, kind = "") {
  statusBox.className = "status" + (kind ? ` ${kind}` : "");
  statusBox.textContent = text;
}

function castRune(rune, name, button) {
  if (opened) return;

  const expected = correctSequence[accepted.length];

  if (rune === expected) {
    accepted.push(rune);
    button.classList.add("used");
    renderChannels();
    updateSequenceBox();

    if (accepted.length < correctSequence.length) {
      setStatus(
        `The bowl turns. ${rune} ${name} is accepted: ${meanings[rune]}. A channel opens inside the door.`,
        "good"
      );
    } else {
      openDoor();
    }

    return;
  }

  button.classList.remove("bad");
  void button.offsetWidth;
  button.classList.add("bad");
  setStatus(
    `The bowl turns once, then stops. ${rune} ${name} is rejected. Teeth fail to catch somewhere inside the stone.`,
    "bad"
  );
}

function openDoor() {
  opened = true;
  app.classList.add("opened");
  setStatus(
    "The fourth rune-token disappears into the final channel. The ring rotates once. Counterweights shift. The machine opens reluctantly.",
    "good"
  );
}

function resetMachine() {
  accepted = [];
  opened = false;
  hintIndex = 0;
  app.classList.remove("opened");
  hintBox.textContent = "No hint revealed.";

  document.querySelectorAll("button.rune").forEach((button) => {
    button.classList.remove("used", "bad");
  });

  renderChannels();
  updateSequenceBox();
  setStatus("The mechanism resets. All twenty-four rune-tokens can be cast into the bowl.");
}

function revealHint() {
  if (hintIndex >= hints.length) {
    hintBox.textContent = noMoreHints;
    return;
  }

  hintBox.textContent = hints[hintIndex];
  hintIndex += 1;
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

hintButton.addEventListener("click", revealHint);
resetButton.addEventListener("click", resetMachine);
fullscreenButton.addEventListener("click", toggleFullscreen);

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (key === "h") revealHint();
  if (key === "r") resetMachine();
  if (key === "f") toggleFullscreen();
});

renderRing();
renderChannels();
updateSequenceBox();
