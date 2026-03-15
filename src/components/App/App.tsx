import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { toast, Toaster } from 'react-hot-toast';

import css from './App.module.css';
import { fetchNotes } from '../../services/noteService';

import NoteList from '../NoteList/NoteList';
import ErrorMessage from '../ErrorMesage/ErrorMessage';
// import Pagination from '../Pagination/Pagination';

function App() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState<string>(() => {
    const savedQuery = localStorage.getItem('query');
    return savedQuery ? JSON.parse(savedQuery) : '';
  });

  const { data, isError, isSuccess } = useQuery({
    queryKey: ['notes', query, page],
    queryFn: () => fetchNotes(query, page),
    // enabled: query !== '',
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  // const totalPages = data?.totalPages ?? 0;

  useEffect(() => {
    if (isSuccess && notes.length === 0) {
      toast.error('No notes found for your request.');
    }
  }, [isSuccess, notes.length]);

  useEffect(() => {
    localStorage.setItem('query', JSON.stringify(query));
  }, [query]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {/* Компонент SearchBox */}

        {/* {isSuccess && totalPages > 1 && (
          <Pagination totalPages={totalPages} page={page} setPage={setPage} />
        )} */}

        <button className={css.button}>Create note +</button>
      </header>
      <Toaster />
      {isError ? <ErrorMessage /> : <NoteList notes={notes} />}
    </div>
  );
}

export default App;
