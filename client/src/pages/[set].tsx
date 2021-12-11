import React from 'react';
import type { NextPage } from 'next';
import style from 'styles/pages/set.module.scss';
import Link from 'next/link';
import { QueryClient, useQuery, dehydrate, useMutation } from 'react-query';
import { setApi } from 'api/setApi';
import { useRouter } from 'next/dist/client/router';
import { notify } from 'utils/notify';
import { Modal, ModalBody, ModalActions, ModalList } from 'components/Modal';
import Custom404 from './404';
import { useSetStore } from 'storage/useSetStore';
import { folderApi } from 'api/folderApi';

type ModalVariants = 'del' | 'info' | 'folder';

const SetPage: NextPage<{ pagekey: string }> = ({ pagekey }) => {
   const set = useQuery(['set', pagekey], () => setApi.getById(pagekey), { enabled: !!pagekey });
   if (!set.data) return <Custom404 />;

   const folder = useQuery('folders', folderApi.get);
   const router = useRouter();

   const { setSetFigure } = useSetStore();
   const onEdit = () => {
      setSetFigure(set.data);
      router.push(`/update-set/${set.data._id}`);
   };

   const fetchDelete = useMutation(setApi.delete);
   const onDeleteSet = async () => {
      try {
         await fetchDelete.mutateAsync(set.data._id);
         router.push('/');
         notify(`Successfully deleted Study Set: ${set.data.title}`);
      } catch (error) {}
   };

   const [shownModal, setShownModal] = React.useState<ModalVariants>();
   const openModal = (payload: ModalVariants) => setShownModal(payload);
   const closeModal = () => setShownModal(undefined);

   const [includedFolders, setIncludedFolders] = React.useState<string[]>([]);
   React.useEffect(() => {
      if (set.data) setIncludedFolders(set.data.folder);
   }, [set.data]);
   const toggleIncludeFolder = (payload: string) => {
      if (includedFolders.includes(payload)) setIncludedFolders(includedFolders.filter((el) => el !== payload));
      else setIncludedFolders([...includedFolders, payload]);
   };
   const fetchUpdate = useMutation(setApi.update);
   const updateSetFolders = async () => {
      try {
         await fetchUpdate.mutateAsync({ ...set.data, folder: includedFolders });
         closeModal();
      } catch (error) {}
   };

   return (
      <>
         <div className="container">
            <div className={style.card}>
               <h1 className={style.card__h1}>
                  <span>{set.data.title}</span>
               </h1>
               <p>{set.data.description}</p>
               <ul className={style.card__tags}>
                  {set.data.tags.map((tag, i) => (
                     <li key={tag + i}>{tag}</li>
                  ))}
               </ul>
               <ul className={style.card__studies}>
                  <li>
                     <Link href={`/learn/${set.data._id}`}>
                        <a>
                           <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="5rem" height="5rem" viewBox="0 0 512 512">
                                 <path d="M0 0h512v512H0z" fill="#181818" />
                                 <path
                                    d="M297.87 24.322c-40.38.374-80.665 13.623-114.077 39.72 73.64-37.01 166.104-24.977 227.547 36.464 61.442 61.44 73.013 153.443 36.002 227.084 57.598-73.738 53.068-180.48-14.77-248.317-37.098-37.098-85.97-55.4-134.703-54.95zm-27.25 63.123c-37.16.42-74.186 14.305-102.975 41.67 60.11-36.405 139.642-28.35 191.54 23.545 51.897 51.898 59.488 130.976 23.08 191.086 56.502-59.44 56.012-153.534-2.31-211.855C349.883 101.82 310.177 87 270.62 87.446zm-16.61 59.54c-28.304 0-56.606 10.797-78.2 32.392-43.19 43.19-43.19 113.214 0 156.404 43.188 43.19 113.21 43.19 156.4 0 43.19-43.19 43.19-113.213 0-156.403-21.594-21.595-49.897-32.393-78.2-32.393zm-132.635 28.4c-56.503 59.44-55.552 153.995 2.77 212.316 58.32 58.323 152.416 58.81 211.855 2.308-60.112 36.41-139.186 28.822-191.084-23.078-51.898-51.9-59.95-131.435-23.54-191.545zM56.297 191.54C-1.3 265.276 3.69 372.48 71.527 440.317c67.838 67.838 174.58 72.366 248.32 14.77-73.642 37.01-165.647 25.44-227.087-36.002-61.44-61.442-73.474-153.908-36.463-227.547z"
                                    fill="#ccc"
                                 />
                              </svg>
                           </span>
                           <span>Learn</span>
                        </a>
                     </Link>
                  </li>
                  <li>
                     <Link href={`/cards/${set.data._id}`}>
                        <a>
                           <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="5rem" height="5rem" viewBox="0 0 512 512">
                                 <path d="M0 0h512v512H0z" fill="#181818" />
                                 <path
                                    d="M258.148 20.822c-1.112.008-2.226.026-3.343.055-39.32 1.041-81.507 15.972-123.785 50.404l-6.028 4.91-5.732-5.25c-12.644-11.578-20.276-27.633-25.653-43.716-8.974 36.98-14.631 81.385-9.232 114.523 18.065.908 45.409-2.177 73.7-7.818 17.858-3.561 36.048-8.126 53.064-13.072-13.419-2.911-25.896-6.882-38.143-12.082l-16.088-6.832 14.906-9.127c46.367-28.393 80.964-40.686 120.235-35.553 33.105 4.327 69.357 20.867 119.066 47.271-25.373-36.314-62.243-64.737-104.728-76.994-15.402-4.443-31.553-6.828-48.239-6.719zM346 116c-46.667 0-46.666 0-46.666 46.666V349.4c0 9.596.007 17.19.414 23.242a664.804 664.804 0 0 1 50.656-12.223c24.649-4.915 48.367-8.224 67.916-8.41 6.517-.062 12.571.224 18.041.912l6.31.793 1.358 6.213c2.464 11.265 3.673 23.447 3.914 36.059 38.032-.19 38.057-3.06 38.057-46.65V162.665C486 116 486 116 439.334 116a226.98 226.98 0 0 1 3.978 7.64l12.624 25.536-25.004-13.648c-13.085-7.143-25.164-13.632-36.452-19.528zm-281.943.016c-38.032.19-38.057 3.06-38.057 46.65V349.4C26 396 26 396 72.666 396a226.98 226.98 0 0 1-3.978-7.64l-12.624-25.536 25.004 13.649c13.085 7.142 25.164 13.632 36.452 19.527H166c46.667 0 46.666 0 46.666-46.666V162.666c0-9.626-.006-17.24-.416-23.304a664.811 664.811 0 0 1-50.654 12.22c-32.865 6.554-64.077 10.25-85.957 7.498l-6.31-.793-1.358-6.213c-2.464-11.265-3.673-23.446-3.914-36.058zm354.619 254.078c-17.543.25-40.826 3.206-64.75 7.977-17.859 3.56-36.05 8.125-53.065 13.072 13.419 2.91 25.896 6.881 38.143 12.082l16.088 6.832-14.906 9.127c-46.367 28.392-80.964 40.685-120.235 35.553-33.105-4.327-69.357-20.868-119.066-47.272 25.373 36.315 62.243 64.738 104.728 76.994 52.573 15.166 113.872 6.343 175.367-43.74l6.028-4.91 5.732 5.25c12.644 11.579 20.276 27.633 25.653 43.717 8.974-36.981 14.631-81.386 9.232-114.524-2.788-.14-5.748-.204-8.95-.158z"
                                    fill="#ccc"
                                 />
                              </svg>
                           </span>
                           <span>Cards</span>
                        </a>
                     </Link>
                  </li>
               </ul>
            </div>
            <div className={style.createdby}>
               <div className={style.createdby__author}>
                  <span>Created by SIVERCONE (you)</span>
               </div>
               <div className={style.createdby__movements}>
                  <button onClick={onEdit} title="edit">
                     <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#181818">
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" />
                     </svg>
                  </button>
                  <button onClick={() => openModal('folder')} title="add to folder">
                     <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#181818">
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm0 12H4V6h5.17l2 2H20v10zm-8-4h2v2h2v-2h2v-2h-2v-2h-2v2h-2z" />
                     </svg>
                  </button>
                  <button onClick={() => openModal('del')} title="delete">
                     <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#181818">
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
                     </svg>
                  </button>
                  <button onClick={() => openModal('info')} title="info">
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
            <div className={style.listset}>
               <h2>Terms in this set ({set.data.cards.length})</h2>
               <ul>
                  {set.data.cards.map((content, i) => (
                     <li key={i}>
                        <span>{content.term}</span>
                        <span>{content.definition}</span>
                        <div>
                           <button title="edit">
                              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#cccccc">
                                 <path d="M0 0h24v24H0V0z" fill="none" />
                                 <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" />
                              </svg>
                           </button>
                           <button title="delete">
                              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#cccccc">
                                 <path d="M0 0h24v24H0V0z" fill="none" />
                                 <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
                              </svg>
                           </button>
                        </div>
                     </li>
                  ))}
               </ul>
            </div>
         </div>
         <Modal isOpen={!!shownModal} onClose={closeModal}>
            <ModalBody>
               {shownModal
                  ? {
                       del: <h3>Are you sure you want to delete this set?</h3>,
                       info: (
                          <>
                             <h3>Information</h3>
                             <p>This set was created {set.data.createdAt}</p>
                          </>
                       ),
                       folder: <h3>Folder Management</h3>,
                    }[shownModal]
                  : undefined}
            </ModalBody>
            {shownModal === 'folder' ? (
               <ModalList>
                  {folder.data
                     ? folder.data.map((content) => (
                          <li onClick={() => toggleIncludeFolder(content._id)} key={content._id}>
                             <label className="checkbox">
                                <span>{content.name}</span>
                                <input
                                   type="checkbox"
                                   defaultChecked={set.data.folder ? set.data.folder.includes(content._id) : false}
                                />
                             </label>
                          </li>
                       ))
                     : undefined}
               </ModalList>
            ) : undefined}
            <ModalActions>
               {shownModal
                  ? {
                       del: (
                          <>
                             <button onClick={closeModal}>Cancel</button>
                             <button onClick={onDeleteSet}>Delete</button>
                          </>
                       ),
                       info: <button onClick={closeModal}>OK</button>,
                       folder: (
                          <>
                             <button onClick={closeModal}>Cancel</button>
                             <button onClick={updateSetFolders}>Apply</button>
                          </>
                       ),
                    }[shownModal]
                  : undefined}
            </ModalActions>
         </Modal>
      </>
   );
};

SetPage.getInitialProps = async ({ query }) => {
   const pagekey = typeof query.set === 'string' ? query.set : '';
   const queryClient = new QueryClient();
   if (pagekey) await queryClient.prefetchQuery(['set', pagekey], () => setApi.getById(pagekey));
   return { pagekey, dehydratedState: dehydrate(queryClient) };
};

export default SetPage;
