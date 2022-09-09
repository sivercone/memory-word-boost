import { NextPage } from 'next';
import React from 'react';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { useForm } from 'react-hook-form';
import { setApi } from 'api/setApi';
import Custom404 from 'pages/404';
import style from 'styles/pages/learn.module.scss';
// import { Modal, ModalActions, ModalBody } from 'components/Modal';
import { useRouter } from 'next/router';
import { Button } from 'ui/Button';

const ExamPage: NextPage<{ pagekey: string }> = ({ pagekey }) => {
  const set = useQuery(['set', pagekey], () => setApi.getById(pagekey));

  const { push } = useRouter();

  const [cards, setCards] = React.useState<{ term: string; definition: string }[]>([]);
  React.useEffect(() => {
    if (set.data) setCards(set.data.cards.sort(() => Math.random() - 0.5));
  }, [set.data]);

  // const [shownModal, setShownModal] = React.useState(false);
  // const toggleModal = () => setShownModal(!shownModal);

  const { register, handleSubmit, formState, reset } = useForm();
  const [incorrect, setIncorrect] = React.useState<{ correct: boolean; index: number; answer: string }[]>([]);
  const onSubmit = (payload: { form: { input: string }[] }) => {
    // setShownModal(false);
    setIncorrect(
      payload.form.map((el, i) =>
        el.input !== cards[i].definition
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

  // const onCheckAnswers = () => {
  //   if (!formState.dirtyFields.form) return toggleModal();
  //   if (formState.dirtyFields.form.length !== set.data.cards.length) toggleModal();
  //   else handleSubmit(onSubmit)();
  // };

  const onRestart = () => {
    setIncorrect([]);
    reset();
  };

  if (!set.data) return <Custom404 />;
  return (
    <div className={style.class}>
      {formState.isSubmitted ? (
        <div className={style.class__block}>
          <div className={`${style.class__main} ${style.results}`}>
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
              <Button onClick={() => push(`/${pagekey}`)} autoFocus={formState.isSubmitted} variant="outlined">
                Return to set page
              </Button>
              <Button onClick={onRestart} variant="outlined">
                Restart exam
              </Button>
            </div>
          </div>
        </div>
      ) : undefined}
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className={style.class}>
        {cards.map((el, i) => (
          <div key={i} onFocus={() => setCurrIndex(i)} className={style.class__block}>
            <div className={style.class__main}>
              <div className={style.class__learn}>
                <span>{el.term}</span>
                {incorrect.length && !incorrect[i].correct ? (
                  <>
                    <span>correct answer</span>
                    <span>{cards[i].definition}</span>
                  </>
                ) : undefined}
              </div>
              <div className={style.class__form}>
                <input
                  {...register(`form.${i}.input`)}
                  autoFocus={i === 0}
                  onKeyPress={handleEnterPress}
                  id={`input-${i}`}
                  defaultValue={incorrect.length ? incorrect[i].answer : ''}
                  disabled={!!incorrect.length}
                />
                {cards.length - 1 !== i && !incorrect.length ? (
                  <div>
                    <button onClick={setFocusToNextInput} type="button">
                      next
                    </button>
                  </div>
                ) : undefined}
              </div>
            </div>
          </div>
        ))}
        {!formState.isSubmitted ? (
          <Button onClick={handleSubmit(onSubmit)} type="button" variant="outlined">
            Check answers
          </Button>
        ) : undefined}
      </form>
      {/* <Modal isOpen={shownModal} onClose={toggleModal}>
        <ModalBody>
          <h3>It seems you haven't answered all the questions.</h3>
          <p>Do you want to check without them?</p>
        </ModalBody>
        <ModalActions>
          <button onClick={toggleModal}>Cancel</button>
          <button onClick={handleSubmit(onSubmit)}>Yes</button>
        </ModalActions>
      </Modal> */}
    </div>
  );
};

ExamPage.getInitialProps = async ({ query }) => {
  const pagekey = typeof query.set === 'string' ? query.set : '';
  const queryClient = new QueryClient();
  if (pagekey) await queryClient.prefetchQuery(['set', pagekey], () => setApi.getById(pagekey));
  return { pagekey, query, dehydratedState: dehydrate(queryClient) };
};

export default ExamPage;
