import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import { setApi } from 'apis/setApi';
import Custom404 from 'pages/404';
import { Button } from 'ui/Button';
import { CardInterface } from 'interfaces';
import { isAnswerCorrect } from 'utils/isAnswerCorrect';
import style from 'styles/pages/exam.module.scss';

type SubmitData = { form: { input: string }[] };

const ExamPage: NextPage<{ pagekey: string }> = ({ pagekey }) => {
  const set = useQuery(['set', pagekey], () => setApi.getById(pagekey));

  const { push } = useRouter();

  const [cards, setCards] = React.useState<CardInterface[]>([]);
  React.useEffect(() => {
    if (set.data) setCards(set.data.cards.sort(() => Math.random() - 0.5));
  }, [set.data]);

  const { register, handleSubmit, formState, reset } = useForm<SubmitData>();
  const [incorrect, setIncorrect] = React.useState<{ correct: boolean; index: number; answer: string }[]>([]);
  const onSubmit = (payload: SubmitData) => {
    setIncorrect(
      payload.form.map((el, i) =>
        isAnswerCorrect(el.input, cards[i].definition)
          ? { correct: false, index: i, answer: el.input }
          : { correct: true, index: i, answer: el.input },
      ),
    );
    window.scrollTo(0, 0);
  };
  const [currIndex, setCurrIndex] = React.useState(0);

  const setFocusToNextInput = () => {
    const input = document.getElementById(`input-${currIndex + 1}`);
    if (input) input.focus();
  };
  const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setFocusToNextInput();
    }
  };

  const onRestart = () => {
    setIncorrect([]);
    reset();
  };

  if (!set.data) return <Custom404 />;
  return (
    <>
      <div style={{ height: '50px' }}></div>
      <header className={style.header}>
        <div className={style.header__inner}>
          <button onClick={() => push(`/${pagekey}`)} title="close">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
            </svg>
          </button>
          <Link href="/">
            <a className={style.header__logo}>Project MWB</a>
          </Link>
        </div>
      </header>
      <div className={style.container}>
        {formState.isSubmitted ? (
          <div className={style.results}>
            <header className={style.results__header}>
              <span>Your Results</span>
            </header>
            <div className={style.results__content}>
              <p style={{ color: 'green' }}>
                <span>Correct</span>
                <span>{cards.length - incorrect.filter((el) => !el.correct).length}</span>
              </p>
              <p style={{ color: 'tomato' }}>
                <span>Incorrect</span>
                <span>{incorrect.filter((el) => !el.correct).length}</span>
              </p>
              <p>
                <span>Overall progress</span>
                <span>{`${cards.length - incorrect.filter((el) => !el.correct).length}/${cards.length}`}</span>
              </p>
            </div>
            <div className={style.results__actions}>
              <Button onClick={onRestart} variant="outlined">
                Restart exam
              </Button>
              <Button onClick={() => push(`/${pagekey}`)} variant="outlined">
                Return to set page
              </Button>
            </div>
          </div>
        ) : undefined}
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className={style.list}>
          {cards.map((el, i) => (
            <div key={i} onFocus={() => setCurrIndex(i)} className={style.list__block}>
              <div className={style.list__learn}>
                <span>{el.term}</span>
                {incorrect.length && !incorrect[i].correct ? (
                  <>
                    <span>correct answer</span>
                    <span>{cards[i].definition}</span>
                  </>
                ) : undefined}
              </div>
              <div className={style.list__form}>
                <input
                  {...register(`form.${i}.input`)}
                  autoFocus={i === 0}
                  onKeyPress={handleEnterPress}
                  id={`input-${i}`}
                  defaultValue={incorrect.length ? incorrect[i].answer : ''}
                  disabled={!!incorrect.length}
                />
                {cards.length - 1 !== i && !incorrect.length ? (
                  <Button onClick={setFocusToNextInput} type="button">
                    NEXT
                  </Button>
                ) : !formState.isSubmitted ? (
                  <Button onClick={handleSubmit(onSubmit)} type="button" variant="outlined">
                    CHECK ANSWERS
                  </Button>
                ) : undefined}
              </div>
            </div>
          ))}
        </form>
      </div>
    </>
  );
};

ExamPage.getInitialProps = async ({ query }) => {
  const pagekey = typeof query.set === 'string' ? query.set : '';
  const queryClient = new QueryClient();
  if (pagekey) await queryClient.prefetchQuery(['set', pagekey], () => setApi.getById(pagekey));
  return { pagekey, query, dehydratedState: dehydrate(queryClient) };
};

export default ExamPage;
