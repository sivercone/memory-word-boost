import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { SetInterface } from '@src/interfaces';
import { ActionList, ButtonSquare, DropdownMenu } from '@src/ui';
import { DeleteIcon, EditIcon, FolderIcon, MoreIcon, PersonIcon } from '@src/ui/Icons';
import { SetDelete } from '@src/modules/set/SetDelete';
import { setApi } from '@src/apis';

const SetDetails: React.FC<{ queryId: string; data: SetInterface }> = ({ queryId, data }) => {
  const router = useRouter();
  const [deletion, setDeletion] = React.useState(false);
  const { data: set = data } = useQuery(['set', queryId], () => setApi.getById(queryId));

  const studyMethods = [{ title: 'Flashcards', href: `${queryId}/flashcards` }];
  const menuOptions = [
    { title: 'Author', action: () => router.push(`/user/${set?.user.id}`), icon: <PersonIcon /> },
    { title: 'Edit', action: () => router.push(`${queryId}/edit`), icon: <EditIcon /> },
    { title: 'Add to Folder', action: () => router.push(`${queryId}/edit?tab=folders`), icon: <FolderIcon /> },
    { title: 'Delete', action: () => setDeletion(true), icon: <DeleteIcon /> },
  ];

  if (!set) return null;
  return (
    <>
      <div className="bg-white py-8 border-b border-b-gray-200">
        <div className="max-w-3xl mx-auto flex flex-col gap-4 px-4">
          <div>
            <h1 className="text-2xl font-medium" data-testid="text.name">
              {set.name}
            </h1>
            {set.description ? (
              <p className="leading-relaxed text-gray-600" data-testid="text.description">
                {set.description}
              </p>
            ) : null}
          </div>
          {studyMethods.map((item) => (
            <ButtonSquare key={item.title} href={item.href}>
              <span className="font-medium">{item.title}</span>
            </ButtonSquare>
          ))}
          <DropdownMenu
            options={menuOptions}
            trigger={
              <ButtonSquare title="Actions">
                <MoreIcon />
              </ButtonSquare>
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

      <div className="max-w-3xl mx-auto p-4">
        <ActionList.HeaderTitle className="mb-4">Overview</ActionList.HeaderTitle>
        {set.cards.length ? (
          <ul className="flex flex-col gap-2">
            {set.cards.map((content) => (
              <li key={content.order} className="flex border-b border-b-gray-200 py-2 gap-2">
                <p className="basis-full">{content.front}</p>
                <p className="basis-full">{content.back}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">Nothing yet</p>
        )}
      </div>

      <SetDelete data={set} open={deletion} setOpen={setDeletion} />
    </>
  );
};

export default SetDetails;
