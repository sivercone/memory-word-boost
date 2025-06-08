import { Button } from '@src/ui';

const Banner = () => {
  return (
    <div className="space-y-2 p-4 rounded-lg bg-gradient-to-b from-primary-600 to-primary-950 border border-outline">
      <h2 className="text-lg font-medium text-white/90">From Prototype to Application</h2>
      <p className="text-white/90 text-sm">
        This website started as a prototype and now complements my mobile app. The app offers an enhanced learning experience with
        additional features not available on this site. While the website code is{' '}
        <a href="https://github.com/sivercone/memory-word-boost" target="_blank" rel="noreferrer" className="underline">
          open-source
        </a>{' '}
        and showcases my development journey, the app represents the culmination of this project.
      </p>
      <Button onClick={() => window.open('https://qsets.sivercone.com')} className="w-full">
        Learn more
      </Button>
    </div>
  );
};

export default Banner;
