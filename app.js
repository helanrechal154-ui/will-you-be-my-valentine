// --------------------
// Progress bar
// --------------------
const bar = document.getElementById("bar");
let progress = 10;

function bumpProgress(add){
  progress = Math.min(100, progress + add);
  bar.style.width = progress + "%";
}

// --------------------
// Personalize name
// --------------------
const nameInput = document.getElementById("nameInput");
const partnerName = document.getElementById("partnerName");
const partnerName2 = document.getElementById("partnerName2");

document.getElementById("startBtn").addEventListener("click", () => {
  const n = (nameInput.value || "Sudu").trim();
  partnerName.textContent = n;
  partnerName2.textContent = n;
  bumpProgress(12);
  document.querySelector("#quiz").scrollIntoView({ behavior: "smooth" });
});

// --------------------
// From name in letter
// --------------------
const fromName = document.getElementById("fromName");
fromName.textContent = "Helan";

// --------------------
// QUIZ DATA (your exact questions)
// --------------------
const quizData = [
  {
    q: "What is our fav place to go when we were doing foundation?",
    options: ["Fab", "Diyatha park", "Weli park", "Campus"],
    answerIndex: 2
  },
  {
    q: "Which is our favorite date when you came back to Sri Lanka?",
    options: ["First day - Grand Bell", "Temple date", "Marino Beach Hotel dinner date", "Playdium"],
    answerIndex: 3
  },
  {
    q: "What is our anniversary date?",
    options: ["Feb 4th", "October 10th", "September 27th", "August 22nd"],
    answerIndex: 3
  },
  {
    q: "Do you remember how many roses were in the first bouquet you bought me?",
    options: ["Two roses", "One rose", "Five roses", "Three roses"],
    answerIndex: 4
  },
  {
    q: "Do you remember the very first gift I bought for you?",
    options: ["Casio Watch", "A Ring", "Bracelet", "Necklace"],
    answerIndex: 1
  }
];

// --------------------
// QUIZ (one-by-one + unlock)
// --------------------
const quizBox = document.getElementById("quizBox");
const quizResult = document.getElementById("quizResult");
const revealBtn = document.getElementById("revealBtn");

const wrongMsgs = [
  "Ado Sudu 😭 try again!",
  "Nooo babe 😌 think again!",
  "Hmm wrong… but cute try 💗",
  "Eyy Sudu 😂 not that one!",
  "Wrong machan 😭 (jk) try again!"
];

let qIndex = 0;

function renderOneQuestion(){
  quizResult.textContent = "";
  revealBtn.classList.add("hidden");
  quizBox.innerHTML = "";

  const item = quizData[qIndex];

  const div = document.createElement("div");
  div.className = "q";
  div.innerHTML = `
    <h4>${qIndex + 1}/${quizData.length} — ${item.q}</h4>
    <div class="choices" id="choices"></div>
    <p class="tiny">Pick the correct one to continue 💞</p>
  `;

  const choices = div.querySelector("#choices");

  item.options.forEach((opt, j) => {
    const label = document.createElement("label");
    label.className = "choice";
    label.innerHTML = `
      <input type="radio" name="q${qIndex}" value="${j}" />
      <span>${opt}</span>
    `;
    label.addEventListener("click", () => handleAnswer(j));
    choices.appendChild(label);
  });

  quizBox.appendChild(div);
}

function handleAnswer(chosenIndex){
  const item = quizData[qIndex];

  if(chosenIndex === item.answerIndex){
    const isLast = qIndex === quizData.length - 1;

    quizResult.textContent = isLast
      ? "Perfect Sudu 💯 You unlocked everything! 💗"
      : "Correct 😌💞 Next one…";

    bumpProgress(isLast ? 30 : 10);

    setTimeout(() => {
      if(isLast){
        unlockSections();
        revealBtn.classList.remove("hidden");
      } else {
        qIndex++;
        renderOneQuestion();
      }
    }, 650);

  } else {
    quizResult.textContent = wrongMsgs[Math.floor(Math.random()*wrongMsgs.length)];
    const card = quizBox.querySelector(".q");
    card.classList.remove("shake");
    void card.offsetWidth; // restart animation
    card.classList.add("shake");
  }
}

function resetQuizFlow(){
  qIndex = 0;
  renderOneQuestion();
  quizResult.textContent = "";
  bumpProgress(-5);
}

function unlockSections(){
  ["games","comic","letter","video"].forEach(id => {
    document.getElementById(id).classList.remove("locked");
  });
}

document.getElementById("resetQuiz").addEventListener("click", resetQuizFlow);

document.getElementById("submitQuiz").addEventListener("click", () => {
  quizResult.textContent = "Just tap an answer, Sudu 😌💗";
});

revealBtn.addEventListener("click", () => {
  document.querySelector("#games").scrollIntoView({ behavior: "smooth" });
});

renderOneQuestion();

// --------------------
// GAME 1: Memory Hearts
// --------------------
const memoryEl = document.getElementById("memory");
const memoryStatus = document.getElementById("memoryStatus");

const symbols = ["💗","💗","💜","💜","✨","✨","🌙","🌙"];
let deck = [];
let first = null;
let lock = false;
let matchedCount = 0;

function shuffle(arr){
  for(let i = arr.length-1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function setupMemory(){
  deck = shuffle([...symbols]).map((s, idx) => ({ s, idx, revealed:false, matched:false }));
  first = null;
  lock = false;
  matchedCount = 0;
  memoryStatus.textContent = "Match all pairs 😌";
  renderMemory();
}

function renderMemory(){
  memoryEl.innerHTML = "";
  deck.forEach(card => {
    const t = document.createElement("div");
    t.className = "tile";
    if(card.revealed) t.classList.add("revealed");
    if(card.matched) t.classList.add("matched");
    t.textContent = (card.revealed || card.matched) ? card.s : "❔";
    t.addEventListener("click", () => flip(card.idx));
    memoryEl.appendChild(t);
  });
}

function flip(idx){
  if(lock) return;
  const c = deck[idx];
  if(c.matched || c.revealed) return;

  c.revealed = true;
  renderMemory();

  if(!first){
    first = c;
    return;
  }

  if(first.s === c.s){
    first.matched = true;
    c.matched = true;
    matchedCount += 2;
    first = null;
    renderMemory();
    if(matchedCount === deck.length){
      memoryStatus.textContent = "You matched everything ✅";
      bumpProgress(10);
    }
  } else {
    lock = true;
    setTimeout(() => {
      first.revealed = false;
      c.revealed = false;
      first = null;
      lock = false;
      renderMemory();
    }, 700);
  }
}

document.getElementById("memoryReset").addEventListener("click", setupMemory);
setupMemory();

// --------------------
// GAME 2: Catch the Heart
// --------------------
const arena = document.getElementById("arena");
const heartBtn = document.getElementById("heartBtn");
const scoreEl = document.getElementById("score");
let score = 0;

function rand(min, max){
  return Math.floor(Math.random()*(max-min+1))+min;
}

function moveHeart(){
  const pad = 10;
  const w = arena.clientWidth;
  const h = arena.clientHeight;
  const x = rand(pad, Math.max(pad, w-60));
  const y = rand(pad, Math.max(pad, h-60));
  heartBtn.style.left = x + "px";
  heartBtn.style.top = y + "px";
}

heartBtn.addEventListener("mouseenter", moveHeart);
heartBtn.addEventListener("click", () => {
  score++;
  scoreEl.textContent = score;
  moveHeart();
  if(score === 10){
    bumpProgress(10);
    heartBtn.disabled = true;
    heartBtn.textContent = "✅";
  }
});

document.getElementById("scoreReset").addEventListener("click", () => {
  score = 0;
  scoreEl.textContent = score;
  heartBtn.disabled = false;
  heartBtn.textContent = "💗";
  moveHeart();
});
moveHeart();

// --------------------
// LETTER actions
// --------------------
const copyBtn = document.getElementById("copyLetter");
const copyStatus = document.getElementById("copyStatus");
const letterPaper = document.getElementById("letterPaper");

copyBtn.addEventListener("click", async () => {
  try{
    await navigator.clipboard.writeText(letterPaper.innerText.trim());
    copyStatus.textContent = "Copied 💌";
    bumpProgress(5);
  }catch(e){
    copyStatus.textContent = "Copy failed (browser blocked).";
  }
});

document.getElementById("downloadLetter").addEventListener("click", () => {
  const text = letterPaper.innerText.trim();
  const blob = new Blob([text], { type:"text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "letter.txt";
  a.click();
  bumpProgress(5);
});

// --------------------
// VIDEO upload (later)
// --------------------
const videoFile = document.getElementById("videoFile");
const player = document.getElementById("player");
const videoName = document.getElementById("videoName");

videoFile.addEventListener("change", () => {
  const file = videoFile.files?.[0];
  if(!file) return;
  videoName.textContent = file.name;
  const url = URL.createObjectURL(file);
  player.src = url;
  bumpProgress(10);
});
