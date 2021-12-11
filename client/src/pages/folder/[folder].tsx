import { folderApi } from 'api/folderApi';
import { NextPage } from 'next';
import Link from 'next/link';
import Custom404 from 'pages/404';
import React from 'react';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import style from 'styles/pages/set.module.scss';
import style2 from 'styles/pages/home.module.scss'; // todo - fix that

const FolderPage: NextPage<{ pagekey: string }> = ({ pagekey }) => {
   const res = useQuery(['folder', pagekey], () => folderApi.getById(pagekey), { enabled: !!pagekey });
   if (!res.data) return <Custom404 />;

   return (
      <div className="container">
         <div className={style.card}>
            <h1 className={style.card__h1}>
               <span>{res.data.folder.name}</span>
            </h1>
            <p>{res.data.folder.description}</p>
         </div>
         <div className={style.createdby}>
            <div className={style.createdby__author}>
               <span>Created by SIVERCONE (you)</span>
            </div>
            <div className={style.createdby__movements}>
               <button title="edit">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#181818">
                     <path d="M0 0h24v24H0V0z" fill="none" />
                     <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" />
                  </svg>
               </button>
               <button title="delete">
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

         <h2 style={{ marginBottom: '1rem' }}>Study sets in this folder ({res.data.sets.length})</h2>
         <div className={style2.cardlist}>
            {res.data.sets.map((content) => (
               <Link href={`/${content._id}`} key={content._id}>
                  <a className={style2.cardlist__item}>
                     <div className={style2.cardlist__text}>
                        <h2>{content.title}</h2>
                        <p>{content.description}</p>
                     </div>
                     <ul className={style2.cardlist__tags}>
                        {content.tags.map((tag, i) => (
                           <li key={tag + i}>{tag}</li>
                        ))}
                     </ul>
                  </a>
               </Link>
            ))}
         </div>
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
