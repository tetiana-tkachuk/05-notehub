import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { toast, Toaster } from 'react-hot-toast';

import css from './App.module.css';
import { fetchNotes } from '../../services/noteService';

import NoteList from '../NoteList/NoteList';
import ErrorMessage from '../ErrorMesage/ErrorMessage';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import { useDebouncedCallback } from 'use-debounce';
import Loader from '../../Loader/Loader';

function App() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isError, isSuccess, isPending } = useQuery({
    queryKey: ['notes', query, page],
    queryFn: () => fetchNotes(query, page),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  useEffect(() => {
    if (isSuccess && notes.length === 0) {
      toast.error('No notes found for your request.');
    }
  }, [isSuccess, notes.length]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const debounced = useDebouncedCallback(newQuery => {
    setQuery(newQuery);
    setPage(1);
  }, 1000);

  const handleSearch = (newQuery: string) => {
    debounced(newQuery);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={query} onSearch={handleSearch} />

        {isSuccess && totalPages > 1 && (
          <Pagination totalPages={totalPages} page={page} setPage={setPage} />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      <Toaster />
      {isPending && <Loader />}
      {isError ? <ErrorMessage /> : <NoteList notes={notes} />}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}

export default App;
