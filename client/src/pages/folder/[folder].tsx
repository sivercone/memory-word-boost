import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useMutation, useQuery, useQueryClient } from 'react-query';
import { folderApi } from 'apis/folderApi';
import { setApi } from 'apis/setApi';
import { notify } from 'lib/notify';
import { shareValue } from 'lib/utils';
import { useUserStore } from 'storage/useUserStore';
import { Modal, ModalActions, ModalBody, ModalList } from 'ui/Modal';
import { Toggle } from 'ui/Toggle';
import { CardBox } from 'ui/CardBox';
import { BottomSheet, useBottomSheet } from 'ui/BottomSheet';
import { FolderInterface, SetInterface } from 'interfaces';
import { FolderForm } from 'modules/FolderForm';
import Custom404 from 'pages/404';
import style2 from 'styles/pages/home.module.scss'; // @todo - fix that
import style from 'styles/pages/set.module.scss';

type ModalVariants = 'edit' | 'del' | 'sets';

const FolderPage: NextPage<{ pagekey: string }> = ({ pagekey }) => {
  const router = useRouter();
  const { user, signAccess } = useUserStore();
  const queryClient = useQueryClient();

  const { toggleSheet, isSheetVisible } = useBottomSheet();
  const [shownModal, setShownModal] = React.useState<ModalVariants>();
  const openModal = (payload: ModalVariants) => {
    toggleSheet(false);
    setShownModal(payload);
  };
  const closeModal = () => {
    setIncludedSets(currFolder?.sets || []);
    setShownModal(undefined);
  };

  const folder = useQuery(['folder', pagekey], () => folderApi.getById(pagekey), { enabled: !!pagekey }); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userSets = useQuery('userSets', () => setApi.getByUser(user!.id), {
    enabled: shownModal === 'sets' && !!user,
  });
  const sets = userSets.data;

  const [currFolder, setCurrFolder] = React.useState<FolderInterface>();
  React.useEffect(() => {
    if (folder.data) {
      setCurrFolder(folder.data);
      setIncludedSets(folder.data.sets || []);
    }
  }, [folder.data]);

  const fetchDelete = useMutation(folderApi.delete, {
    onSuccess: () => {
      notify('Successfully deleted folder');
      queryClient.invalidateQueries('userFolders');
      return router.push('/');
    },
  });
  const onDelete = async () => {
    if (!currFolder) return;
    await fetchDelete.mutateAsync({ id: currFolder.id, token: signAccess }).catch(() => null);
  };

  const [includedSets, setIncludedSets] = React.useState<SetInterface[]>([]);
  const toggleIncludeFolder = (payload: SetInterface) => {
    if (includedSets.find((set) => set.id === payload.id)) setIncludedSets(includedSets.filter((el) => el.id !== payload.id));
    else setIncludedSets([...includedSets, payload]);
  };

  const fetchUpdate = useMutation(folderApi.save, { onSuccess: () => queryClient.invalidateQueries(['folder', pagekey]) });
  const updateFolderSets = async () => {
    if (!currFolder) return;
    await fetchUpdate.mutateAsync({ data: { ...currFolder, sets: includedSets }, token: signAccess }).catch(() => null);
    closeModal();
  };

  if (!currFolder) return <Custom404 />;
  return (
    <div className="container">
      <div className={style.head}>
        <div className={style.head__subject}>
          <h1>{currFolder.name}</h1>
          <p>{currFolder.description}</p>
        </div>
      </div>
      <div className={style.nav}>
        <Link href={`/u/${currFolder.user.id}`}>
          <a>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
              <path d="M12 12q-1.65 0-2.825-1.175Q8 9.65 8 8q0-1.65 1.175-2.825Q10.35 4 12 4q1.65 0 2.825 1.175Q16 6.35 16 8q0 1.65-1.175 2.825Q13.65 12 12 12Zm-8 8v-2.8q0-.85.438-1.563.437-.712 1.162-1.087 1.55-.775 3.15-1.163Q10.35 13 12 13t3.25.387q1.6.388 3.15 1.163.725.375 1.162 1.087Q20 16.35 20 17.2V20Zm2-2h12v-.8q0-.275-.137-.5-.138-.225-.363-.35-1.35-.675-2.725-1.013Q13.4 15 12 15t-2.775.337Q7.85 15.675 6.5 16.35q-.225.125-.362.35-.138.225-.138.5Zm6-8q.825 0 1.413-.588Q14 8.825 14 8t-.587-1.412Q12.825 6 12 6q-.825 0-1.412.588Q10 7.175 10 8t.588 1.412Q11.175 10 12 10Zm0-2Zm0 10Z" />
            </svg>
            <span>{currFolder.user.name}</span>
          </a>
        </Link>
        <button onClick={() => shareValue(window.location.href)}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
            <path d="M6 23q-.825 0-1.412-.587Q4 21.825 4 21V10q0-.825.588-1.413Q5.175 8 6 8h3v2H6v11h12V10h-3V8h3q.825 0 1.413.587Q20 9.175 20 10v11q0 .825-.587 1.413Q18.825 23 18 23Zm5-7V4.825l-1.6 1.6L8 5l4-4 4 4-1.4 1.425-1.6-1.6V16Z" />
          </svg>
          <span>Share</span>
        </button>
        {currFolder.user.id === user?.id ? (
          <button onClick={() => toggleSheet()} title="More Actions">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
              <path d="M6 14q-.825 0-1.412-.588Q4 12.825 4 12t.588-1.413Q5.175 10 6 10t1.412.587Q8 11.175 8 12q0 .825-.588 1.412Q6.825 14 6 14Zm6 0q-.825 0-1.412-.588Q10 12.825 10 12t.588-1.413Q11.175 10 12 10t1.413.587Q14 11.175 14 12q0 .825-.587 1.412Q12.825 14 12 14Zm6 0q-.825 0-1.413-.588Q16 12.825 16 12t.587-1.413Q17.175 10 18 10q.825 0 1.413.587Q20 11.175 20 12q0 .825-.587 1.412Q18.825 14 18 14Z" />
            </svg>
          </button>
        ) : (
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
            <span>Info</span>
          </button>
        )}
      </div>
      <div className={style.body}>
        <h2 style={{ marginBottom: '1rem' }}>Study sets in this folder ({currFolder.sets?.length})</h2>
      </div>
      <div className={style2.cardlist}>
        {currFolder.sets?.map((content) => (
          <CardBox key={content.id} content={content.title} id={content.id} type="set" />
        ))}
      </div>
      <BottomSheet visible={isSheetVisible} toggleVisible={toggleSheet} label={currFolder.name}>
        <li>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
            <span>Information</span>
          </button>
        </li>
        <li>
          <button onClick={() => openModal('edit')}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" />
            </svg>
            <span>Edit</span>
          </button>
        </li>
        <li>
          <button onClick={() => openModal('sets')}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm0 12H4V6h5.17l2 2H20v10zm-8-4h2v2h2v-2h2v-2h-2v-2h-2v2h-2z" />
            </svg>
            <span>Manage study sets</span>
          </button>
        </li>
        <li>
          <button onClick={() => openModal('del')}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
            </svg>
            <span>Delete</span>
          </button>
        </li>
      </BottomSheet>
      <FolderForm folderFigure={currFolder} isOpen={shownModal === 'edit'} onClose={closeModal} />
      <Modal isOpen={shownModal === 'del'} onClose={closeModal}>
        <ModalBody>
          <h3>{`Remove "${currFolder.name}"?`}</h3>
          <p>Deleting a folder is a permanent action.</p>
          <p>Sets in this folder will not be deleted.</p>
        </ModalBody>
        <ModalActions>
          <button onClick={closeModal}>Cancel</button>
          <button onClick={onDelete} style={{ color: 'var(--color-error)' }}>
            Delete
          </button>
        </ModalActions>
      </Modal>
      <Modal isOpen={shownModal === 'sets'} onClose={closeModal}>
        <ModalBody>
          {sets?.length ? (
            <>
              <h3>Sets Management</h3>
              <p>Organise sets you&#39;re studying for a particular subject</p>
            </>
          ) : (
            <h3>You don&#39;t have sets</h3>
          )}
        </ModalBody>
        {sets?.length ? (
          <ModalList>
            {sets.map((content) => (
              <li key={content.id}>
                <Toggle
                  label={content.title}
                  onClick={() => toggleIncludeFolder(content)}
                  defaultChecked={!!includedSets.find((el) => el.id === content.id)}
                />
              </li>
            ))}
          </ModalList>
        ) : undefined}
        <ModalActions>
          {sets?.length ? (
            <>
              <button onClick={closeModal}>Cancel</button>
              <button onClick={updateFolderSets}>Apply</button>
            </>
          ) : (
            <button onClick={closeModal}>OK</button>
          )}
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
