let recognition = null;

function setupSpeechRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { alert('Please use Chrome for voice features.'); return null; }
  recognition = new SR();
  recognition.lang = 'ne-NP';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  return recognition;
}

function startListening(onResult, onEnd) {
  if (!recognition) recognition = setupSpeechRecognition();
  if (!recognition) return;
  document.getElementById('micBtn').classList.add('listening');
  document.getElementById('statusBar').textContent = '👂 Listening...';

  recognition.onresult = e => onResult(e.results[0][0].transcript);
  recognition.onend = () => {
    document.getElementById('micBtn').classList.remove('listening');
    if (onEnd) onEnd();
  };
  recognition.onerror = (e) => {
  if (e.error === 'language-not-supported') {
    recognition.lang = 'en-US'; // fallback
    recognition.start();
  } else {
    document.getElementById('micBtn').classList.remove('listening');
    document.getElementById('statusBar').textContent = 'माइक थिचेर फेरि बोल्नुस् 💛';
  }
};
  recognition.start();
}

async function speakWithMyVoice(text) {
  document.getElementById('statusBar').textContent = '💛 बोल्दैछु...';

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.8;
  utterance.pitch = 1.0;
  utterance.volume = 1;

  // Wait for voices to load then pick best available
  const setVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const voice =
      voices.find(v => v.lang === 'ne-NP') ||
      voices.find(v => v.lang === 'hi-IN') || // Hindi as fallback — close to Nepali
      voices.find(v => v.name.includes('Google')) ||
      voices[0];
    if (voice) utterance.voice = voice;
  };

  if (window.speechSynthesis.getVoices().length) {
    setVoice();
  } else {
    window.speechSynthesis.onvoiceschanged = setVoice;
  }

  utterance.onend = () => {
    document.getElementById('statusBar').textContent = 'बोल्न माइक थिच्नुस् 🎙️';
  };

  window.speechSynthesis.speak(utterance);
}