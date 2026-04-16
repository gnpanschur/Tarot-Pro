export const interpretReading = async (apiKey, question, spreadType, cards) => {
  if (!apiKey) throw new Error("API Key fehlt. Bitte in den Einstellungen (Zahnrad) eintragen.");

  let spreadContext = "";
  let cardList = "";

  if (spreadType === '1-card') {
    spreadContext = "Tageskarte / Themenkarte. Karte 1: Die zentrale Antwort oder Fokusernergie.";
    cardList = `1. Fokus: ${cards[0].name} ${cards[0].isReversed ? '(Umgekehrt)' : ''}`;
  } 
  else if (spreadType === '3-cards') {
    spreadContext = "Zeitlicher Verlauf. Karte 1: Vergangenheit (Ursache). Karte 2: Gegenwart (Aktuelle Lage). Karte 3: Zukunft (Potenzielles Ergebnis).";
    cardList = `1. Vergangenheit: ${cards[0].name} ${cards[0].isReversed ? '(Umgekehrt)' : ''}\n2. Gegenwart: ${cards[1].name} ${cards[1].isReversed ? '(Umgekehrt)' : ''}\n3. Zukunft: ${cards[2].name} ${cards[2].isReversed ? '(Umgekehrt)' : ''}`;
  }
  else if (spreadType === 'simple-cross') {
    spreadContext = "Einfaches Kreuz. Karte 1: Darum geht es. Karte 2: Das kreuzt / blockiert / hilft (impuls). Karte 3: Das wird bewusst wahrgenommen. Karte 4: Das ist das Ergebnis / Wohin es führt.";
    cardList = `1. Thema: ${cards[0].name} ${cards[0].isReversed ? '(Umgekehrt)' : ''}\n2. Einfluss: ${cards[1].name} ${cards[1].isReversed ? '(Umgekehrt)' : ''}\n3. Bewusstsein: ${cards[2].name} ${cards[2].isReversed ? '(Umgekehrt)' : ''}\n4. Ausblick: ${cards[3].name} ${cards[3].isReversed ? '(Umgekehrt)' : ''}`;
  }
  else if (spreadType === 'love') {
    spreadContext = "Liebes-Samen. Karte 1&2: Fragesteller. Karte 3&4: Partner. Karte 5: Die Basis. Karte 6: Das Problem/Wachstum. Karte 7: Das potenzielle Ergebnis.";
    cardList = cards.map((c, i) => `${i + 1}. Position: ${c.name} ${c.isReversed ? '(Umgekehrt)' : ''}`).join('\n');
  }
  else if (spreadType === 'decision') {
    spreadContext = "Entscheidung. Karte 1: Aktuelle Situation. Karte 2: Weg A (Entwicklung). Karte 3: Weg A (Ergebnis). Karte 4: Weg B (Entwicklung). Karte 5: Weg B (Ergebnis).";
    cardList = `1. Situation: ${cards[0].name} ${cards[0].isReversed ? '(Umgekehrt)' : ''}\n2. Weg A Start: ${cards[1].name} ${cards[1].isReversed ? '(Umgekehrt)' : ''}\n3. Weg A Ziel: ${cards[2].name} ${cards[2].isReversed ? '(Umgekehrt)' : ''}\n4. Weg B Start: ${cards[3].name} ${cards[3].isReversed ? '(Umgekehrt)' : ''}\n5. Weg B Ziel: ${cards[4].name} ${cards[4].isReversed ? '(Umgekehrt)' : ''}`;
  }
  else if (spreadType === 'career') {
    spreadContext = "Beruf & Karriere. Karte 1: Berufliche Situation. Karte 2: Verborgene Talente. Karte 3: Hindernisse. Karte 4: Nächste Chance. Karte 5: Berufliche Entwicklung.";
    cardList = `1. Situation: ${cards[0].name} ${cards[0].isReversed ? '(Umgekehrt)' : ''}\n2. Talente: ${cards[1].name} ${cards[1].isReversed ? '(Umgekehrt)' : ''}\n3. Hindernis: ${cards[2].name} ${cards[2].isReversed ? '(Umgekehrt)' : ''}\n4. Chance: ${cards[3].name} ${cards[3].isReversed ? '(Umgekehrt)' : ''}\n5. Entwicklung: ${cards[4].name} ${cards[4].isReversed ? '(Umgekehrt)' : ''}`;
  }
  else if (spreadType === 'yes-no-3') {
    spreadContext = "Entscheidung Ja/Nein. Karte 1: Energie hinter der Frage. Karte 2: Einflussfaktoren. Karte 3: Tendenz (Ja/Nein).";
    cardList = `1. Energie: ${cards[0].name} ${cards[0].isReversed ? '(Umgekehrt)' : ''}\n2. Einflüsse: ${cards[1].name} ${cards[1].isReversed ? '(Umgekehrt)' : ''}\n3. Tendenz: ${cards[2].name} ${cards[2].isReversed ? '(Umgekehrt)' : ''}`;
  }
  else if (spreadType === 'shadow') {
    spreadContext = "Schatten & Blockaden. Karte 1: Aktuelles Problem. Karte 2: Ursprung. Karte 3: Was man übersieht. Karte 4: Was hilft. Karte 5: Entwicklung.";
    cardList = `1. Problem: ${cards[0].name} ${cards[0].isReversed ? '(Umgekehrt)' : ''}\n2. Ursprung: ${cards[1].name} ${cards[1].isReversed ? '(Umgekehrt)' : ''}\n3. Blinder Fleck: ${cards[2].name} ${cards[2].isReversed ? '(Umgekehrt)' : ''}\n4. Hilfe: ${cards[3].name} ${cards[3].isReversed ? '(Umgekehrt)' : ''}\n5. Ausblick: ${cards[4].name} ${cards[4].isReversed ? '(Umgekehrt)' : ''}`;
  }
  else if (spreadType === 'spiritual') {
    spreadContext = "Spirituelle Entwicklung. Karte 1: Aktueller Stand. Karte 2: Innere Stärke. Karte 3: Herausforderung. Karte 4: Lernaufgabe. Karte 5: Unterstützung. Karte 6: Nächster Schritt. Karte 7: Langfristiger Weg.";
    cardList = cards.map((c, i) => `${i + 1}. Position: ${c.name} ${c.isReversed ? '(Umgekehrt)' : ''}`).join('\n');
  }
  else if (spreadType === 'relationship-deep') {
    spreadContext = "Beziehung Tiefgehend. Karte 1: Fragesteller. Karte 2: Partner. Karte 3: Verbindungsebene. Karte 4: Problem/Konflikt. Karte 5: Was verbindet. Karte 6: Mögliche Entwicklung. Karte 7: Rat.";
    cardList = cards.map((c, i) => `${i + 1}. Position: ${c.name} ${c.isReversed ? '(Umgekehrt)' : ''}`).join('\n');
  }
  else if (spreadType === 'problem-solution') {
    spreadContext = "Problem & Lösung. Karte 1: Problem. Karte 2: Ursache. Karte 3: Ansatz zur Lösung.";
    cardList = `1. Problem: ${cards[0].name} ${cards[0].isReversed ? '(Umgekehrt)' : ''}\n2. Ursache: ${cards[1].name} ${cards[1].isReversed ? '(Umgekehrt)' : ''}\n3. Lösung: ${cards[2].name} ${cards[2].isReversed ? '(Umgekehrt)' : ''}`;
  }
  else if (spreadType === 'daily-energy') {
    spreadContext = "Tagesenergie. Karte 1: Morgen. Karte 2: Nachmittag. Karte 3: Abend.";
    cardList = `1. Morgen: ${cards[0].name} ${cards[0].isReversed ? '(Umgekehrt)' : ''}\n2. Nachmittag: ${cards[1].name} ${cards[1].isReversed ? '(Umgekehrt)' : ''}\n3. Abend: ${cards[2].name} ${cards[2].isReversed ? '(Umgekehrt)' : ''}`;
  }
  else if (spreadType === 'celtic-cross') {
    spreadContext = "Keltisches Kreuz. 1: Ausgangssituation. 2: Das kreuzt (Hindernis/Impuls). 3: Bewusstes Ziel. 4: Unbewusstes Fundament. 5: Jüngste Vergangenheit. 6: Nahe Zukunft. 7: Einstellung des Fragenden. 8: Äußere Einflüsse. 9: Hoffnungen & Ängste. 10: Ultimatives Ergebnis.";
    cardList = cards.map((c, i) => `${i + 1}. Position: ${c.name} ${c.isReversed ? '(Umgekehrt)' : ''}`).join('\n');
  }
  else if (spreadType === 'year') {
    spreadContext = "Jahreslegung. Die 12 Karten repräsentieren chronologisch die 12 bevorstehenden Monate, startend ab dem aktuellen Monat.";
    const months = ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12"];
    cardList = cards.map((c, i) => `${months[i]}: ${c.name} ${c.isReversed ? '(Umgekehrt)' : ''}`).join('\n');
  }

  const prompt = `Du bist ein weiser, mystischer Tarotkartenleger und Analytiker. Ich habe eine Tarotlegung durchgeführt.
${question ? `Die konkrete Frage des Nutzers lautet: "${question}"` : 'Es wurde keine spezifische Frage gestellt, deute die allgemeine Energie.'}

Legetechnik: ${spreadType}
Kontext der Positionen: ${spreadContext}

Gezogene Karten (in Reihenfolge der Positionen):
${cardList}

Bitte analysiere diese Legung tiefgehend und präzise. Berücksichtige die archetypischen Bedeutungen der Rider-Waite Bilder und wie sie miteinander auf den spezifischen Positionen interagieren. Sprich den Nutzer mystisch und respektvoll an.
Schließe deine Antwort mit einem fettgeschriebenen **Resümee** (ca. 1-2 Absätze) ab, welches die Quintessenz direkt auf den Punkt bringt.
Verwende HTML-Tags wie <br>, <strong> oder <em> zur Formatierung des Textflusses (kein Markdown für Bold, sondern HTML, falls nötig).
Mache niemals Aussagen über Krankheit oder Tod im medizinischen Sinne.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1500
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);

  return data.choices[0].message.content;
};
