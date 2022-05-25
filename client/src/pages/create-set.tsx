import React from 'react';
import SetEditing from 'components/SetEditing';
import { useUserStore } from 'storage/useUserStore';

const CreateSet = () => {
  const { user } = useUserStore();
  const data = { cards: [{ term: '', definition: '' }] };
  return user ? <SetEditing setFigure={{ ...data, user }} /> : <></>;
};

export default CreateSet;
