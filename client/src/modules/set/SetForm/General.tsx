import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { setApi } from '@src/apis';
import { ChevronRightIcon } from '@src/ui/Icons';
import { useUserStore } from '@src/storage/useUserStore';
import { SetInterface } from '@src/interfaces';
import { useSetStore } from '@src/storage/useSetStore';
import { ButtonSquare } from '@src/ui';

const General: React.FC = () => {
  const router = useRouter();
  const { user, signAccess } = useUserStore();
  const { setCurrStudySet, currStudySet } = useSetStore();
  const { register, handleSubmit, reset } = useForm<Pick<SetInterface, 'title' | 'description'>>();
  React.useEffect(() => {
    reset(currStudySet);
  }, [reset, currStudySet]);

  const queryClient = useQueryClient();
  const save = useMutation(setApi.save, {
    onSuccess: (res) => {
      queryClient.invalidateQueries('sets');
      router.push(`/sets/${res}`);
    },
  });
  const onSubmit = async (payload: Pick<SetInterface, 'title' | 'description'>) => {
    const datus = { ...currStudySet, title: payload.title, description: payload.description, user };
    await save.mutateAsync({ data: datus, token: signAccess }).catch((error) => console.error(error));
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4 py-4 px-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-medium">New Set</h1>
        <div className="ml-auto flex gap-4 items-center">
          {currStudySet.id ? (
            <ButtonSquare href={`/sets/${currStudySet.id}`}>
              <span className="font-medium">Cancel</span>
            </ButtonSquare>
          ) : null}
          <ButtonSquare onClick={handleSubmit(onSubmit)}>
            <span className="font-medium">Save</span>
          </ButtonSquare>
        </div>
      </div>
      <form autoComplete="off" className="flex flex-col gap-4">
        <input
          placeholder="Name"
          {...register('title', { required: true, onChange: (event) => setCurrStudySet({ title: event.target.value }) })}
          className="border border-gray-200 border-solid p-2 rounded-lg bg-white"
        />
        <input
          placeholder="Description"
          {...register('description', { onChange: (event) => setCurrStudySet({ description: event.target.value }) })}
          className="border border-gray-200 border-solid p-2 rounded-lg bg-white"
        />
      </form>

      {[
        {
          id: 'cards',
          name: 'Cards',
          lore: 'Create, edit or remove cards in your Set. Personalize each card with unique content to facilitate your learning journey.',
          href: `${router.asPath}?tab=cards`,
        },
        {
          id: 'folders',
          name: 'Folders',
          lore: 'Organize your Set by adding it to specific folders. Keep your study materials neat and easily accessible by grouping related Sets together.',
          href: `${router.asPath}?tab=folders`,
        },
      ].map((item) => (
        <ButtonSquare key={item.id} href={item.href} className="p-4 flex-col gap-1 overflow-hidden w-full items-stretch text-left">
          <div className="flex items-center">
            <span className="font-medium">{item.name}</span>
            <ChevronRightIcon className="ml-auto fill-gray-600" />
          </div>
          <span className="block text-sm max-w-[89%] text-gray-600">{item.lore}</span>
        </ButtonSquare>
      ))}
    </div>
  );
};

export default General;
