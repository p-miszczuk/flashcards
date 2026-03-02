import axios from 'axios';

const BASE = 'http://localhost:3001/api';

export type Group = {
  id: number;
  name: string;
  createdAt: string;
  _count: { cards: number };
};

export const getGroups = (): Promise<Group[]> =>
  axios.get<Group[]>(`${BASE}/groups`).then((r) => r.data);

export const createGroup = (name: string): Promise<Group> =>
  axios.post<Group>(`${BASE}/groups`, { name }).then((r) => r.data);

export const updateGroup = (id: number, name: string): Promise<Group> =>
  axios.put<Group>(`${BASE}/groups/${id}`, { name }).then((r) => r.data);

export const deleteGroup = (id: number): Promise<void> =>
  axios.delete(`${BASE}/groups/${id}`).then(() => undefined);
