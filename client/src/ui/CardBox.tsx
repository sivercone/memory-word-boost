import Link from 'next/link';
// import { FolderInterface, SetInterface } from 'interfaces';
import style from 'styles/components/cardbox.module.scss';

interface Props {
  id: string;
  content: string;
  type: 'folder' | 'set';
}

export const CardBox: React.FC<Props> = ({ id, content, type }) => {
  return (
    <Link href={type === 'set' ? `/${id}` : `/folder/${id}`}>
      <a className={style.cardbox}>
        <div className={style.cardbox__icon}>
          <div>
            {type === 'set' ? (
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                <path d="M12 20q-1.2-.95-2.6-1.475Q8 18 6.5 18q-1.05 0-2.062.275-1.013.275-1.938.775-.525.275-1.012-.025Q1 18.725 1 18.15V6.1q0-.275.138-.525.137-.25.412-.375 1.15-.6 2.4-.9Q5.2 4 6.5 4q1.45 0 2.838.375Q10.725 4.75 12 5.5v12.1q1.275-.8 2.675-1.2 1.4-.4 2.825-.4.9 0 1.763.15.862.15 1.737.45v-12q.375.125.738.262.362.138.712.338.275.125.413.375.137.25.137.525v12.05q0 .575-.487.875-.488.3-1.013.025-.925-.5-1.938-.775Q18.55 18 17.5 18q-1.5 0-2.9.525T12 20Zm2-5V5.5l5-5v10Zm-4 1.625v-9.9q-.825-.35-1.712-.537Q7.4 6 6.5 6q-.925 0-1.8.175T3 6.7v9.925q.875-.325 1.738-.475Q5.6 16 6.5 16t1.762.15q.863.15 1.738.475Zm0 0v-9.9Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                <path d="M6 12h12v-2H6Zm0 4h8v-2H6Zm-2 4q-.825 0-1.412-.587Q2 18.825 2 18V6q0-.825.588-1.412Q3.175 4 4 4h6l2 2h8q.825 0 1.413.588Q22 7.175 22 8v10q0 .825-.587 1.413Q20.825 20 20 20ZM4 6v12h16V8h-8.825l-2-2H4Zm0 0v12Z" />
              </svg>
            )}
          </div>
        </div>
        <div className={style.cardbox__content}>
          <p>{content}</p>
        </div>
      </a>
    </Link>
  );
};