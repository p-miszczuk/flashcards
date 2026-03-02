import { useState } from "react";
import type { Card } from "../api/cards";

type CardFormProps = {
  initialCard?: Pick<
    Card,
    "front" | "back" | "sentence" | "sentenceTranslation"
  >;
  onSubmit: (
    front: string,
    back: string,
    sentence?: string,
    sentenceTranslation?: string,
  ) => Promise<void>;
  onCancel: () => void;
};

const CardForm = ({ initialCard, onSubmit, onCancel }: CardFormProps) => {
  const [front, setFront] = useState(initialCard?.front ?? "");
  const [back, setBack] = useState(initialCard?.back ?? "");
  const [sentence, setSentence] = useState(initialCard?.sentence ?? "");
  const [sentenceTranslation, setSentenceTranslation] = useState(
    initialCard?.sentenceTranslation ?? "",
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    setLoading(true);
    await onSubmit(
      front.trim(),
      back.trim(),
      sentence.trim() || undefined,
      sentenceTranslation.trim() || undefined,
    );
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="card-front"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Przednia strona (słowo angielskie)
        </label>
        <textarea
          id="card-front"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          placeholder="np. run"
          rows={2}
          autoFocus
          className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
      </div>
      <div>
        <label
          htmlFor="card-back"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Tłumaczenie (słowo polskie)
        </label>
        <textarea
          id="card-back"
          value={back}
          onChange={(e) => setBack(e.target.value)}
          placeholder="np. biegać"
          rows={2}
          className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
      </div>
      <div>
        <label
          htmlFor="card-sentence"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Zdanie (przykład użycia w jezyku angielskim)
        </label>
        <textarea
          id="card-sentence"
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          placeholder="np. I run every morning."
          rows={2}
          className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
      </div>
      <div>
        <label
          htmlFor="card-sentence-translation"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Zdanie → Tłumaczenie (przykład użycia w jezyku polskim)
        </label>
        <textarea
          id="card-sentence-translation"
          value={sentenceTranslation}
          onChange={(e) => setSentenceTranslation(e.target.value)}
          placeholder="np. Biegam każdego ranka."
          rows={2}
          className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          Anuluj
        </button>
        <button
          type="submit"
          disabled={!front.trim() || !back.trim() || loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Zapisywanie..." : "Zapisz"}
        </button>
      </div>
    </form>
  );
};

export default CardForm;
