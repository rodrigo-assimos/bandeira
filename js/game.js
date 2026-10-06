const CODES = Object.keys(COUNTRIES);
const N_OPTIONS = 4;

const $ = id => document.getElementById(id);
const state = { deck: [], idx: 0, current: null, hits: 0, streak: 0, firstTry: 0, missedThis: false, locked: false, sound: true };

function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function flagSrc(code){ return "flags/" + code + ".svg"; }

/* ---------- Sons (gerados no navegador, sem arquivos) ---------- */
let ctx;
function tone(freq, start, dur, type="sine", vol=.18){
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime + start);
  g.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + .02);
  g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + start + dur);
  o.connect(g).connect(ctx.destination);
  o.start(ctx.currentTime + start); o.stop(ctx.currentTime + start + dur + .05);
}
function playSound(kind){
  if(!state.sound) return;
  try{
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if(ctx.state === "suspended") ctx.resume();
    if(kind === "ok"){ [523.25,659.25,783.99,1046.5].forEach((f,i)=>tone(f, i*.08, .28, "triangle")); }
    else { tone(196, 0, .18, "sawtooth", .12); tone(146.8, .16, .32, "sawtooth", .12); }
  }catch(e){}
}

/* ---------- Confete no acerto ---------- */
const cv = $("fx"), cx = cv.getContext("2d"); let parts = [], raf = null;
function resize(){ cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; }
addEventListener("resize", resize); resize();
function confetti(){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const r = $("flagBox").getBoundingClientRect();
  const colors = ["#1f5fd1","#178a4c","#f2b705","#e4572e","#8e44ad"];
  for(let i=0;i<70;i++){
    parts.push({x:(r.left + r.width/2)*devicePixelRatio, y:(r.top + r.height/2)*devicePixelRatio,
      vx:(Math.random()-.5)*14*devicePixelRatio, vy:(-Math.random()*12-4)*devicePixelRatio,
      s:(Math.random()*6+4)*devicePixelRatio, c:colors[i%colors.length], a:1, rot:Math.random()*6});
  }
  if(!raf) raf = requestAnimationFrame(tick);
}
function tick(){
  cx.clearRect(0,0,cv.width,cv.height);
  parts.forEach(p=>{ p.vy += .45*devicePixelRatio; p.x += p.vx; p.y += p.vy; p.a -= .014; p.rot += .2;
    cx.save(); cx.globalAlpha = Math.max(p.a,0); cx.translate(p.x,p.y); cx.rotate(p.rot);
    cx.fillStyle = p.c; cx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2); cx.restore(); });
  parts = parts.filter(p=>p.a>0);
  raf = parts.length ? requestAnimationFrame(tick) : (cx.clearRect(0,0,cv.width,cv.height), null);
}

/* ---------- Lógica do jogo ---------- */
function newDeck(){ state.deck = shuffle([...CODES]); state.idx = 0; }

function nextFlag(){
  if(state.idx >= state.deck.length) newDeck();
  const code = state.deck[state.idx++];
  state.current = code; state.missedThis = false; state.locked = false;

  const wrongs = shuffle(CODES.filter(c => c !== code)).slice(0, N_OPTIONS - 1);
  const options = shuffle([code, ...wrongs]);

  const img = $("flag"); img.src = flagSrc(code);
  const box = $("flagBox"); box.classList.remove("flagin","bounce","shake"); void box.offsetWidth; box.classList.add("flagin");
  $("round").textContent = `Bandeira ${state.idx} de ${state.deck.length}`;
  $("feedback").textContent = ""; $("feedback").className = "feedback";

  const wrap = $("answers"); wrap.innerHTML = "";
  options.forEach((c,i) => {
    const b = document.createElement("button");
    b.type = "button"; b.id = "opt" + i; b.textContent = COUNTRIES[c]; b.dataset.code = c;
    b.addEventListener("click", () => choose(b));
    wrap.appendChild(b);
  });
}

function choose(btn){
  if(state.locked || btn.disabled) return;
  const box = $("flagBox"), fb = $("feedback");
  box.classList.remove("flagin","bounce","shake"); void box.offsetWidth;

  if(btn.dataset.code === state.current){
    state.locked = true;
    btn.classList.add("right");
    state.hits++; if(!state.missedThis){ state.streak++; state.firstTry++; }
    box.classList.add("bounce"); confetti(); playSound("ok");
    fb.textContent = "Acertou! É " + COUNTRIES[state.current] + "."; fb.className = "feedback ok";
    updateScore();
    setTimeout(nextFlag, 1300);
  } else {
    btn.disabled = true; btn.classList.add("wrong");
    state.missedThis = true; state.streak = 0;
    box.classList.add("shake"); playSound("bad");
    fb.textContent = "Não é " + COUNTRIES[btn.dataset.code] + ". Tente de novo!"; fb.className = "feedback bad";
    updateScore();
  }
}

function updateScore(){
  $("sHits").textContent = state.hits;
  $("sStreak").textContent = state.streak;
  $("sAcc").textContent = state.hits ? Math.round(state.firstTry / state.hits * 100) + "%" : "–";
}

$("mute").addEventListener("click", e => {
  state.sound = !state.sound;
  e.currentTarget.textContent = state.sound ? "🔊 Som ligado" : "🔇 Som desligado";
  e.currentTarget.setAttribute("aria-pressed", String(!state.sound));
});

newDeck(); nextFlag();
