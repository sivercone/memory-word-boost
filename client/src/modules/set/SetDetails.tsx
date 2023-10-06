import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SetInterface } from '@src/interfaces';
import { DropdownMenu } from '@src/ui';
import { MoreIcon } from '@src/ui/Icons';
import { SetDelete } from '@src/modules/set/SetDelete';

const SetDetails: React.FC<{ queryId: string; data: SetInterface }> = ({ queryId, data: set }) => {
  const router = useRouter();
  const [deletion, setDeletion] = React.useState(false);

  const studyMethods = [
    { title: 'Learn', href: `${queryId}/learn` },
    { title: 'Flashcards', href: `${queryId}/flashcards` },
    { title: 'Write', href: `${queryId}/write` },
    { title: 'Exam', href: `${queryId}/exam` },
  ];

  const menuOptions = [
    { title: 'Author', action: () => router.push(`/user/${set.user.id}`) },
    { title: 'Edit', action: () => router.push(`${queryId}/edit`) },
    { title: 'Add to Folder', action: () => router.push(`${queryId}/edit/folders`) },
    { title: 'Delete', action: () => setDeletion(true) },
  ];

  return (
    <>
      <div className="bg-white py-8 border-b border-b-gray-200">
        <div className="max-w-3xl mx-auto flex flex-col gap-4 px-4">
          <div>
            <h1 className="text-2xl font-medium">{set.title}</h1>
            {set.description ? <p className="leading-relaxed text-gray-600">{set.description}</p> : null}
          </div>
          {studyMethods.map((item) => (
            <Link key={item.title} href={item.href}>
              <a className="border border-gray-200 border-solid w-full p-2 rounded-lg flex items-center justify-center">
                {item.title}
              </a>
            </Link>
          ))}
          <DropdownMenu
            options={menuOptions}
            trigger={
              <button className="border border-gray-200 border-solid w-full p-2 rounded-lg flex items-center justify-center">
                <MoreIcon />
              </button>
            }
            keyExtractor={(item) => item.title}
            renderItem={(item) => (
              <DropdownMenu.Item onClick={item.action}>
                <span>{item.title}</span>
              </DropdownMenu.Item>
            )}
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-xl mb-4 font-medium">Overview</h2>
        <ul className="flex flex-col gap-2">
          {set.cards.map((content, i) => (
            <li key={i} className="flex border-b border-b-gray-200 p-2">
              <p className="basis-full">{content.term}</p>
              <p className="basis-full">{content.definition}</p>
            </li>
          ))}
        </ul>
      </div>

      <SetDelete data={set} open={deletion} setOpen={setDeletion} />
    </>
  );
};

export default SetDetails;
