import { ButtonLink, Icons } from '@src/ui';

const CompleteView: React.FC<{ queryId: string; cardsLength: number; scorePercentage: string }> = ({
  queryId,
  cardsLength,
  scorePercentage,
}) => {
  return (
    <div className="flex flex-1 animate-fadeIn flex-col gap-4">
      <div className="flex flex-1 flex-col items-start justify-end gap-4 rounded-lg bg-primary-200 p-4">
        <Icons.CheckCircle height="48" width="48" className="fill-onSurface" />
        <p className="text-xl font-semibold text-onSurface">Well done!</p>
      </div>
      <div className="flex flex-1 flex-col items-start justify-end gap-4 rounded-lg bg-outline p-4">
        <Icons.Package height="48" width="48" className="fill-onSurface" />
        <p className="text-xl font-semibold text-onSurface">{`Cards Completed: ${cardsLength}`}</p>
      </div>
      <div className="flex flex-1 flex-col items-start justify-end gap-4 rounded-lg bg-surface p-4">
        <Icons.Blur height="48" width="48" className="fill-onSurface" />
        <p className="text-xl font-semibold text-onSurface">{`Score: ${scorePercentage}%`}</p>
      </div>
      <ButtonLink href={`/sets/${queryId}`} className="w-full">
        <span className="font-medium">Continue</span>
      </ButtonLink>
    </div>
  );
};

export default CompleteView;
