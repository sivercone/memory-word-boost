import Link from 'next/link';
import { FolderInterface, SetInterface } from 'interfaces';
import style from 'styles/components/cardbox.module.scss';

interface SetProps {
  content: SetInterface;
  fullsize?: boolean;
}
interface FolderProps {
  content: FolderInterface;
  fullsize?: boolean;
}

export const CardBoxSet: React.FC<SetProps> = ({ content, fullsize }) => {
  return (
    <Link href={`/${content.id}`}>
      <a style={fullsize ? { width: '100%' } : undefined} className={style.cardbox}>
        <div className={style.cardbox__icon}>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
              <path
                fill="currentColor"
                d="M24 40q-2.4-1.9-5.2-2.95Q16 36 13 36q-2.1 0-4.125.55T5 38.1q-1.05.55-2.025-.05Q2 37.45 2 36.3V12.2q0-.55.275-1.05t.825-.75q2.3-1.2 4.8-1.8Q10.4 8 13 8q2.9 0 5.675.75T24 11v25.3q2.55-1.65 5.35-2.475Q32.15 33 35 33q1.8 0 3.925.35T43 34.8V9.55q.5.2.975.4t.925.45q.5.3.8.775.3.475.3 1.025v24.1q0 1.15-.975 1.75-.975.6-2.025.05-1.85-1-3.875-1.55T35 36q-3 0-5.8 1.05T24 40Zm3-8.35V14L40 1v19.35Zm-6 3.15V12.85q-1.7-.95-3.95-1.4Q14.8 11 13 11q-2.35 0-4.375.5T5 12.8v22q1.75-.85 3.775-1.325T13.05 33q2.2 0 4.2.475T21 34.8Zm0 0V12.85Z"
              />
            </svg>
          </div>
        </div>
        <div className={style.cardbox__content}>
          <div className={style.cardbox__text}>
            <h2>{content.title}</h2>
            <p>{content.description}</p>
          </div>
          <ul className={style.cardbox__tags}>
            {content.tags.map((tag, i) => (
              <li key={tag + i}>{tag}</li>
            ))}
          </ul>
        </div>
      </a>
    </Link>
  );
};

export const CardBoxFolder: React.FC<FolderProps> = ({ content, fullsize }) => {
  return (
    <Link href={`/folder/${content.id}`}>
      <a style={fullsize ? { width: '100%' } : undefined} className={style.cardbox}>
        <div className={style.cardbox__icon}>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
              <path
                fill="currentColor"
                d="M7.05 40q-1.2 0-2.1-.925-.9-.925-.9-2.075V11q0-1.15.9-2.075Q5.85 8 7.05 8h14l3 3h17q1.15 0 2.075.925.925.925.925 2.075v23q0 1.15-.925 2.075Q42.2 40 41.05 40Zm0-29v26h34V14H22.8l-3-3H7.05Zm0 0v26Z"
              />
            </svg>
          </div>
        </div>
        <div className={style.cardbox__content}>
          <div className={style.cardbox__text}>
            <h2>{content.name}</h2>
            <p>{content.description}</p>
          </div>
        </div>
      </a>
    </Link>
  );
};
