const DEFAULTS = {
  nickname: "Sugarboo",
  occasion: "Exemple d’occasion spéciale",
  seal: "SB",
  msg: [
    "Ceci est un exemple de carte Sugarboo à personnaliser.",
    "Tu peux modifier le surnom, l’occasion, le thème, la musique et le message avant de générer et de partager le lien.",
    "Essaie les options du menu pour créer ta propre carte."
  ].join("\n"),
  signoff: "— Ta signature",
  theme: "classic",
  photo: "",
  music: "off",
  lang: "fr",
  preset: ""
};

const PRESETS = {
  noel: {
    theme:'celebration',
    occasion:'Joyeux Noël',
    msg:[
      "Joyeux Noël ! Que cette journée soit douce, chaleureuse et pleine de moments magiques.",
      "Que les lumières brillent, les câlins soient nombreux, et que chaque instant te rappelle combien tu comptes pour moi."
    ].join('\n'),
    signoff:'— avec amour',
    photo:'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=1200&q=80'
  },
  'saint-valentin': {
    theme:'romantic',
    occasion:'Bonne Saint-Valentin',
    msg:[
      "Aujourd'hui, c'est encore une raison de te dire à quel point tu comptes pour moi.",
      "Chaque moment passé avec toi est un cadeau, et je veux que tu le saches."
    ].join('\n'),
    signoff:'— ton/ta tendre',
    photo:'https://images.unsplash.com/photo-1514041522484-4b1b6b661b11?auto=format&fit=crop&w=1200&q=80'
  },
  paques: {
    theme:'celebration',
    occasion:'Joyeuses Pâques',
    msg:[
      "Que cette journée de Pâques soit douce et pleine de surprises colorées.",
      "Je t'envoie toute ma tendresse et un grand sourire pour célébrer ce moment ensemble."
    ].join('\n'),
    signoff:'— toujours près de toi',
    photo:'https://images.unsplash.com/photo-1493244040629-496f6d136cc3?auto=format&fit=crop&w=1200&q=80'
  },
  'girlfriend-day': {
    theme:'midnight',
    occasion:'Happy Girlfriend Day',
    msg:[
      "Toi + moi = la meilleure équipe. Merci d'être à mes côtés.",
      "Aujourd'hui, je célèbre la chance de t'avoir dans ma vie."
    ].join('\n'),
    signoff:'— toujours à toi',
    photo:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
  },
  'boyfriend-day': {
    theme:'midnight',
    occasion:'Happy Boyfriend Day',
    msg:[
      "Merci d'être ce compagnon si précieux dans ma vie.",
      "Chaque jour avec toi est une nouvelle aventure pleine d'amour."
    ].join('\n'),
    signoff:'— avec tout mon cœur',
    photo:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80'
  },
  anniversaire: {
    theme:'celebration',
    occasion:'Joyeux anniversaire',
    msg:[
      "Bon anniversaire ! Que cette année t'apporte encore plus de bonheur.",
      "Je suis là pour célébrer chaque instant et rendre ta journée exceptionnelle."
    ].join('\n'),
    signoff:'— à toi, toujours',
    photo:'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80'
  }
};

const THEMES = {
  classic: {
    '--caramel':'#c98a4b',
    '--blush':'#f6d9d0',
    '--plum':'#5a2e3d',
    '--cream':'#fff7ee',
    '--gold':'#e0a84f',
    '--deep':'#3a1f28'
  },
  celebration: {
    '--caramel':'#ff9e66',
    '--blush':'#ffe6e0',
    '--plum':'#933d6a',
    '--cream':'#fff6f0',
    '--gold':'#ffcc5c',
    '--deep':'#4b1c2b'
  },
  romantic: {
    '--caramel':'#d46a7e',
    '--blush':'#f8d3d8',
    '--plum':'#6a2346',
    '--cream':'#fff3f4',
    '--gold':'#f0a2b1',
    '--deep':'#3b1421'
  },
  midnight: {
    '--caramel':'#7f8fbf',
    '--blush':'#d3d8ff',
    '--plum':'#1f2241',
    '--cream':'#eef1ff',
    '--gold':'#c5b5ff',
    '--deep':'#0f1227'
  }
};

const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioContext;
let bgOscillator;
let bgGain;

function initAudio(){
  if(!AudioCtx){
    return false;
  }
  if(!audioContext){
    audioContext = new AudioCtx();
  }
  return true;
}

function startMusic(){
  if(!initAudio()){
    return;
  }
  if(audioContext.state === 'suspended'){
    audioContext.resume().catch(()=>{});
  }
  if(bgOscillator){
    return;
  }
  bgGain = audioContext.createGain();
  bgGain.gain.value = 0.02;
  bgGain.connect(audioContext.destination);

  bgOscillator = audioContext.createOscillator();
  bgOscillator.type = 'triangle';
  bgOscillator.frequency.value = 220;

  const lfo = audioContext.createOscillator();
  lfo.frequency.value = 0.12;
  const lfoGain = audioContext.createGain();
  lfoGain.gain.value = 20;
  lfo.connect(lfoGain);
  lfoGain.connect(bgOscillator.frequency);

  bgOscillator.connect(bgGain);
  lfo.start();
  bgOscillator.start();
}

function stopMusic(){
  if(!bgOscillator || !bgGain){
    return;
  }
  bgGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.5);
  setTimeout(()=>{
    if(bgOscillator){
      bgOscillator.stop();
      bgOscillator.disconnect();
      bgOscillator = null;
    }
    if(bgGain){
      bgGain.disconnect();
      bgGain = null;
    }
  }, 600);
}

const TEXTS = {
  fr: {
    title:'Une carte pour toi',
    occasion:'Exemple d’occasion spéciale',
    msg:[
      "Ceci est un exemple de carte Sugarboo à personnaliser.",
      "Tu peux modifier le surnom, l’occasion, le thème, la musique et le message avant de générer et de partager le lien.",
      "Essaie les options du menu pour créer ta propre carte."
    ].join("\n"),
    signoff:'— Ta signature',
    hint:'clique sur l\'enveloppe, une surprise t\'attend 🍬',
    edit:'Personnaliser',
    menu:'Menu',
    customize:'Personnaliser la carte',
    language:'Langue',
    theme:'Thème',
    photo:'Image de fond (URL)',
    music:'Musique de fond',
    actions:'Actions',
    print:'Imprimer',
    copy:'Copier le lien',
    whatsapp:'WhatsApp',
    email:'E-mail',
    generate:'Générer le lien',
    musicOn:'Activer la musique',
    musicOff:'Désactiver la musique',
    preview:'Photo de la carte',
    subject:'Ta carte Sugarboo'
  },
  en: {
    title:'A card for you',
    occasion:'Sample special occasion',
    msg:[
      "This is a sample Sugarboo card to personalize.",
      "You can customize the nickname, occasion, theme, music, and message before generating and sharing the link.",
      "Try the menu options to create your own card."
    ].join("\n"),
    signoff:'— Your signature',
    hint:'click the envelope for a surprise 🍬',
    edit:'Customize',
    menu:'Menu',
    customize:'Customize the card',
    language:'Language',
    theme:'Theme',
    photo:'Background image (URL)',
    music:'Background music',
    actions:'Actions',
    print:'Print',
    copy:'Copy link',
    whatsapp:'WhatsApp',
    email:'Email',
    generate:'Generate link',
    musicOn:'Play music',
    musicOff:'Pause music',
    preview:'Card photo',
    subject:'Your Sugarboo card'
  }
};

function getParams(){
  const p = new URLSearchParams(window.location.search);
  const lang = p.get('lang') || DEFAULTS.lang;
  const text = TEXTS[lang] || TEXTS.fr;
  return {
    nickname: p.get('nickname') || DEFAULTS.nickname,
    occasion: p.get('occasion') || text.occasion,
    seal: p.get('seal') || DEFAULTS.seal,
    msg: p.get('msg') || text.msg,
    signoff: p.get('signoff') || text.signoff,
    theme: p.get('theme') || DEFAULTS.theme,
    photo: p.get('photo') || DEFAULTS.photo,
    music: p.get('music') || DEFAULTS.music,
    lang,
    preset: p.get('preset') || DEFAULTS.preset
  };
}

function hasContentParams(){
  const p = new URLSearchParams(window.location.search);
  return ['nickname','occasion','seal','msg','signoff','theme','photo','preset']
    .some(key => p.has(key));
}

function getStoredConfig(){
  try {
    const stored = localStorage.getItem('sugarbooConfig');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    return null;
  }
}

function saveConfig(state){
  try {
    localStorage.setItem('sugarbooConfig', JSON.stringify(state));
  } catch (error) {
    // ignore storage failures
  }
}

function sanitizePhotoUrl(rawUrl){
  if(typeof rawUrl !== 'string'){
    return '';
  }
  const cleaned = rawUrl.trim().replace(/["'\\]/g, '');
  if(!cleaned){
    return '';
  }
  try {
    const parsed = new URL(cleaned);
    return ['http:','https:'].includes(parsed.protocol) ? parsed.toString() : '';
  } catch (error) {
    return '';
  }
}

function readConfigState(){
  const rawMsg = document.getElementById('cfg-msg').value;
  return {
    nickname: document.getElementById('cfg-nickname').value.trim(),
    occasion: document.getElementById('cfg-occasion').value.trim(),
    seal: document.getElementById('cfg-seal').value.trim(),
    msg: rawMsg && rawMsg.trim() ? rawMsg : DEFAULTS.msg,
    signoff: document.getElementById('cfg-signoff').value.trim(),
    theme: document.getElementById('cfg-theme').value,
    photo: document.getElementById('cfg-photo').value.trim(),
    music: document.getElementById('cfg-music-toggle').dataset.state || DEFAULTS.music,
    lang: document.getElementById('cfg-lang').value,
    preset: document.getElementById('cfg-preset').value
  };
}

function mergeState(params, config){
  const presetKey = config.preset || params.preset || DEFAULTS.preset;
  const preset = PRESETS[presetKey] || null;
  return {
    preset: presetKey,
    nickname: config.nickname || params.nickname,
    occasion: preset ? preset.occasion : (config.occasion || params.occasion || DEFAULTS.occasion),
    seal: config.seal || params.seal,
    msg: preset ? preset.msg : (config.msg || params.msg || DEFAULTS.msg),
    signoff: preset ? preset.signoff : (config.signoff || params.signoff || DEFAULTS.signoff),
    theme: preset ? preset.theme : (config.theme || params.theme || DEFAULTS.theme),
    photo: preset ? preset.photo : (config.photo || params.photo || DEFAULTS.photo),
    music: config.music || params.music || DEFAULTS.music,
    lang: config.lang || params.lang || DEFAULTS.lang,
    started: config.started || false
  };
}

function ensureStarted(state){
  return Object.assign({}, state, {started:true});
}

function persistCurrentConfig(){
  const params = getParams();
  const config = readConfigState();
  const previous = getStoredConfig();
  const state = mergeState(params, config);
  saveConfig({
    ...state,
    started: false
  });
}

function markCardOpened(){
  const params = getParams();
  const config = readConfigState();
  const state = mergeState(params, config);
  saveConfig(ensureStarted(state));
}

function toggleConfigPanel(show){
  const panel = document.getElementById('config-panel');
  if(typeof show === 'boolean'){
    panel.classList.toggle('show', show);
  } else {
    panel.classList.toggle('show');
  }
  if(panel.classList.contains('show')){
    const firstInput = document.getElementById('cfg-nickname');
    firstInput?.focus();
  }
}

function applyTheme(themeName){
  const theme = THEMES[themeName] || THEMES.classic;
  Object.entries(theme).forEach(([key,value])=>{
    document.documentElement.style.setProperty(key,value);
  });
}

function render(state){
  const values = state || mergeState(getParams(), readConfigState());
  applyTheme(values.theme);
  const texts = TEXTS[values.lang] || TEXTS.fr;

  document.getElementById('nickname-text').textContent = values.nickname;
  document.getElementById('occasion-text').textContent = values.occasion;
  document.getElementById('seal-text').textContent = values.seal;
  document.getElementById('signoff-text').textContent = values.signoff;

  const msgDiv = document.getElementById('msg-text');
  msgDiv.innerHTML = '';
  values.msg.split('\n').filter(Boolean).forEach(line=>{
    const p = document.createElement('p');
    p.textContent = line;
    msgDiv.appendChild(p);
  });

  const photoPreview = document.getElementById('photo-preview');
  const sanitizedPhoto = sanitizePhotoUrl(values.photo);
  if(sanitizedPhoto){
    photoPreview.style.backgroundImage = `url("${sanitizedPhoto}")`;
    photoPreview.classList.add('has-image');
    photoPreview.setAttribute('role', 'img');
    photoPreview.setAttribute('aria-label', 'Photo de la carte');
    document.getElementById('photo-preview-text').style.display = 'none';
  } else {
    photoPreview.style.backgroundImage = 'none';
    photoPreview.classList.remove('has-image');
    photoPreview.removeAttribute('role');
    photoPreview.removeAttribute('aria-label');
    document.getElementById('photo-preview-text').style.display = 'block';
  }

  document.getElementById('cfg-nickname').value = values.nickname;
  document.getElementById('cfg-occasion').value = values.occasion;
  document.getElementById('cfg-seal').value = values.seal;
  document.getElementById('cfg-msg').value = values.msg;
  document.getElementById('cfg-signoff').value = values.signoff;
  document.getElementById('cfg-theme').value = values.theme;
  document.getElementById('cfg-photo').value = values.photo;
  document.getElementById('cfg-lang').value = values.lang;
  document.getElementById('cfg-preset').value = values.preset || '';
  document.getElementById('cfg-music-toggle').textContent = values.music === 'on' ? texts.musicOff : texts.musicOn;
  document.getElementById('cfg-music-toggle').dataset.state = values.music;

  const isFrench = values.lang === 'fr';
  document.getElementById('cfg-title').textContent = texts.customize;
  document.getElementById('cfg-lang-label').textContent = texts.language;
  document.getElementById('cfg-theme-label').textContent = texts.theme;
  document.getElementById('cfg-photo-label').textContent = texts.photo;
  document.getElementById('cfg-music-label').textContent = texts.music;
  document.getElementById('cfg-occasion-label').textContent = isFrench ? 'Occasion (petit texte en haut)' : 'Occasion (top text)';
  document.getElementById('cfg-preset-label').textContent = isFrench ? 'Préréglage' : 'Preset';
  document.getElementById('cfg-seal-label').textContent = isFrench ? 'Initiales sur le cachet' : 'Seal initials';
  document.getElementById('cfg-msg-label').textContent = isFrench ? 'Message (un paragraphe par ligne)' : 'Message (one paragraph per line)';
  document.getElementById('cfg-signoff-label').textContent = 'Signature';
  document.getElementById('cfg-print').textContent = texts.print;
  document.getElementById('cfg-copy').textContent = texts.copy;
  document.getElementById('cfg-whatsapp').textContent = texts.whatsapp;
  document.getElementById('cfg-email').textContent = texts.email;
  document.getElementById('cfg-generate').textContent = texts.generate;
  document.getElementById('menu-toggle').textContent = texts.menu;
  document.getElementById('menu-options').querySelector('[data-action="customize"]').textContent = texts.customize;
  document.getElementById('menu-options').querySelector('[data-action="music"]').textContent = values.music === 'on' ? texts.musicOff : texts.musicOn;
  document.getElementById('menu-options').querySelector('[data-action="copy"]').textContent = texts.copy;
  document.getElementById('menu-options').querySelector('[data-action="print"]').textContent = texts.print;
  document.getElementById('menu-options').querySelector('[data-action="whatsapp"]').textContent = texts.whatsapp;
  document.getElementById('menu-options').querySelector('[data-action="email"]').textContent = texts.email;
  document.getElementById('hint-text').textContent = texts.hint;
  document.querySelector('.credit').innerHTML = `Créé par <strong>SPEEDMIND</strong>`;
}

function createShareLink(){
  const params = new URLSearchParams();
  const state = mergeState(getParams(), readConfigState());
  params.set('nickname', state.nickname);
  params.set('occasion', state.occasion);
  params.set('seal', state.seal);
  params.set('msg', state.msg || DEFAULTS.msg);
  params.set('signoff', state.signoff || DEFAULTS.signoff);
  params.set('theme', state.theme || DEFAULTS.theme);
  if(state.photo) params.set('photo', state.photo);
  params.set('lang', state.lang || DEFAULTS.lang);
  params.set('music', state.music || DEFAULTS.music);
  if(state.preset) params.set('preset', state.preset);
  const url = new URL(window.location.origin + window.location.pathname);
  url.search = params.toString();
  return url.toString();
}

function showShareLink(){
  const out = document.getElementById('cfg-out');
  const link = createShareLink();
  out.textContent = link;
  out.classList.add('show');
}

function copyLink(){
  const link = createShareLink();
  if(navigator.clipboard){
    navigator.clipboard.writeText(link).catch(()=>{});
  }
  const out = document.getElementById('cfg-out');
  out.textContent = link;
  out.classList.add('show');
}

function shareWhatsApp(){
  const link = createShareLink();
  const text = encodeURIComponent(link);
  window.open(`https://wa.me/?text=${text}`, '_blank');
}

function shareEmail(){
  const state = mergeState(getParams(), readConfigState());
  const texts = TEXTS[state.lang] || TEXTS.fr;
  const subject = encodeURIComponent(texts.subject);
  const body = encodeURIComponent(`${texts.hint}
${createShareLink()}`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function toggleMusic(){
  const button = document.getElementById('cfg-music-toggle');
  const isOn = button.dataset.state === 'on';
  if(isOn){
    stopMusic();
    button.dataset.state = 'off';
  } else {
    startMusic();
    button.dataset.state = 'on';
  }
  return button.dataset.state;
}

function printCard(){
  window.print();
}

function bindConfigEvents(){
  const fields = document.querySelectorAll('#cfg-nickname, #cfg-occasion, #cfg-seal, #cfg-msg, #cfg-signoff, #cfg-theme, #cfg-photo, #cfg-lang');
  fields.forEach(field => field.addEventListener('input', ()=>{
    persistCurrentConfig();
    render();
  }));
  document.getElementById('cfg-preset').addEventListener('change', (event)=>{
    const preset = PRESETS[event.target.value];
    if(preset){
      document.getElementById('cfg-occasion').value = preset.occasion;
      document.getElementById('cfg-msg').value = preset.msg;
      document.getElementById('cfg-signoff').value = preset.signoff;
      document.getElementById('cfg-theme').value = preset.theme;
      document.getElementById('cfg-photo').value = preset.photo;
    }
    persistCurrentConfig();
    render();
  });
  document.getElementById('cfg-music-toggle').addEventListener('click', ()=>{
    toggleMusic();
    persistCurrentConfig();
    render();
  });
  document.getElementById('cfg-generate').addEventListener('click', showShareLink);
  document.getElementById('cfg-copy').addEventListener('click', copyLink);
  document.getElementById('cfg-whatsapp').addEventListener('click', shareWhatsApp);
  document.getElementById('cfg-email').addEventListener('click', shareEmail);
  document.getElementById('cfg-print').addEventListener('click', printCard);
}

function handleMenuAction(action){
  switch(action){
    case 'customize':
      toggleConfigPanel(true);
      break;
    case 'music':
      toggleMusic();
      persistCurrentConfig();
      render();
      break;
    case 'copy':
      copyLink();
      break;
    case 'print':
      printCard();
      break;
    case 'whatsapp':
      shareWhatsApp();
      break;
    case 'email':
      shareEmail();
      break;
  }
}

function initInteractions(){
  const envelopeWrap = document.getElementById('envelope-wrap');
  const envelope = document.getElementById('envelope');
  const menuToggle = document.getElementById('menu-toggle');
  const menuOptions = document.getElementById('menu-options');
  const cfgOut = document.getElementById('cfg-out');

  const revealCard = ()=>{
    envelope.classList.add('open');
    markCardOpened();
    spawnGrains();
    setTimeout(()=>{
      envelopeWrap.classList.add('hide');
      document.getElementById('card').classList.add('show');
    }, 550);
  };

  envelope.addEventListener('click', revealCard, {once:true});
  envelopeWrap.addEventListener('click', revealCard, {once:true});

  menuToggle.addEventListener('click', (event)=>{
    event.stopPropagation();
    const isOpen = menuOptions.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  menuOptions.addEventListener('click', (event)=>{
    const item = event.target.closest('.menu-item');
    if(!item) return;
    const action = item.dataset.action;
    handleMenuAction(action);
    menuOptions.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('click', ()=>{
    menuOptions.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('keydown', (event)=>{
    if(event.key === 'Escape'){
      toggleConfigPanel(false);
      cfgOut.classList.remove('show');
    }
  });

  const params = new URLSearchParams(window.location.search);
  const stored = getStoredConfig();
  const initialState = hasContentParams()
    ? getParams()
    : (stored ? mergeState(getParams(), { ...stored, started: false }) : getParams());

  document.getElementById('envelope-wrap').classList.remove('hide');
  document.getElementById('card').classList.remove('show');
  document.getElementById('envelope').classList.remove('open');

  render({ ...initialState, started: false });

  if(stored && stored.started && !hasContentParams()){
    saveConfig({ ...stored, started: false });
  }

  bindConfigEvents();

  if(params.get('edit') === '1'){
    toggleConfigPanel(true);
    persistCurrentConfig();
  }
}

function spawnGrains(){
  const stage = document.getElementById('stage');
  for(let i=0;i<24;i++){
    const g = document.createElement('div');
    g.className='grain';
    const angle = Math.random()*Math.PI*2;
    const dist = 60 + Math.random()*160;
    g.style.left = '50%';
    g.style.top = '38%';
    g.animate([
      {transform:'translate(0,0)', opacity:1},
      {transform:`translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px)`, opacity:0}
    ], {duration: 900+Math.random()*500, easing:'ease-out'});
    stage.appendChild(g);
    setTimeout(()=>g.remove(), 1500);
  }
}

render();
initInteractions();
