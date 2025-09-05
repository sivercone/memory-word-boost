import clsx from 'clsx';

type LogoVariant = 'dark' | 'light';
type LogoSize = 'base' | 'xl';

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

const Logo = ({ variant = 'dark', size = 'base', as: Wrapper = 'div', className }: LogoProps) => {
  const gradientTo = variant === 'light' ? 'to-white/90' : 'to-[#111827]';
  const badgeText = variant === 'light' ? 'text-onSurface' : 'text-[#6b7280]';

  return (
    <Wrapper className={clsx('flex select-none items-center gap-1', className)}>
      <span
        className={clsx(
          'bg-gradient-to-br from-primary-500',
          gradientTo,
          'box-decoration-slice bg-clip-text font-semibold text-transparent',
          size === 'xl' && 'text-xl',
        )}
        style={{ letterSpacing: '-0.9px', lineHeight: '0.8' }}
      >
        PROJECT MWB
      </span>
      <span className={clsx('rounded-lg bg-background px-1 text-xs font-medium', badgeText)} style={{ letterSpacing: '-0.8px' }}>
        Prototype
      </span>
    </Wrapper>
  );
};

export default Logo;
