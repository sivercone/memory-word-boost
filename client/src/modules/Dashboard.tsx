import type { NextPage } from 'next';
import { useQuery } from 'react-query';
import { ActionList, ButtonSquare } from '@src/ui';
import { authApi, folderApi } from '@src/apis';

const Dashboard: NextPage = () => {
  const user = useQuery('user', () => authApi.me()); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userFolders = useQuery(['folders', user.data?.id], () => folderApi.getByUser(user.data!.id), { enabled: !!user.data });
  const folders = [...(userFolders.data || []), { id: 'sets', name: 'Sets' }].sort((a, b) =>
    a.id === 'sets' ? -1 : b.id === 'sets' ? 1 : a.name.localeCompare(b.name),
  );

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <Banner />
      <ActionList
        header={{ title: 'Folders' }}
        data={folders}
        keyExtractor={(item) => item.id}
        renderItem={(item, index) => (
          <ActionList.Link href={`/sets?${item.id === 'sets' ? `user=${user.data?.id}` : `folder=${item.id}`}`} isFirst={index === 0}>
            {item.name}
          </ActionList.Link>
        )}
      />
    </div>
  );
};

const Banner = () => {
  return (
    <div className="space-y-2 p-4 rounded-lg bg-gradient-to-b from-violet-600 to-violet-950 border border-gray-200">
      <h2 className="text-lg font-medium text-gray-50">From Prototype to Application</h2>
      <p className="text-gray-50 text-sm">
        This website started as a prototype and now complements my mobile app. The app offers an enhanced learning experience with
        additional features not available on this site. While the website code is{' '}
        <a href="https://github.com/sivercone/memory-word-boost" target="_blank" rel="noreferrer">
          open-source
        </a>{' '}
        and showcases my development journey, the app represents the culmination of this project.
      </p>
      <ButtonSquare onClick={() => window.open('https://qsets.sivercone.com')} className="w-full">
        Learn more
      </ButtonSquare>
    </div>
  );
};

export default Dashboard;
