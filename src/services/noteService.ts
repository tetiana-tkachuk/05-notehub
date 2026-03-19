import axios from 'axios';
import type { Note, NoteTag } from '../types/note';

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';
axios.defaults.headers.common['Authorization'] =
  `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`;

interface NotehubResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (query: string, page: number) => {
  const response = await axios.get<NotehubResponse>('/notes', {
    params: {
      search: query,
      page,
      perPage: 12,
    },
  });
  return response.data;
};

export const createNote = async (
  title: string,
  content: string,
  tag: NoteTag
) => {
  const response = await axios.post<Note>('/notes', {
    title,
    content,
    tag,
  });
  return response.data;
};

export const deleteNote = async (id: string) => {
  const response = await axios.delete<Note>(`/notes/${id}`);
  return response.data;
};
