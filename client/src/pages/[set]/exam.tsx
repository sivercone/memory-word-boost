import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import { setApi } from 'apis/setApi';
import Custom404 from 'pages/404';
import { Button } from 'ui/Button';
import { CardInterface, SetInterface } from 'interfaces';
import { isAnswerCorrect } from 'lib/utils';
import style from 'styles/pages/exam.module.scss';
import Header from 'ui/Header';

type SubmitData = { form: { input: string }[] };

const ExamPage: NextPage<{ pagekey: string }> = ({ pagekey }) => {
  const { push } = useRouter();

  const set = useQuery(['set', pagekey], () => setApi.getById(pagekey));
  const [currSet, setCurrSet] = React.useState<SetInterface>();
  React.useEffect(() => {
    setCurrSet(set.data);
  }, [set.data]);

  const [cards, setCards] = React.useState<CardInterface[]>([]);
  React.useEffect(() => {
    if (currSet) setCards(currSet.cards.sort(() => Math.random() - 0.5));
  }, [currSet]);

  const { register, handleSubmit, formState, reset } = useForm<SubmitData>();
  const [incorrect, setIncorrect] = React.useState<{ correct: boolean; index: number; answer: string }[]>([]);
  const onSubmit = (payload: SubmitData) => {
    setIncorrect(
      payload.form.map((el, i) =>
        !isAnswerCorrect(el.input, cards[i].term)
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

  if (!currSet) return <Custom404 />;
  return (
    <>
      <Header>
        <button onClick={() => push(`/${pagekey}`)} title="close">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
          </svg>
        </button>
        <span>
          <strong>PROJECT MWB</strong>
        </span>
        <div style={{ userSelect: 'none', width: '24px', height: '24px', visibility: 'hidden' }}></div>
      </Header>
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
              <p style={{ color: 'var(--color-error)' }}>
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
                <span>{el.definition}</span>
                {incorrect.length ? (
                  <>
                    <span style={!incorrect[i].correct ? { color: 'var(--color-error)' } : undefined}>correct answer</span>
                    <span>{cards[i].term}</span>
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
