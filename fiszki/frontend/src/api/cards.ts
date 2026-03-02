import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export type CardStatus = "TO_LEARN" | "LEARNED";

export type Card = {
  id: number;
  front: string;
  back: string;
  sentence?: string | null;
  sentenceTranslation?: string | null;
  status: CardStatus;
  createdAt: string;
  groupId: number;
};

export const getCards = (groupId: number): Promise<Card[]> =>
  axios
    .get<Card[]>(`${BASE}/cards`, { params: { groupId } })
    .then((r) => r.data);

export const createCard = (data: {
  front: string;
  back: string;
  sentence?: string;
  sentenceTranslation?: string;
  groupId: number;
}): Promise<Card> =>
  axios.post<Card>(`${BASE}/cards`, data).then((r) => r.data);

export const updateCard = (
  id: number,
  data: Partial<
    Pick<Card, "front" | "back" | "sentence" | "sentenceTranslation" | "status">
  >,
): Promise<Card> =>
  axios.put<Card>(`${BASE}/cards/${id}`, data).then((r) => r.data);

export const deleteCard = (id: number): Promise<void> =>
  axios.delete(`${BASE}/cards/${id}`).then(() => undefined);
