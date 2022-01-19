import { folderApi } from 'api/folderApi';
import { NextPage } from 'next';
import Link from 'next/link';
import Custom404 from 'pages/404';
import React from 'react';
import { dehydrate, QueryClient, useMutation, useQuery, useQueryClient } from 'react-query';
import style from 'styles/pages/set.module.scss';
import style2 from 'styles/pages/home.module.scss'; // todo - fix that
import { FolderEditing } from 'components/FolderEditing';
import { useRouter } from 'next/dist/client/router';
import { Modal, ModalActions, ModalBody, ModalList } from 'components/Modal';
import { notify } from 'utils/notify';
import { setApi } from 'api/setApi';
import { SetInterface } from 'interfaces';
import { useUserStore } from 'storage/useUserStore';
import { CardBoxSet } from 'components/CardBox';

type ModalVariants = 'edit' | 'del' | 'sets';

const FolderPage: NextPage<{ pagekey: string }> = ({ pagekey }) => {
  const folder = useQuery(['folder', pagekey], () => folderApi.getById(pagekey), { enabled: !!pagekey });
  if (!folder.data) return <Custom404 />;

  const router = useRouter();
  const { user } = useUserStore();

  // update folder
  const [shownModal, setShownModal] = React.useState<ModalVariants>();
  const openModal = (payload: ModalVariants) => setShownModal(payload);
  const closeModal = () => setShownModal(undefined);

  // delete
  const queryClient = useQueryClient();
  const fetchDelete = useMutation(folderApi.delete, { onSuccess: () => queryClient.invalidateQueries('folders') });
  const onDelete = async () => {
    try {
      await fetchDelete.mutateAsync(folder.data.id);
      router.push('/');
      notify(`Successfully deleted folder: ${folder.data.name}`);
    } catch (error) {}
  };

  // include or exclude sets
  const sets = useQuery('sets', setApi.get, { enabled: shownModal === 'sets' });
  const [includedSets, setIncludedSets] = React.useState<SetInterface[]>([]);
  React.useEffect(() => {
    if (folder.data) setIncludedSets(folder.data.sets);
  }, [folder.data, folder.dataUpdatedAt]);
  const toggleIncludeFolder = (payload: SetInterface) => {
    if (!!includedSets.find((set) => set.id === payload.id)) setIncludedSets(includedSets.filter((el) => el.id !== payload.id));
    else setIncludedSets([...includedSets, payload]);
  };
  const fetchUpdate = useMutation(folderApi.update, { onSuccess: () => queryClient.invalidateQueries(['folder', pagekey]) });
  const updateFolderSets = async () => {
    try {
      await fetchUpdate.mutateAsync({ ...folder.data, sets: includedSets });
      closeModal();
    } catch (error) {}
  };

  return (
    <div className="container">
      <div className={style.card}>
        <h1 className={style.card__h1}>
          <span>{folder.data.name}</span>
        </h1>
        <p>{folder.data.description}</p>
      </div>
      <div className={style.createdby}>
        <div className={style.createdby__author}>
          <span>
            Created by{' '}
            <Link href={`/u/${folder.data.user.id}`}>
              <a>{folder.data.user.name}</a>
            </Link>{' '}
            {folder.data.user.id === user?.id ? '(you)' : undefined}
          </span>
        </div>
        <div className={style.createdby__movements}>
          <button onClick={() => openModal('edit')} title="edit">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#181818">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" />
            </svg>
          </button>
          <button onClick={() => openModal('sets')} title="include or exclude sets">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              enableBackground="new 0 0 24 24"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              fill="#181818">
              <g>
                <rect fill="none" height="24" width="24" />
              </g>
              <g>
                <g />
                <g>
                  <path d="M17,19.22H5V7h7V5H5C3.9,5,3,5.9,3,7v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-7h-2V19.22z" />
                  <path d="M19,2h-2v3h-3c0.01,0.01,0,2,0,2h3v2.99c0.01,0.01,2,0,2,0V7h3V5h-3V2z" />
                  <rect height="2" width="8" x="7" y="9" />
                  <polygon points="7,12 7,14 15,14 15,12 12,12" />
                  <rect height="2" width="8" x="7" y="15" />
                </g>
              </g>
            </svg>
          </button>
          <button onClick={() => openModal('del')} title="delete">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#181818">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
            </svg>
          </button>
          <button title="info">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#181818">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
          </button>
          <button title="share">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              enableBackground="new 0 0 24 24"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              fill="#181818">
              <g>
                <rect fill="none" height="24" width="24" />
              </g>
              <g>
                <path d="M16,5l-1.42,1.42l-1.59-1.59V16h-1.98V4.83L9.42,6.42L8,5l4-4L16,5z M20,10v11c0,1.1-0.9,2-2,2H6c-1.11,0-2-0.9-2-2V10 c0-1.11,0.89-2,2-2h3v2H6v11h12V10h-3V8h3C19.1,8,20,8.89,20,10z" />
              </g>
            </svg>
          </button>
        </div>
      </div>
      <h2 style={{ marginBottom: '1rem' }}>Study sets in this folder ({folder.data.sets.length})</h2>
      <div className={style2.cardlist}>
        {folder.data.sets.map((content) => (
          <CardBoxSet key={content.id} content={content} />
        ))}
      </div>
      <FolderEditing folderFigure={folder.data} isOpen={shownModal === 'edit'} onClose={closeModal} />
      <Modal isOpen={shownModal === 'del'} onClose={closeModal}>
        <ModalBody>
          <h3>Are you sure you want to delete this folder?</h3>
          <p>Deleting a folder is a permanent action.</p>
          <p>This cannot be undone.</p>
          <p>The sets in this folder will not be deleted.</p>
        </ModalBody>
        <ModalActions>
          <button onClick={closeModal}>Cancel</button>
          <button onClick={onDelete}>Delete</button>
        </ModalActions>
      </Modal>
      <Modal isOpen={shownModal === 'sets'} onClose={closeModal}>
        <ModalBody>
          <h3>Sets Management</h3>
          <p>Include or exclude sets to this folder</p>
        </ModalBody>
        {sets.data ? (
          <ModalList>
            {sets.data.map((content) => (
              <li key={content.id}>
                <label className="checkbox">
                  <span>{content.title}</span>
                  <input
                    onClick={() => toggleIncludeFolder(content)}
                    type="checkbox"
                    defaultChecked={!!includedSets.find((el) => el.id === content.id)}
                  />
                </label>
              </li>
            ))}
          </ModalList>
        ) : undefined}
        <ModalActions>
          <button onClick={closeModal}>Cancel</button>
          <button onClick={updateFolderSets}>Apply</button>
        </ModalActions>
      </Modal>
    </div>
  );
};

FolderPage.getInitialProps = async ({ query }) => {
  const pagekey = typeof query.folder === 'string' ? query.folder : '';
  const queryClient = new QueryClient();
  if (pagekey) await queryClient.prefetchQuery(['folder', pagekey], () => folderApi.getById(pagekey));
  return { pagekey, dehydratedState: dehydrate(queryClient) };
};

export default FolderPage;
