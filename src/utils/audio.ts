export async function playAudio(text: string, lang: string) {
  const apiKey = import.meta.env.VITE_GOOGLE_TTS_KEY;
  if (!apiKey) {
    console.warn("VITE_GOOGLE_TTS_KEY is not set. Audio will not play.");
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

    const data = await response.json();
    if (data.audioContent) {
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      audio.play();
    }
  } catch (error) {
    console.error("Error playing audio:", error);
  }
}
