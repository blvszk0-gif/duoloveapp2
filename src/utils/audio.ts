export async function playAudio(text: string, lang: string) {
  const apiKey = import.meta.env.VITE_GOOGLE_TTS_KEY;

  // Try Browser TTS Fallback first if no API key
  if (!apiKey) {
    playBrowserTTS(text, lang);
    return;
  }

  try {
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
      method: 'POST',
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: lang, ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' }
      })
    });

    if (!response.ok) {
        throw new Error(`Google TTS failed with status: ${response.status}`);
    }

    const data = await response.json();
    if (data.audioContent) {
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      audio.play();
    } else {
        throw new Error("No audio content in response");
    }
  } catch (error) {
    console.warn("Google TTS failed, falling back to browser speech:", error);
    playBrowserTTS(text, lang);
  }
}

function playBrowserTTS(text: string, lang: string) {
    if (!('speechSynthesis' in window)) {
        console.error("Speech synthesis not supported in this browser.");
        return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // Slightly slower for clarity

    // Attempt to find a better voice if available
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(lang)) || voices[0];
    if (voice) {
        utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
}
