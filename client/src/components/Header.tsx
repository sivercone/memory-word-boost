import Link from "next/link";
import style from "styles/components/header.module.scss";

export const Header: React.FC = () => {
  return (
    <header className={style.header}>
      <Link href="/">
        <a>Memory Word Boost</a>
      </Link>
    </header>
  );
};
