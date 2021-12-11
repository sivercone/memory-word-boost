import React from 'react';
import { useForm } from 'react-hook-form';
import style from 'styles/pages/learn.module.scss';
import db from 'utils/db.json';
import { PageTransition } from 'components/PageTransition';

const learn = () => {
  const data = db.words[1].cards;
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const scorePercent = Math.round((currentIndex / data.length) * 100);
  const [status, setStatus] = React.useState<'T' | 'F' | 'E'>();

  const { register, handleSubmit, reset } = useForm();
  const onSubmit = (payload: { answer: string }) => {
    if (payload.answer === data[currentIndex].definiton) {
      setStatus('T');
      setCurrentIndex(currentIndex + 1);
      reset();
    } else setStatus('F');
  };

  return (
    <div className={style.class}>
      <div className={style.class__block}>
        <div className={style.class__progressbar}>
          <div style={{ width: `${scorePercent}%` }}></div>
        </div>
        <div className={style.class__main}>
          <div>
            <span>{data[currentIndex].term}</span>
            {status === 'F' ? (
              <>
                <span>correct answer</span>
                <span>{data[currentIndex].definiton}</span>
              </>
            ) : undefined}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <input type="text" {...register('answer')} />
            <div>
              <button type="submit">answer</button>
              <button>don't know</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default learn;
