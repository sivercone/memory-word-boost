import React from 'react';
import type { NextPage } from 'next';
import style from 'styles/pages/set.module.scss';
import Link from 'next/link';
import { QueryClient, useQuery, dehydrate, useMutation, useQueryClient } from 'react-query';
import { setApi } from 'apis/setApi';
import { useRouter } from 'next/dist/client/router';
import { notify } from 'lib/notify';
import { Modal, ModalBody, ModalActions, ModalList } from 'ui/Modal';
import Custom404 from 'pages/404';
import { useSetStore } from 'storage/useSetStore';
import { folderApi } from 'apis/folderApi';
import { FolderInterface, SetInterface, UserInterface } from 'interfaces';
import { useUserStore } from 'storage/useUserStore';
import { formatDate, shareValue } from 'lib/utils';
import { Toggle } from 'ui/Toggle';
import { isBackendLess } from 'lib/staticData';
import { useLocalStore } from 'storage/useLocalStore';
import { BottomSheet, useBottomSheet } from 'ui/BottomSheet';

type ModalVariants = 'del' | 'info' | 'folder';
type ManageSetProps = {
  isSheetVisible: boolean;
  toggleSheet: () => void;
  openModal: (payload: ModalVariants) => void;
  shownModal: string | undefined;
  closeModal: () => void;
  set: SetInterface;
  signAccess: string | undefined;
  pagekey: string;
};
type ManageFoldersProps = {
  set: SetInterface;
  user: UserInterface | undefined;
  isModalOpened: boolean;
  onCloseModal: () => void;
  signAccess: string | undefined;
  pagekey: string;
};

const SetPage: NextPage<{ pagekey: string }> = ({ pagekey }) => {
  const { localSets } = useLocalStore();
  const { user, signAccess } = useUserStore();
  const { toggleSheet, isSheetVisible } = useBottomSheet();

  const set = useQuery(['set', pagekey], () => setApi.getById(pagekey), { enabled: !!pagekey && !isBackendLess });
  const [currSet, setCurrSet] = React.useState<SetInterface>();
  React.useEffect(() => {
    if (isBackendLess) setCurrSet(localSets.find(({ id }) => id === pagekey));
    else setCurrSet(set.data);
  }, [set.data, localSets]);

  const [shownModal, setShownModal] = React.useState<ModalVariants>();
  const openModal = (payload: ModalVariants) => {
    toggleSheet(false);
    setShownModal(payload);
  };
  const closeModal = () => setShownModal(undefined);

  if (!currSet) return <Custom404 />;
  return (
    <>
      <div className="container">
        <div className={style.head}>
          <div className={style.head__subject}>
            <h1>{currSet.title}</h1>
            {currSet.description ? <p>{currSet.description}</p> : undefined}
            {currSet.tags.length ? (
              <ul>
                {currSet.tags.map((tag, i) => (
                  <li key={tag + i}>{tag}</li>
                ))}
              </ul>
            ) : undefined}
          </div>
          <ul className={style.head__studies}>
            <li>
              <Link href={`${pagekey}/learn`}>
                <a>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512">
                      <path d="M0 0h512v512H0z" fill="transparent" />
                      <path
                        d="M297.87 24.322c-40.38.374-80.665 13.623-114.077 39.72 73.64-37.01 166.104-24.977 227.547 36.464 61.442 61.44 73.013 153.443 36.002 227.084 57.598-73.738 53.068-180.48-14.77-248.317-37.098-37.098-85.97-55.4-134.703-54.95zm-27.25 63.123c-37.16.42-74.186 14.305-102.975 41.67 60.11-36.405 139.642-28.35 191.54 23.545 51.897 51.898 59.488 130.976 23.08 191.086 56.502-59.44 56.012-153.534-2.31-211.855C349.883 101.82 310.177 87 270.62 87.446zm-16.61 59.54c-28.304 0-56.606 10.797-78.2 32.392-43.19 43.19-43.19 113.214 0 156.404 43.188 43.19 113.21 43.19 156.4 0 43.19-43.19 43.19-113.213 0-156.403-21.594-21.595-49.897-32.393-78.2-32.393zm-132.635 28.4c-56.503 59.44-55.552 153.995 2.77 212.316 58.32 58.323 152.416 58.81 211.855 2.308-60.112 36.41-139.186 28.822-191.084-23.078-51.898-51.9-59.95-131.435-23.54-191.545zM56.297 191.54C-1.3 265.276 3.69 372.48 71.527 440.317c67.838 67.838 174.58 72.366 248.32 14.77-73.642 37.01-165.647 25.44-227.087-36.002-61.44-61.442-73.474-153.908-36.463-227.547z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span>Learn</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href={`${pagekey}/flashcards`}>
                <a>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512">
                      <path d="M0 0h512v512H0z" fill="transparent" />
                      <path
                        d="M258.148 20.822c-1.112.008-2.226.026-3.343.055-39.32 1.041-81.507 15.972-123.785 50.404l-6.028 4.91-5.732-5.25c-12.644-11.578-20.276-27.633-25.653-43.716-8.974 36.98-14.631 81.385-9.232 114.523 18.065.908 45.409-2.177 73.7-7.818 17.858-3.561 36.048-8.126 53.064-13.072-13.419-2.911-25.896-6.882-38.143-12.082l-16.088-6.832 14.906-9.127c46.367-28.393 80.964-40.686 120.235-35.553 33.105 4.327 69.357 20.867 119.066 47.271-25.373-36.314-62.243-64.737-104.728-76.994-15.402-4.443-31.553-6.828-48.239-6.719zM346 116c-46.667 0-46.666 0-46.666 46.666V349.4c0 9.596.007 17.19.414 23.242a664.804 664.804 0 0 1 50.656-12.223c24.649-4.915 48.367-8.224 67.916-8.41 6.517-.062 12.571.224 18.041.912l6.31.793 1.358 6.213c2.464 11.265 3.673 23.447 3.914 36.059 38.032-.19 38.057-3.06 38.057-46.65V162.665C486 116 486 116 439.334 116a226.98 226.98 0 0 1 3.978 7.64l12.624 25.536-25.004-13.648c-13.085-7.143-25.164-13.632-36.452-19.528zm-281.943.016c-38.032.19-38.057 3.06-38.057 46.65V349.4C26 396 26 396 72.666 396a226.98 226.98 0 0 1-3.978-7.64l-12.624-25.536 25.004 13.649c13.085 7.142 25.164 13.632 36.452 19.527H166c46.667 0 46.666 0 46.666-46.666V162.666c0-9.626-.006-17.24-.416-23.304a664.811 664.811 0 0 1-50.654 12.22c-32.865 6.554-64.077 10.25-85.957 7.498l-6.31-.793-1.358-6.213c-2.464-11.265-3.673-23.446-3.914-36.058zm354.619 254.078c-17.543.25-40.826 3.206-64.75 7.977-17.859 3.56-36.05 8.125-53.065 13.072 13.419 2.91 25.896 6.881 38.143 12.082l16.088 6.832-14.906 9.127c-46.367 28.392-80.964 40.685-120.235 35.553-33.105-4.327-69.357-20.868-119.066-47.272 25.373 36.315 62.243 64.738 104.728 76.994 52.573 15.166 113.872 6.343 175.367-43.74l6.028-4.91 5.732 5.25c12.644 11.579 20.276 27.633 25.653 43.717 8.974-36.981 14.631-81.386 9.232-114.524-2.788-.14-5.748-.204-8.95-.158z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span>Flashcards</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href={`${pagekey}/write`}>
                <a>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512">
                      <path
                        d="M131.3 20.35c-14.6.1-28.1 10-31.93 24.82-2.33 9.13-.55 18.4 4.13 25.84-7.67 4.26-13.69 11.53-16.03 20.66-2.32 9.13-.56 18.33 4.1 25.83a32.687 32.687 0 0 0-15.96 20.6c-2.34 9.1-.54 18.4 4.18 25.8-7.72 4.3-13.75 11.5-16.09 20.7-2.33 9.1-.54 18.4 4.19 25.8-7.72 4.3-13.75 11.5-16.09 20.7-2.34 9.1-.54 18.4 4.18 25.8-7.72 4.3-13.75 11.5-16.08 20.7-2.34 9.1-.54 18.4 4.18 25.8-7.72 4.3-13.75 11.5-16.09 20.7-2.35 9.2-.51 18.5 4.3 26a32.915 32.915 0 0 0-16.28 20.8c-4.48 17.5 6.25 35.6 23.79 40.1l.1-.2 31.71 8.2-1.47 5.7 261.56 67L374 326.5l-22.4 21.2-87.8 26.5 15.5-42.5-151.7-38.8 4.4-17.4 153.5 39.3 9.7-26.7 15.3-14.4-167-42.8 4.4-17.4 178 45.6 39.6-37.4-206.1-52.8 4.4-17.4L380.7 207l-.1.4 31.5-29.8 18.3-71.4-261.6-67.04-4.8 18.66c2.2-16.32-8.1-32.27-24.5-36.44-2.7-.7-5.5-1.04-8.2-1.03zm.3 17.99c1.2 0 2.4.19 3.5.48 8.1 2.09 12.9 10.13 10.8 18.27l17.2 4.4-11 42.81c2.2-16.35-8.2-32.26-24.5-36.43l-.6-.15c-7.8-2.34-12.2-10.15-10.2-18.07 1.7-6.61 7.3-11 13.7-11.3h1.1zm-11.9 46.51c.9 0 1.9.14 2.9.36l.6.15c8.1 2.08 12.9 10.12 10.8 18.24l17.2 4.4-11 43c2.4-16.4-8-32.6-24.4-36.7-.7-.2-1.3-.4-1.9-.5-7-2.7-10.9-10.1-9-17.62 1.7-6.97 7.9-11.45 14.8-11.29zm59.9 4.59 217 55.66-4.4 17.4-217-55.6zm-72.9 41.86h1.3c.5 0 .9 0 1.4.1.6.2 1.2.3 1.8.5l.1-.2c8.1 2.1 12.9 10.1 10.8 18.3l17.2 4.4-11 43c2.3-16.3-8.1-32.4-24.4-36.6-8.18-2.1-12.94-10.1-10.85-18.3 1.69-6.6 7.25-10.9 13.65-11.2zM465.4 152l-10.2 9.6 31.6 33.5 10.2-9.6zm-23.3 22L315.7 293.5l31.5 33.5 126.5-119.5zm-347.23 3.7c1.48 0 3 .1 4.53.5 8.1 2.1 12.9 10.1 10.8 18.3l17.2 4.4-11 43c2.3-16.4-8.1-32.4-24.44-36.6-8.14-2.1-12.9-10.1-10.82-18.3 1.7-6.6 7.32-11 13.73-11.3zm-11.91 46.5c1.48 0 3 .1 4.53.5 8.14 2.1 12.91 10.1 10.81 18.3l17.2 4.4-11 42.9c2.3-16.3-8.1-32.3-24.45-36.5-8.14-2.1-12.89-10.1-10.81-18.3 1.69-6.6 7.31-11 13.72-11.3zm-11.9 46.5c1.48 0 3 .1 4.53.5 8.13 2.1 12.89 10.1 10.81 18.3l17.2 4.3-10.94 42.8c2.16-16.3-8.25-32.1-24.51-36.3-8.14-2.1-12.9-10.1-10.82-18.3 1.7-6.6 7.32-11 13.73-11.3zm235.34 39.2L293 346.6l37.4-11.3zm-247.25 7.3c1.48 0 3 .1 4.53.5 8.14 2.1 12.9 10.1 10.81 18.3l17.21 4.3-11 43c2.1-16.2-8.3-32-24.53-36.2l.1-.3c-8.16-2.1-12.92-10.1-10.84-18.3 1.69-6.6 7.31-11 13.72-11.3zm56.95 20.3L333.2 393l-4.4 17.4-217.1-55.5zM47.18 364c1.48 0 3 .1 4.52.5 8.14 2.1 12.9 10.1 10.82 18.3l17.2 4.3-3.69 14.4-31.92-8.2v.2c-8.01-2.2-12.67-10.1-10.61-18.2 1.7-6.6 7.32-11 13.73-11.3z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span>Write</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href={`${pagekey}/exam`}>
                <a>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512">
                      <path d="M0 0h512v512H0z" fill="transparent" />
                      <path
                        d="M256.156 21.625c-45.605 0-86.876 2.852-117.22 7.563-15.17 2.355-27.554 5.11-36.874 8.53-4.66 1.71-8.568 3.515-11.968 6.094-3.238 2.457-6.65 6.36-6.97 11.75h-.75c0 10.08.362 20.022 1.064 29.813H57.53c-.12-7.952.003-15.922.376-23.875l-26.812-6.28C22.55 161.892 64.1 265.716 140.564 339.655l15.655-29.594a250.817 250.817 0 0 1-12.157-10.75 143.483 143.483 0 0 1 19.28-16.843c13.468 13.172 28.182 23.565 43.813 30.655 22.114 17.744 8.053 29.368-23.5 36.25 58.863 10.6 38.948 62.267-14.125 92.313-2.14.27-4.256.523-6.28.812-12.047 1.718-21.876 3.71-29.406 6.25-3.765 1.27-6.958 2.6-9.906 4.656-2.95 2.055-6.626 5.705-6.626 11.406 0 5.702 3.677 9.32 6.626 11.375 2.948 2.055 6.14 3.387 9.906 4.657 7.53 2.54 17.36 4.532 29.406 6.25 24.094 3.436 56.784 5.53 92.906 5.53 36.123 0 68.812-2.094 92.906-5.53 12.048-1.718 21.877-3.71 29.407-6.25 3.764-1.27 6.957-2.602 9.905-4.656 2.948-2.055 6.625-5.674 6.625-11.375 0-5.702-3.677-9.352-6.625-11.407-2.948-2.055-6.14-3.387-9.906-4.656-7.53-2.54-17.36-4.532-29.408-6.25-2.013-.287-4.12-.544-6.25-.813-53.076-30.045-72.99-81.71-14.125-92.312-31.568-6.886-45.63-18.522-23.468-36.28 15.74-7.15 30.547-17.655 44.092-30.97 6.648 4.773 12.84 10.038 18.47 15.72a300.791 300.791 0 0 1-12.72 12.217l16.188 29.594c79.118-71.955 116.195-179.53 110.03-285l-27.342 7.97c.45 7.61.64 15.19.562 22.75h-25.594a416.913 416.913 0 0 0 1.063-29.814h-.75c-.323-5.39-3.763-9.293-7-11.75-3.402-2.58-7.31-4.383-11.97-6.093-9.32-3.422-21.704-6.177-36.875-8.532-30.342-4.71-71.613-7.563-117.22-7.563zm0 18.688c44.822 0 85.426 2.854 114.344 7.343 14.46 2.245 26.06 4.932 33.313 7.594 1.04.382 1.775.75 2.625 1.125-.85.375-1.58.742-2.625 1.125-7.252 2.662-18.854 5.38-33.313 7.625-28.918 4.49-69.522 7.344-114.344 7.344-44.82 0-85.425-2.855-114.344-7.345-14.46-2.245-26.06-4.963-33.312-7.625-1.05-.386-1.77-.748-2.625-1.125.853-.376 1.577-.74 2.625-1.125 7.252-2.662 18.853-5.35 33.313-7.594 28.918-4.49 69.522-7.343 114.343-7.343zm-197.25 71.874H86.25c8.057 57.878 28.23 108.83 56.188 146.25-6.974 5.74-13.407 11.968-19.188 18.688-38.648-46.456-59.042-104.647-64.344-164.938zm367.188 0h27C447.51 171.82 425.336 228.34 388.03 275a158.506 158.506 0 0 0-17.842-16.97c27.81-37.38 47.873-88.175 55.906-145.842z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  <span>Exam</span>
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className={style.nav}>
          <Link href={`/u/${currSet.user.id}`}>
            <a>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
                <path d="M12 12q-1.65 0-2.825-1.175Q8 9.65 8 8q0-1.65 1.175-2.825Q10.35 4 12 4q1.65 0 2.825 1.175Q16 6.35 16 8q0 1.65-1.175 2.825Q13.65 12 12 12Zm-8 8v-2.8q0-.85.438-1.563.437-.712 1.162-1.087 1.55-.775 3.15-1.163Q10.35 13 12 13t3.25.387q1.6.388 3.15 1.163.725.375 1.162 1.087Q20 16.35 20 17.2V20Zm2-2h12v-.8q0-.275-.137-.5-.138-.225-.363-.35-1.35-.675-2.725-1.013Q13.4 15 12 15t-2.775.337Q7.85 15.675 6.5 16.35q-.225.125-.362.35-.138.225-.138.5Zm6-8q.825 0 1.413-.588Q14 8.825 14 8t-.587-1.412Q12.825 6 12 6q-.825 0-1.412.588Q10 7.175 10 8t.588 1.412Q11.175 10 12 10Zm0-2Zm0 10Z" />
              </svg>
              <span>{currSet.user.name}</span>
            </a>
          </Link>
          <button onClick={() => shareValue(window.location.href)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
              <path d="M6 23q-.825 0-1.412-.587Q4 21.825 4 21V10q0-.825.588-1.413Q5.175 8 6 8h3v2H6v11h12V10h-3V8h3q.825 0 1.413.587Q20 9.175 20 10v11q0 .825-.587 1.413Q18.825 23 18 23Zm5-7V4.825l-1.6 1.6L8 5l4-4 4 4-1.4 1.425-1.6-1.6V16Z" />
            </svg>
            <span>Share</span>
          </button>
          {currSet.user.id === user?.id || (isBackendLess && !currSet.id.includes('example')) ? (
            <button onClick={() => toggleSheet()} title="More Actions">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor">
                <path d="M6 14q-.825 0-1.412-.588Q4 12.825 4 12t.588-1.413Q5.175 10 6 10t1.412.587Q8 11.175 8 12q0 .825-.588 1.412Q6.825 14 6 14Zm6 0q-.825 0-1.412-.588Q10 12.825 10 12t.588-1.413Q11.175 10 12 10t1.413.587Q14 11.175 14 12q0 .825-.587 1.412Q12.825 14 12 14Zm6 0q-.825 0-1.413-.588Q16 12.825 16 12t.587-1.413Q17.175 10 18 10q.825 0 1.413.587Q20 11.175 20 12q0 .825-.587 1.412Q18.825 14 18 14Z" />
              </svg>
            </button>
          ) : (
            <button onClick={() => openModal('info')}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
              <span>Info</span>
            </button>
          )}
        </div>
        <div className={style.body}>
          <h2>Cards in this set ({currSet.cards.length})</h2>
          <ul>
            {currSet.cards.map((content, i) => (
              <li key={i}>
                <span>{content.term}</span>
                <span>{content.definition}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ManageSet
        isSheetVisible={isSheetVisible}
        toggleSheet={toggleSheet}
        openModal={openModal}
        shownModal={shownModal}
        closeModal={closeModal}
        set={currSet}
        signAccess={signAccess}
        pagekey={pagekey}
      />
      <ManageFolders
        set={currSet}
        user={user}
        isModalOpened={shownModal === 'folder'}
        onCloseModal={closeModal}
        signAccess={signAccess}
        pagekey={pagekey}
      />
    </>
  );
};

const ManageSet: React.FC<ManageSetProps> = ({
  isSheetVisible,
  toggleSheet,
  openModal,
  shownModal,
  closeModal,
  set,
  signAccess,
  pagekey,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { localSets, setLocalSets } = useLocalStore();

  const { setSetFigure } = useSetStore();
  const onEdit = () => {
    setSetFigure(set);
    router.push(`${pagekey}/update`);
  };

  const fetchDelete = useMutation(setApi.delete, {
    onSuccess: () => {
      notify('Successfully deleted study set');
      queryClient.invalidateQueries('sets');
      return router.push('/');
    },
  });
  const onDeleteSet = async () => {
    if (!set) return;
    if (isBackendLess) {
      setLocalSets(localSets.filter(({ id }) => id !== set.id));
      router.push('/');
    } else await fetchDelete.mutateAsync({ id: set.id, token: signAccess }).catch(() => null);
  };

  return (
    <>
      <BottomSheet visible={isSheetVisible} toggleVisible={toggleSheet} label={set.title}>
        <li>
          <button onClick={() => openModal('info')}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
            </svg>
            <span>Information</span>
          </button>
        </li>
        <li>
          <button onClick={onEdit}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" />
            </svg>
            <span>Edit</span>
          </button>
        </li>
        <li>
          <button onClick={() => openModal('folder')}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm0 12H4V6h5.17l2 2H20v10zm-8-4h2v2h2v-2h2v-2h-2v-2h-2v2h-2z" />
            </svg>
            <span>Manage folders</span>
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
      <Modal isOpen={!!shownModal} onClose={closeModal}>
        <ModalBody>
          {shownModal
            ? {
                del: (
                  <>
                    <h3>{`Remove "${set.title}"?`}</h3>
                    <p>Deleting a set is a permanent action.</p>
                  </>
                ),
                info: (
                  <>
                    <h3>Information</h3>
                    <p>{`This set was created ${formatDate({ createdAt: set.createdAt, pattern: 'dd MMM yyyy' })}`}</p>
                  </>
                ),
                folder: null,
              }[shownModal]
            : undefined}
        </ModalBody>
        <ModalActions>
          {shownModal
            ? {
                del: (
                  <>
                    <button onClick={closeModal}>Cancel</button>
                    <button onClick={onDeleteSet} style={{ color: 'var(--color-error)' }}>
                      Delete
                    </button>
                  </>
                ),
                info: <button onClick={closeModal}>OK</button>,
                folder: null,
              }[shownModal]
            : undefined}
        </ModalActions>
      </Modal>
    </>
  );
};

const ManageFolders: React.FC<ManageFoldersProps> = ({ set, user, isModalOpened, onCloseModal, signAccess, pagekey }) => {
  const { localFolders, localSets, setLocalSets, setLocalFolders } = useLocalStore(); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userFolders = useQuery('userFolders', () => folderApi.getByUser(user!), { enabled: isModalOpened && !!user });
  const folders = isBackendLess ? localFolders : userFolders.data;
  const [includedFolders, setIncludedFolders] = React.useState<FolderInterface[]>([]);
  React.useEffect(() => {
    if (isBackendLess) setIncludedFolders(set.folders || []);
    if (set && set.folders?.length) setIncludedFolders(set.folders);
  }, [set]);
  const toggleIncludeFolder = (payload: FolderInterface) => {
    if (includedFolders.find((el) => el.id === payload.id)) setIncludedFolders(includedFolders.filter((el) => el.id !== payload.id));
    else setIncludedFolders([...includedFolders, payload]);
  };
  const queryClient = useQueryClient();
  const fetchUpdate = useMutation(setApi.save, { onSuccess: () => queryClient.invalidateQueries(['set', pagekey]) });
  const updateSetFolders = async () => {
    if (!set) return;
    if (isBackendLess) {
      setLocalSets([...localSets.filter(({ id }) => id !== set.id), { ...set, folders: includedFolders }]);
      setLocalFolders(
        localFolders.map((fldr) =>
          includedFolders.find((ifolder) => fldr.id === ifolder.id)
            ? { ...fldr, sets: [...fldr.sets, set] }
            : { ...fldr, sets: fldr.sets.filter(({ id }) => id !== set.id) },
        ),
      );
      onCloseModal();
    } else {
      try {
        await fetchUpdate.mutateAsync({ data: { ...set, folders: includedFolders }, token: signAccess });
        onCloseModal();
      } catch (error) {}
    }
  };

  return (
    <Modal isOpen={isModalOpened} onClose={onCloseModal}>
      <ModalBody>
        {folders?.length ? (
          <>
            <h3>Folder Management</h3>
            <p>Organise set for a particular subject</p>
          </>
        ) : (
          <>
            <h3>You don&#39;t have folders</h3>
            <p>With folder you will can organise sets for a particular subject</p>
          </>
        )}
      </ModalBody>
      {folders?.length ? (
        <ModalList>
          {folders.map((content) => (
            <li key={content.id}>
              <Toggle
                label={content.name}
                onClick={() => toggleIncludeFolder(content)}
                defaultChecked={!!set.folders?.find(({ id }) => id === content.id)}
              />
            </li>
          ))}
        </ModalList>
      ) : (
        <div style={{ textAlign: 'center', paddingBottom: '2rem', fontSize: '4rem' }}>📁</div>
      )}
      <ModalActions>
        {folders?.length ? (
          <>
            <button onClick={onCloseModal}>Cancel</button>
            <button onClick={updateSetFolders}>Apply</button>
          </>
        ) : (
          <button onClick={onCloseModal}>OK</button>
        )}
      </ModalActions>
    </Modal>
  );
};

SetPage.getInitialProps = async ({ query }) => {
  const pagekey = typeof query.set === 'string' ? query.set : '';
  const queryClient = new QueryClient();
  if (pagekey && !isBackendLess) await queryClient.prefetchQuery(['set', pagekey], () => setApi.getById(pagekey));
  return { pagekey, dehydratedState: dehydrate(queryClient) };
};

export default SetPage;
