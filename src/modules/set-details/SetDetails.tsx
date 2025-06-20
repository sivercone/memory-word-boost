import { useRouter } from 'next/router';
import { useState } from 'react';

import { useLocalStore } from '@src/stores';
import { ActionList, Button, ButtonLink, DropdownMenu, Icons } from '@src/ui';

import DeleteDialog from './SetDelete';

const SetDetails = () => {
  const router = useRouter();
  const localStore = useLocalStore();
  const [deletion, setDeletion] = useState(false);
  const set = localStore.sets.find((item) => item.id === router.query.id);

  if (!set) return null;

  const studyMethods = [{ title: 'Flashcards', href: `${set.id}/flashcards` }];
  const menuOptions = [
    { title: 'Author', action: () => router.push(`/user/${set.userId}`), icon: <Icons.Person /> },
    { title: 'Edit', action: () => router.push(`${set.id}/edit`), icon: <Icons.Edit /> },
    { title: 'Add to Folder', action: () => router.push(`${set.id}/edit?tab=folders`), icon: <Icons.Folder /> },
    { title: 'Delete', action: () => setDeletion(true), icon: <Icons.Delete /> },
  ];

  return (
    <>
      <div className="border-b border-b-outline bg-surface py-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4">
          <div>
            <h1 className="text-2xl font-medium text-onSurface">{set.name}</h1>
            {set.description ? <p className="leading-relaxed text-onBackground">{set.description}</p> : null}
          </div>
          {studyMethods.map((item) => (
            <ButtonLink key={item.title} href={item.href}>
              <span className="font-medium">{item.title}</span>
            </ButtonLink>
          ))}
          <DropdownMenu
            options={menuOptions}
            trigger={
              <Button title="Actions">
                <Icons.More />
              </Button>
            }
            keyExtractor={(item) => item.title}
            renderItem={(item) => (
              <DropdownMenu.Item onClick={item.action} className="justify-between">
                <span>{item.title}</span>
                {item.icon}
              </DropdownMenu.Item>
            )}
          />
        </div>
      </div>

      <div className="mx-auto max-w-3xl p-4">
        <ActionList.HeaderTitle className="mb-4">Overview</ActionList.HeaderTitle>
        {set.cards.length ? (
          <ul className="flex flex-col gap-2">
            {set.cards.map((content, index) => (
              <li key={index} className="flex gap-2 border-b border-b-outline py-2">
                <p className="basis-full">{content.front}</p>
                <p className="basis-full">{content.back}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-onBackground">Nothing yet</p>
        )}
      </div>

      <DeleteDialog data={set} open={deletion} close={() => setDeletion(false)} />
    </>
  );
};

export default SetDetails;
