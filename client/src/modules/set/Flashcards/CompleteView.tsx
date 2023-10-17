import React from 'react';
import { ButtonSquare } from '@src/ui';

const CompleteView: React.FC<{ queryId: string; cardsLength: number; scorePercentage: string }> = ({
  queryId,
  cardsLength,
  scorePercentage,
}) => {
  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="bg-violet-200 rounded-lg flex-1 flex flex-col justify-end gap-4 items-start p-8">
        <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" className="fill-gray-800">
          <path d="m423.231-309.847 268.922-268.922L650-620.922 423.231-394.153l-114-114L267.078-466l156.153 156.153Zm56.836 209.846q-78.836 0-148.204-29.92-69.369-29.92-120.682-81.21-51.314-51.291-81.247-120.629-29.933-69.337-29.933-148.173t29.92-148.204q29.92-69.369 81.21-120.682 51.291-51.314 120.629-81.247 69.337-29.933 148.173-29.933t148.204 29.92q69.369 29.92 120.682 81.21 51.314 51.291 81.247 120.629 29.933 69.337 29.933 148.173t-29.92 148.204q-29.92 69.369-81.21 120.682-51.291 51.314-120.629 81.247-69.337 29.933-148.173 29.933ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
        </svg>
        <p className="text-xl font-semibold">Well done!</p>
      </div>
      <div className="bg-gray-200 rounded-lg flex-1 flex flex-col justify-end gap-4 items-start p-8">
        <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" className="fill-gray-800">
          <path d="M240-167.693q-30.307 0-51.307-21-21-21-21-51.307 0-30.307 21-51.307 21-21 51.307-21 30.307 0 51.307 21 21 21 21 51.307 0 30.307-21 51.307-21 21-51.307 21Zm320 0q-30.307 0-51.307-21-21-21-21-51.307 0-30.307 21-51.307 21-21 51.307-21 30.307 0 51.307 21 21 21 21 51.307 0 30.307-21 51.307-21 21-51.307 21Zm-160-160q-30.307 0-51.307-21-21-21-21-51.307 0-30.307 21-51.307 21-21 51.307-21 30.307 0 51.307 21 21 21 21 51.307 0 30.307-21 51.307-21 21-51.307 21Zm320 0q-30.307 0-51.307-21-21-21-21-51.307 0-30.307 21-51.307 21-21 51.307-21 30.307 0 51.307 21 21 21 21 51.307 0 30.307-21 51.307-21 21-51.307 21Zm-480-160q-30.307 0-51.307-21-21-21-21-51.307 0-30.307 21-51.307 21-21 51.307-21 30.307 0 51.307 21 21 21 21 51.307 0 30.307-21 51.307-21 21-51.307 21Zm320 0q-30.307 0-51.307-21-21-21-21-51.307 0-30.307 21-51.307 21-21 51.307-21 30.307 0 51.307 21 21 21 21 51.307 0 30.307-21 51.307-21 21-51.307 21Zm-160-160q-30.307 0-51.307-21-21-21-21-51.307 0-30.307 21-51.307 21-21 51.307-21 30.307 0 51.307 21 21 21 21 51.307 0 30.307-21 51.307-21 21-51.307 21Zm320 0q-30.307 0-51.307-21-21-21-21-51.307 0-30.307 21-51.307 21-21 51.307-21 30.307 0 51.307 21 21 21 21 51.307 0 30.307-21 51.307-21 21-51.307 21Z" />
        </svg>
        <p className="text-xl font-semibold">{`Cards Completed: ${cardsLength}`}</p>
      </div>
      <div className="bg-gray-300 rounded-lg flex-1 flex flex-col justify-end gap-4 items-start p-8">
        <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" className="fill-gray-800">
          <path d="M120-380q-8 0-14-6t-6-14q0-8 6-14t14-6q8 0 14 6t6 14q0 8-6 14t-14 6Zm0-160q-8 0-14-6t-6-14q0-8 6-14t14-6q8 0 14 6t6 14q0 8-6 14t-14 6Zm120 336.923q-15.692 0-26.308-10.615-10.615-10.616-10.615-26.308t10.615-26.308q10.616-10.615 26.308-10.615t26.308 10.615q10.615 10.616 10.615 26.308t-10.615 26.308Q255.692-203.077 240-203.077Zm0-160q-15.692 0-26.308-10.615-10.615-10.616-10.615-26.308t10.615-26.308q10.616-10.615 26.308-10.615t26.308 10.615q10.615 10.616 10.615 26.308t-10.615 26.308Q255.692-363.077 240-363.077Zm0-160q-15.692 0-26.308-10.616-10.615-10.615-10.615-26.307 0-15.692 10.615-26.307 10.616-10.616 26.308-10.616t26.308 10.616q10.615 10.615 10.615 26.307 0 15.692-10.615 26.307-10.616 10.616-26.308 10.616Zm0-160q-15.692 0-26.308-10.616-10.615-10.615-10.615-26.307 0-15.692 10.615-26.307 10.616-10.616 26.308-10.616t26.308 10.616q10.615 10.615 10.615 26.307 0 15.692-10.615 26.307-10.616 10.616-26.308 10.616Zm160.091 336.923q-22.398 0-38.168-15.679-15.769-15.679-15.769-38.076 0-22.398 15.679-38.168 15.679-15.769 38.076-15.769 22.398 0 38.168 15.679 15.769 15.679 15.769 38.076 0 22.398-15.679 38.168-15.679 15.769-38.076 15.769Zm0-160q-22.398 0-38.168-15.679-15.769-15.678-15.769-38.076t15.679-38.168q15.679-15.769 38.076-15.769 22.398 0 38.168 15.679 15.769 15.678 15.769 38.076t-15.679 38.168q-15.679 15.769-38.076 15.769ZM400-203.077q-15.692 0-26.308-10.615-10.615-10.616-10.615-26.308t10.615-26.308q10.616-10.615 26.308-10.615t26.308 10.615q10.615 10.616 10.615 26.308t-10.615 26.308Q415.692-203.077 400-203.077Zm0-480q-15.692 0-26.308-10.616-10.615-10.615-10.615-26.307 0-15.692 10.615-26.307 10.616-10.616 26.308-10.616t26.308 10.616q10.615 10.615 10.615 26.307 0 15.692-10.615 26.307-10.616 10.616-26.308 10.616ZM400-100q-8 0-14-6t-6-14q0-8 6-14t14-6q8 0 14 6t6 14q0 8-6 14t-14 6Zm0-720q-8 0-14-6t-6-14q0-8 6-14t14-6q8 0 14 6t6 14q0 8-6 14t-14 6Zm160.091 473.846q-22.398 0-38.168-15.679-15.769-15.679-15.769-38.076 0-22.398 15.679-38.168 15.678-15.769 38.076-15.769t38.168 15.679q15.769 15.679 15.769 38.076 0 22.398-15.679 38.168-15.678 15.769-38.076 15.769Zm0-160q-22.398 0-38.168-15.679-15.769-15.678-15.769-38.076t15.679-38.168q15.678-15.769 38.076-15.769t38.168 15.679q15.769 15.678 15.769 38.076t-15.679 38.168q-15.678 15.769-38.076 15.769ZM560-203.077q-15.692 0-26.307-10.615-10.616-10.616-10.616-26.308t10.616-26.308q10.615-10.615 26.307-10.615 15.692 0 26.307 10.615 10.616 10.616 10.616 26.308t-10.616 26.308Q575.692-203.077 560-203.077Zm0-480q-15.692 0-26.307-10.616-10.616-10.615-10.616-26.307 0-15.692 10.616-26.307 10.615-10.616 26.307-10.616 15.692 0 26.307 10.616 10.616 10.615 10.616 26.307 0 15.692-10.616 26.307-10.615 10.616-26.307 10.616ZM560-100q-8 0-14-6t-6-14q0-8 6-14t14-6q8 0 14 6t6 14q0 8-6 14t-14 6Zm0-720q-8 0-14-6t-6-14q0-8 6-14t14-6q8 0 14 6t6 14q0 8-6 14t-14 6Zm160 616.923q-15.692 0-26.307-10.615-10.616-10.616-10.616-26.308t10.616-26.308q10.615-10.615 26.307-10.615 15.692 0 26.307 10.615 10.616 10.616 10.616 26.308t-10.616 26.308Q735.692-203.077 720-203.077Zm0-160q-15.692 0-26.307-10.615-10.616-10.616-10.616-26.308t10.616-26.308q10.615-10.615 26.307-10.615 15.692 0 26.307 10.615 10.616 10.616 10.616 26.308t-10.616 26.308Q735.692-363.077 720-363.077Zm0-160q-15.692 0-26.307-10.616-10.616-10.615-10.616-26.307 0-15.692 10.616-26.307 10.615-10.616 26.307-10.616 15.692 0 26.307 10.616 10.616 10.615 10.616 26.307 0 15.692-10.616 26.307-10.615 10.616-26.307 10.616Zm0-160q-15.692 0-26.307-10.616-10.616-10.615-10.616-26.307 0-15.692 10.616-26.307 10.615-10.616 26.307-10.616 15.692 0 26.307 10.616 10.616 10.615 10.616 26.307 0 15.692-10.616 26.307-10.615 10.616-26.307 10.616ZM840-380q-8 0-14-6t-6-14q0-8 6-14t14-6q8 0 14 6t6 14q0 8-6 14t-14 6Zm0-160q-8 0-14-6t-6-14q0-8 6-14t14-6q8 0 14 6t6 14q0 8-6 14t-14 6Z" />
        </svg>
        <p className="text-xl font-semibold">{`Score: ${scorePercentage}%`}</p>
      </div>
      <ButtonSquare href={`/sets/${queryId}`} className="w-full">
        <span className="font-medium">Continue</span>
      </ButtonSquare>
    </div>
  );
};

export default CompleteView;
