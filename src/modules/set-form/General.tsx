import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { utils } from '@src/lib';
import { useLocalStore, useRuntimeStore } from '@src/stores';
import * as Types from '@src/types';
import { Button, Icons, Input } from '@src/ui';

const General: React.FC = () => {
  const router = useRouter();
  const { userId, sets, folders, ...localStore } = useLocalStore();
  const { studySetDraft, ...rtStore } = useRuntimeStore();
  const form = useForm<Pick<Types.SetForm, 'name' | 'description'>>();

  useEffect(() => form.reset(studySetDraft), [form.reset, studySetDraft]);

  const onSubmit = (formData: Pick<Types.SetForm, 'name' | 'description'>) => {
    if (!userId) return;
    try {
      const currSet = studySetDraft.id ? sets.find((item) => item.id === studySetDraft.id) : null;
      const nextSets = sets.filter((item) => item.id !== studySetDraft.id);

      const newSet = {
        ...currSet,
        ...studySetDraft,
        name: formData.name,
        description: formData.description,
        id: currSet?.id || utils.string.nanoid(),
        userId,
        folderId: studySetDraft.folderId,
        createdAt: currSet?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } satisfies Types.SetModel;

      const updatedFolders = folders.map((item) =>
        item.id === newSet.folderId
          ? ({ ...item, setIds: Array.from(new Set([...item.setIds, newSet.id])) } satisfies Types.FolderModel)
          : item,
      );

      localStore.setValues({ sets: [...nextSets, newSet], folders: updatedFolders });
      router.push(`/sets/${newSet.id}`);
    } catch (error) {
      utils.func.handleError(error);
    }
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-medium text-onSurface">{studySetDraft.id ? 'Edit Set' : 'New Set'}</h1>
        <div className="ml-auto flex items-center gap-4">
          {studySetDraft.id ? (
            <Button onClick={() => router.push(`/sets/${studySetDraft.id}`)}>
              <span className="font-medium">Cancel</span>
            </Button>
          ) : null}
          <Button onClick={form.handleSubmit(onSubmit)}>
            <span className="font-medium">Save</span>
          </Button>
        </div>
      </div>
      <form autoComplete="off">
        <fieldset className="flex flex-col gap-4">
          <Input
            placeholder="Name"
            {...form.register('name', {
              required: true,
              onChange: (event) => rtStore.setValues({ studySetDraft: { ...studySetDraft, name: event.target.value } }),
            })}
          />
          <Input
            placeholder="Description"
            {...form.register('description', {
              onChange: (event) => rtStore.setValues({ studySetDraft: { ...studySetDraft, description: event.target.value } }),
            })}
          />
        </fieldset>
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
        <Button
          key={item.id}
          onClick={() => router.push(item.href)}
          className="w-full flex-col items-stretch gap-1 overflow-hidden p-4 text-left"
        >
          <div className="flex items-center">
            <span className="font-medium">{item.name}</span>
            <Icons.ChevronRight className="ml-auto fill-onBackground" />
          </div>
          <span className="block max-w-[89%] text-sm text-onBackground">{item.lore}</span>
        </Button>
      ))}
    </div>
  );
};

export default General;
