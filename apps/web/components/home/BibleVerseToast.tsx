"use client";

import { useEffect, useState } from "react";

const verses = [
  { reference: "Psalm 46:10", text: "Be still, and know that I am God." },
  { reference: "Proverbs 3:5", text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding." },
  { reference: "Isaiah 41:10", text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God." },
  { reference: "Matthew 5:16", text: "Let your light so shine before men, that they may see your good works." },
  { reference: "Romans 12:12", text: "Rejoicing in hope; patient in tribulation; continuing instant in prayer." },
  { reference: "Philippians 4:13", text: "I can do all things through Christ which strengtheneth me." },
  { reference: "Colossians 3:23", text: "Whatsoever ye do, do it heartily, as to the Lord, and not unto men." },
  { reference: "1 Chronicles 16:11", text: "Seek the LORD and his strength, seek his face continually." },
];

const storageKey = "geniuzlab-home-verse-reference";

export function BibleVerseToast() {
  const [verse, setVerse] = useState<(typeof verses)[number] | null>(null);

  useEffect(() => {
    let previousReference = "";
    try {
      previousReference = window.localStorage.getItem(storageKey) ?? "";
    } catch {
      previousReference = "";
    }

    const choices = verses.filter((item) => item.reference !== previousReference);
    const nextVerse = choices[Math.floor(Math.random() * choices.length)];

    try {
      window.localStorage.setItem(storageKey, nextVerse.reference);
    } catch {
      // The verse still appears when browser storage is unavailable.
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVerse(nextVerse);
    const timeout = window.setTimeout(() => setVerse(null), 10000);

    return () => window.clearTimeout(timeout);
  }, []);

  if (!verse) return null;

  return (
    <aside className="verse-toast" role="status" aria-live="polite" aria-label="Bible verse">
      <p>{verse.text}</p>
      <span>{verse.reference}</span>
    </aside>
  );
}