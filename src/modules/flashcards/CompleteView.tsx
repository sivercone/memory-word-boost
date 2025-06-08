import { ButtonLink, Icons } from '@src/ui';

const CompleteView: React.FC<{ queryId: string; cardsLength: number; scorePercentage: string }> = ({
  queryId,
  cardsLength,
  scorePercentage,
}) => {
  return (
    <div className="flex-1 flex flex-col gap-4 animate-fadeIn">
      <div className="bg-primary-200 rounded-lg flex-1 flex flex-col justify-end gap-4 items-start p-4">
        <Icons.CheckCircle height="48" width="48" className="fill-onSurface" />
        <p className="text-xl font-semibold text-onSurface">Well done!</p>
      </div>
      <div className="bg-outline rounded-lg flex-1 flex flex-col justify-end gap-4 items-start p-4">
        <Icons.Package height="48" width="48" className="fill-onSurface" />
        <p className="text-xl font-semibold text-onSurface">{`Cards Completed: ${cardsLength}`}</p>
      </div>
      <div className="bg-surface rounded-lg flex-1 flex flex-col justify-end gap-4 items-start p-4">
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
