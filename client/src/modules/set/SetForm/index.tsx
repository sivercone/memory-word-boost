import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ChevronRightIcon } from '@src/ui/Icons';
import Link from 'next/link';
import Cards from './Cards';
import { useForm } from 'react-hook-form';
import { SetInterfaceDraft } from '@src/interfaces';
import { useMutation, useQueryClient } from 'react-query';
import { setApi } from '@src/apis';
import { useSetStore } from '@src/storage/useSetStore';
import { useUserStore } from '@src/storage/useUserStore';

const SetForm: NextPage = () => {
  const { query } = useRouter();

  React.useEffect(() => {
    const nav = document.querySelector('#navigation');
    if (query.tab === 'cards') nav?.classList.remove('sticky');
    else nav?.classList.add('sticky');
    return () => {
      nav?.classList.add('sticky');
    };
  }, [query]);

  return <>{query.tab === 'cards' ? <Cards /> : query.tab === 'folders' ? <></> : <SetGeneral />}</>;
};

const SetGeneral = () => {
  const router = useRouter();
  const { user, signAccess } = useUserStore();
  const setStore = useSetStore();
  const { register, handleSubmit } = useForm<SetInterfaceDraft>();

  const queryClient = useQueryClient();
  const save = useMutation(setApi.save, {
    onSuccess: () => {
      queryClient.invalidateQueries('sets');
      router.push(`/${save.data}`);
    },
  });
  const onSubmit = async (payload: SetInterfaceDraft) => {
    const data = { ...setStore.currStudySet, ...payload, user: user!, tags: [], cards: [] };
    console.log([setStore.currStudySet, payload, user]);
    try {
      await save.mutateAsync({ data, token: signAccess });
    } catch (error) {}
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4 py-4 px-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-medium">New Set</h1>
        <button onClick={handleSubmit(onSubmit)} className="ml-auto bg-white border border-gray-200 border-solid p-2 rounded-lg">
          Save
        </button>
      </div>
      <form autoComplete="off" className="flex flex-col gap-4">
        <input
          placeholder="Name"
          {...register('title', { required: true })}
          className="border border-gray-200 border-solid p-2 rounded-lg bg-white"
        />
        <input
          placeholder="Description"
          {...register('description')}
          className="border border-gray-200 border-solid p-2 rounded-lg bg-white"
        />
      </form>

      {[
        {
          id: 'cards',
          name: 'Cards',
          lore: 'Create, edit or remove cards in your Set. Personalize each card with unique content to facilitate your learning journey.',
          href: `${router.pathname}?tab=cards`,
        },
        {
          id: 'folders',
          name: 'Folders',
          lore: 'Organize your Set by adding it to specific folders. Keep your study materials neat and easily accessible by grouping related Sets together.',
          href: `${router.pathname}?tab=folders`,
        },
      ].map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="p-4 flex flex-col gap-1 border border-gray-200 border-solid overflow-hidden rounded-lg bg-white w-full"
          legacyBehavior={false}
        >
          <div className="flex items-center">
            <span className="font-medium">{item.name}</span>
            <ChevronRightIcon className="ml-auto fill-gray-600" />
          </div>
          <span className="block text-sm max-w-[89%] text-gray-600">{item.lore}</span>
        </Link>
      ))}
    </div>
  );
};

export default SetForm;
