import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCards, createCard, updateCard, deleteCard, type Card, type CardStatus } from '../api/cards';
import { getGroups, type Group } from '../api/groups';
import FlashCard from '../components/FlashCard';
import CardForm from '../components/CardForm';
import Modal from '../components/Modal';

type Tab = 'TO_LEARN' | 'LEARNED';

type ModalState =
  | { type: 'create' }
  | { type: 'edit'; card: Card }
  | { type: 'delete'; card: Card }
  | null;

const STORAGE_KEY = 'fiszki-language-order';

const CardsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const groupId = parseInt(id ?? '0');

  const [group, setGroup] = useState<Group | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('TO_LEARN');
  const [modal, setModal] = useState<ModalState>(null);
  const [englishFirst, setEnglishFirst] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored !== 'pl';
  });

  const handleLanguageOrderToggle = () => {
    setEnglishFirst((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? 'en' : 'pl');
      return next;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const [allGroups, allCards] = await Promise.all([getGroups(), getCards(groupId)]);
      const found = allGroups.find((g) => g.id === groupId) ?? null;
      setGroup(found);
      setCards(allCards);
      setLoading(false);
    };
    fetchData();
  }, [groupId]);

  const filteredCards = cards.filter((c) => c.status === activeTab);

  const handleCreate = async (
    front: string,
    back: string,
    sentence?: string,
    sentenceTranslation?: string
  ) => {
    const card = await createCard({
      front,
      back,
      sentence,
      sentenceTranslation,
      groupId,
    });
    setCards((prev) => [card, ...prev]);
    setModal(null);
  };

  const handleEdit = async (
    front: string,
    back: string,
    sentence?: string,
    sentenceTranslation?: string
  ) => {
    if (modal?.type !== 'edit') return;
    const updated = await updateCard(modal.card.id, {
      front,
      back,
      sentence,
      sentenceTranslation,
    });
    setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setModal(null);
  };

  const handleStatusToggle = async (card: Card) => {
    const newStatus: CardStatus = card.status === 'TO_LEARN' ? 'LEARNED' : 'TO_LEARN';
    const updated = await updateCard(card.id, { status: newStatus });
    setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDelete = async () => {
    if (modal?.type !== 'delete') return;
    await deleteCard(modal.card.id);
    setCards((prev) => prev.filter((c) => c.id !== modal.card.id));
    setModal(null);
  };

  const tabCounts = {
    TO_LEARN: cards.filter((c) => c.status === 'TO_LEARN').length,
    LEARNED: cards.filter((c) => c.status === 'LEARNED').length,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          aria-label="Wróć do grup"
          className="mb-4 flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-indigo-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Wszystkie grupy
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{group?.name ?? 'Group'}</h1>
            <p className="mt-1 text-slate-500">
              {cards.length} {cards.length === 1 ? 'fiszka' : 'fiszek'} łącznie
            </p>
          </div>
          <button
            onClick={() => setModal({ type: 'create' })}
            aria-label="Dodaj nową fiszkę"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Dodaj fiszkę
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleLanguageOrderToggle}
          aria-label={englishFirst ? 'Pokaż najpierw polski' : 'Pokaż najpierw angielski'}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <span className={englishFirst ? 'font-semibold text-indigo-600' : 'text-slate-400'}>
            EN
          </span>
          <span className="text-slate-300">↔</span>
          <span className={!englishFirst ? 'font-semibold text-indigo-600' : 'text-slate-400'}>
            PL
          </span>
          <span className="text-slate-500">
            {englishFirst ? '(ang. pierwszy)' : '(pol. pierwszy)'}
          </span>
        </button>
      </div>

      <div className="mb-6 flex gap-1 rounded-xl bg-slate-100 p-1">
        {(['TO_LEARN', 'LEARNED'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            aria-label={tab === 'TO_LEARN' ? 'Pokaż do nauki' : 'Pokaż nauczone'}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition ${
              activeTab === tab
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'TO_LEARN' ? 'Do nauki' : 'Nauczone'}
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                activeTab === tab
                  ? tab === 'TO_LEARN'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {tabCounts[tab]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center">
          <p className="text-slate-500">
            {activeTab === 'TO_LEARN' ? 'Brak fiszek do nauki.' : 'Brak nauczonych fiszek.'}
          </p>
          {activeTab === 'TO_LEARN' && (
            <button
              onClick={() => setModal({ type: 'create' })}
              className="mt-3 text-sm font-medium text-indigo-600 hover:underline"
            >
              Dodaj pierwszą fiszkę
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCards.map((card) => (
            <FlashCard
              key={card.id}
              card={card}
              englishFirst={englishFirst}
              onStatusToggle={handleStatusToggle}
              onEdit={(c) => setModal({ type: 'edit', card: c })}
              onDelete={(c) => setModal({ type: 'delete', card: c })}
            />
          ))}
        </div>
      )}

      {modal?.type === 'create' && (
        <Modal title="Nowa fiszka" onClose={() => setModal(null)}>
          <CardForm onSubmit={handleCreate} onCancel={() => setModal(null)} />
        </Modal>
      )}

      {modal?.type === 'edit' && (
        <Modal title="Edytuj fiszkę" onClose={() => setModal(null)}>
          <CardForm
            initialCard={modal.card}
            onSubmit={handleEdit}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {modal?.type === 'delete' && (
        <Modal title="Usuń fiszkę" onClose={() => setModal(null)}>
          <p className="mb-6 text-slate-600">
            Czy na pewno chcesz usunąć tę fiszkę?{' '}
            <span className="font-semibold text-slate-800">"{modal.card.front}"</span> zostanie
            trwale usunięta.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setModal(null)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Anuluj
            </button>
            <button
              onClick={handleDelete}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Usuń
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CardsPage;
