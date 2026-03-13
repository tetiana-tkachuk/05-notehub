import axios from 'axios';
import type { Note } from '../types/note';

axios.defaults.baseURL = 'https://notehub-public.goit.study/api/auth/notes/';
axios.defaults.headers.common['Authorization'] =
  import.meta.env.VITE_NOTEHUB_TOKEN;
axios.defaults.params = {};

interface NotehubResponse {
  notes: Note[];
  page: number;
}

export const fetchNotes = async (query: string, page: number) => {
  const response = await axios.get<NotehubResponse>(
    `search?query=${query}&page=${page}&perPage=${12}`
  );
  return response.data;
};

export const createNote = async (title: string, content: string, tag: string) =>
  await axios.post(``, {
    title,
    content,
    tag,
  });

export const deleteNote = async (id: string) => await axios.delete(`${id}`);
