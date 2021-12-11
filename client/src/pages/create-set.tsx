import React from 'react';
import SetEditing from 'components/SetEditing';

const CreateSet = () => {
  const data = { cards: [{ term: '', definition: '' }] };
  return <SetEditing setFigure={data} />;
};

export default CreateSet;
