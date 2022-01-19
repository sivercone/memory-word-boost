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
    <Link href={`/${content.id}`} key={content.id}>
      <a style={fullsize ? { width: '100%' } : undefined} className={style.cardbox}>
        <div className={style.cardbox__text}>
          <h2>{content.title}</h2>
          <p>{content.description}</p>
        </div>
        <ul className={style.cardbox__tags}>
          {content.tags.map((tag, i) => (
            <li key={tag + i}>{tag}</li>
          ))}
        </ul>
      </a>
    </Link>
  );
};

export const CardBoxFolder: React.FC<FolderProps> = ({ content, fullsize }) => {
  return (
    <Link href={`/folder/${content.id}`} key={content.id}>
      <a style={fullsize ? { width: '100%' } : undefined} className={style.cardbox}>
        <div className={style.cardbox__text}>
          <h2>{content.name}</h2>
          <p>{content.description}</p>
        </div>
      </a>
    </Link>
  );
};
