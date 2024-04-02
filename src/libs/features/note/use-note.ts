import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { queryClient } from '~/helpers/config';
import {
  addNoteAPI,
  deleteNoteAPI,
  getNoteAPI,
  getNotesAPI,
  updateNoteAPI,
} from './note.api';
import { AddUpdateNoteModel, GetNoteProps, ListNotesProps } from './note.model';

const QUERY_KEY = 'notes';

export const useNotes = ({
  page = 1,
  size = 10,
  lectureId,
  courseId,
  enable,
}: ListNotesProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, page, size, courseId, lectureId],
    queryFn: () =>
      getNotesAPI({
        page,
        size,
        lectureId,
        courseId,
      }),
    enabled: enable,
  });

  const notes = useMemo(
    () => ({
      notes: data?.data?.notes || [],
      current_page: page,
      total_page: data?.data?.totalPage || 0,
      row_per_page: size || 10,
      total_notes: data?.data?.totalItem || 0,
    }),
    [data, page]
  );

  return { ...notes, ...others };
};

export const useNote = ({ id }: GetNoteProps) => {
  const { data, ...others } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: ({ queryKey }) =>
      getNoteAPI({ id: queryKey.at(-1) as GetNoteProps['id'] }),
    enabled: !!id,
  });

  const note = useMemo(() => data?.data.note, [data]);

  return { note, ...others };
};

export const useNoteMutations = () => {
  const router = useRouter();
  const page = parseInt(router?.query?.page as string) || 1;

  const addNoteMutation = useMutation({
    mutationFn: (data: AddUpdateNoteModel) => addNoteAPI(data),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const addNewNote = async (data: AddUpdateNoteModel) => {
    return addNoteMutation.mutateAsync(data);
  };

  const updateNoteMutation = useMutation({
    mutationFn: (vars: never[]) => updateNoteAPI(vars[0], vars[1]),
    onSuccess(data, variables) {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
      queryClient.setQueryData([QUERY_KEY, variables[0]], data);
    },
  });
  const updateNote = async (id: string, data: AddUpdateNoteModel) => {
    return updateNoteMutation.mutateAsync([id as never, data as never]);
  };

  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => deleteNoteAPI(id),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [QUERY_KEY, page] });
    },
  });
  const deleteNote = async (id: string) => {
    return deleteNoteMutation.mutateAsync(id);
  };

  return { addNewNote, updateNote, deleteNote };
};
