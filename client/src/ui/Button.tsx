import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import style from 'styles/components/button.module.scss';

const styleCommon = {
  contained: `${style.button} ${style['button--contained']}`,
  outlined: `${style.button} ${style['button--outlined']}`,
  icon: `${style.button} ${style['button--icon']}`,
};

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  variant?: keyof typeof styleCommon;
  //    loading?: boolean;
};

export const Button: React.FC<ButtonProps> = ({ children, variant = 'contained', ...props }) => {
  return (
    <button className={styleCommon[variant]} {...props}>
      {children}
    </button>
  );
};
