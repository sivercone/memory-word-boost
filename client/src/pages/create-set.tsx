import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation } from 'react-query';
import style from 'styles/pages/createset.module.scss';
import { setApi } from 'api/setApi';
import { SetInterface } from 'interfaces';

const CreateSet = () => {
   const { mutateAsync } = useMutation(setApi.createSet);
   const { register, handleSubmit, reset, control } = useForm<SetInterface>({
      defaultValues: { cards: [{ term: '', definition: '' }] },
   });
   const { fields, append, remove } = useFieldArray({ name: 'cards', control });
   const onSubmit = async (payload: SetInterface) => {
      try {
         await mutateAsync(payload);
         reset();
      } catch (error) {}
   };

   return (
      <div className={`container ${style.class}`}>
         <div className={style.class__header}>
            <span>Create a new study set</span>
         </div>
         <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className={style.class__general}>
               <div style={{ display: 'flex', gap: '1rem' }}>
                  <label className="input">
                     <span>Title</span>
                     <input {...register('title')} />
                  </label>
                  <label className="input">
                     <span>Description</span>
                     <input {...register('description')} />
                  </label>
               </div>
               <div style={{ display: 'flex', gap: '1rem' }}>
                  <label className="input">
                     <span>Tags (through comma)</span>
                     <input {...register('tags')} />
                  </label>
                  <button className="button button_dark" type="submit">
                     <span>create</span>
                  </button>
               </div>
            </div>

            <ul className={style.cards}>
               {fields.map((content, i) => (
                  <li key={content.id} className={style.cards__block}>
                     <input type="text" placeholder="term" {...register(`cards.${i}.term`)} />
                     <input type="text" placeholder="definition" {...register(`cards.${i}.definition`)} />
                     <button onClick={() => remove(i)} type="button" title="delete">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="#cccccc">
                           <path d="M0 0h24v24H0V0z" fill="none" />
                           <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
                        </svg>
                     </button>
                  </li>
               ))}
               <li style={{ textAlign: 'center' }}>
                  <button onClick={() => append({ term: '', definition: '' })} className="button button_dark" type="button">
                     <span>add card</span>
                  </button>
               </li>
            </ul>
         </form>
      </div>
   );
};

export default CreateSet;
