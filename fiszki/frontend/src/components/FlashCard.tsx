import { useState } from "react";
import type { Card } from "../api/cards";

const speakText = (text: string) => {
  if (!text.trim() || typeof window === "undefined" || !window.speechSynthesis)
    return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-GB";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
};

const SpeakerIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
    />
  </svg>
);

type FlashCardProps = {
  card: Card;
  englishFirst?: boolean;
  onStatusToggle: (card: Card) => Promise<void>;
  onEdit: (card: Card) => void;
  onDelete: (card: Card) => void;
};

const FlashCard = ({
  card,
  englishFirst = true,
  onStatusToggle,
  onEdit,
  onDelete,
}: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFlip = () => setIsFlipped((prev) => !prev);

  const handleStatusToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    await onStatusToggle(card);
    setLoading(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(card);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(card);
  };

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    speakText(text);
  };

  const isLearned = card.status === "LEARNED";

  const speakerButton = (text: string, label: string) => (
    <button
      type="button"
      onClick={(e) => handleSpeak(e, text)}
      aria-label={label}
      className="ml-1.5 inline-flex shrink-0 rounded-full p-1 text-slate-400 transition hover:bg-slate-200/60 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
    >
      <SpeakerIcon className="h-4 w-4" />
    </button>
  );

  return (
    <div className="flex flex-col gap-2">
      <div
        role="button"
        tabIndex={0}
        aria-label={`Flashcard: ${card.front}. Click to flip.`}
        onClick={handleFlip}
        onKeyDown={(e) => e.key === "Enter" && handleFlip()}
        className="card-flip h-56 cursor-pointer"
      >
        <div
          className={`card-flip-inner h-full w-full ${isFlipped ? "flipped" : ""}`}
        >
          <div className="card-face flex h-full w-full flex-col justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="space-y-2 text-left">
              {englishFirst ? (
                <>
                  <div className="flex items-start gap-0">
                    <div className="min-w-0 flex-1">
                      <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                        Przednia strona (słowo)
                      </p>
                      <p className="text-lg font-semibold text-slate-800">
                        {card.front}
                      </p>
                    </div>
                    {speakerButton(card.front, "Wymów słowo")}
                  </div>
                  {card.sentence && (
                    <div className="flex items-start gap-0">
                      <div className="min-w-0 flex-1">
                        <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                          Zdanie (przykład użycia)
                        </p>
                        <p className="text-sm text-slate-700">
                          {card.sentence}
                        </p>
                      </div>
                      {speakerButton(card.sentence, "Wymów zdanie")}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                      Tłumaczenie
                    </p>
                    <p className="text-lg font-semibold text-slate-800">
                      {card.back}
                    </p>
                  </div>
                  {card.sentenceTranslation && (
                    <div>
                      <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                        Zdanie → Tłumaczenie (przykład użycia)
                      </p>
                      <p className="text-sm text-slate-700">
                        {card.sentenceTranslation}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="card-face card-face-back flex h-full w-full flex-col justify-center rounded-2xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm">
            <div className="space-y-2 text-left">
              {englishFirst ? (
                <>
                  <div>
                    <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-indigo-400">
                      Tłumaczenie
                    </p>
                    <p className="text-base font-semibold text-indigo-800">
                      {card.back}
                    </p>
                  </div>
                  {card.sentenceTranslation && (
                    <div>
                      <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-indigo-400">
                        Zdanie → Tłumaczenie (przykład użycia)
                      </p>
                      <p className="text-sm italic text-indigo-600">
                        {card.sentenceTranslation}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-start gap-0">
                    <div className="min-w-0 flex-1">
                      <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-indigo-400">
                        Przednia strona (słowo)
                      </p>
                      <p className="text-base font-semibold text-indigo-800">
                        {card.front}
                      </p>
                    </div>
                    {speakerButton(card.front, "Wymów słowo")}
                  </div>
                  {card.sentence && (
                    <div className="flex items-start gap-0">
                      <div className="min-w-0 flex-1">
                        <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-indigo-400">
                          Zdanie (przykład użycia)
                        </p>
                        <p className="text-sm italic text-indigo-600">
                          {card.sentence}
                        </p>
                      </div>
                      {speakerButton(card.sentence, "Wymów zdanie")}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <button
          onClick={handleStatusToggle}
          disabled={loading}
          aria-label={
            isLearned ? "Przenieś z powrotem do nauki" : "Oznacz jako nauczone"
          }
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition disabled:opacity-50 ${
            isLearned
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              : "bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-700"
          }`}
        >
          {isLearned ? (
            <>
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Nauczone
            </>
          ) : (
            <>
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Oznacz jako nauczone
            </>
          )}
        </button>

        <div className="flex gap-1">
          <button
            onClick={handleEditClick}
            aria-label="Edytuj fiszkę"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={handleDeleteClick}
            aria-label="Usuń fiszkę"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
