import { folderApi } from 'api/folderApi';
import { FolderInterface } from 'interfaces';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import style from 'styles/components/header.module.scss';
import { Modal, ModalActions, ModalBody, ModalInputs } from './Modal';

export const Header: React.FC = () => {
   const [shownFolder, setShownFolder] = React.useState<boolean>(false);
   const toggleShownFolder = () => setShownFolder(!shownFolder);

   return (
      <header className={style.header}>
         <Link href="/">
            <a>Memory Word Boost</a>
         </Link>
         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={toggleShownFolder}>
               <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#999">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
               </svg>
            </button>
            <Link href="/create-set">
               <a title="create study set">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#cccccc">
                     <path d="M0 0h24v24H0V0z" fill="none" />
                     <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
               </a>
            </Link>
            <button className={style.header__profilepic}>
               <img src="/assets/download.webp" alt="" />
            </button>
         </div>
         <CreateFolder isOpen={shownFolder} toggleShown={toggleShownFolder} />
      </header>
   );
};

const CreateFolder: React.FC<{ isOpen: boolean; toggleShown: () => void }> = ({ isOpen, toggleShown }) => {
   const { register, handleSubmit } = useForm<FolderInterface>();
   const { mutateAsync } = useMutation(folderApi.create);
   const onSubmit = async (data: FolderInterface) => {
      try {
         await mutateAsync(data);
      } catch (error) {}
   };
   return (
      <Modal isOpen={isOpen} onClose={toggleShown}>
         <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <ModalBody>
               <h3>Create a new folder</h3>
               <ModalInputs>
                  <label className="input">
                     <span>Name</span>
                     <input {...register('name')} />
                  </label>
                  <label className="input">
                     <span>Description (optional)</span>
                     <input {...register('description')} />
                  </label>
               </ModalInputs>
            </ModalBody>
            <ModalActions>
               <button onClick={toggleShown} type="button">
                  Cancel
               </button>
               <button type="submit">Create</button>
            </ModalActions>
         </form>
      </Modal>
   );
};
