export const pathsForHidingLayout = [
  '/login',
  '/u/[user]/settings',
  '/[set]/flashcards',
  '/[set]/learn',
  '/[set]/exam',
  '/[set]/write',
  '/[set]/update',
  '/create-set',
];

export const isBackendLess = process.env.NEXT_PUBLIC_BACKENDLESS === 'TRUE';

export const flashCardMotions = {
  init: { rotateY: 0, translateX: '0%', opacity: 1, transition: { type: 'spring', stiffness: 100, duration: 0.1 } },
  rotate: { rotateY: 180, translateX: '0%', opacity: 1, transition: { type: 'spring', stiffness: 100, duration: 0.1 } },
  translateLeft: { rotateY: 0, translateX: '100%', opacity: 0, transition: { type: 'spring', stiffness: 100, duration: 0.1 } },
  translateRight: { rotateY: 0, translateX: '-100%', opacity: 0, transition: { type: 'spring', stiffness: 100, duration: 0.1 } },
  scale: { scale: 0.9, transition: { type: 'spring', stiffness: 100, duration: 0.1 } },
};

export const growUpMotions = {
  init: { y: '100%', transition: { duration: 0.1 } },
  anim: { y: '0%', transition: { duration: 0.15 } },
};

export const opacityFadeMotions = {
  init: { opacity: 0, transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } },
  anim: { opacity: 1, transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } },
};

export const exampleSets = [
  {
    id: 'example-93cb5c8a-14ee-4ce2-9898-476a7bcf9316',
    title: 'World Capital Cities',
    description: 'Learn the names of the capitals of different countries',
    tags: ['en-en', 'countries', 'example', 'please-create-new-one-to-start'],
    cards: [
      {
        order: 0,
        term: 'Tokyo',
        definition: 'Japan',
      },
      {
        order: 1,
        term: 'Riga',
        definition: 'Latvia',
      },
      {
        order: 2,
        term: 'Paris',
        definition: 'France',
      },
      {
        order: 3,
        term: 'Helsinki',
        definition: 'Finland',
      },
      {
        order: 4,
        term: 'Tallinn',
        definition: 'Estonia',
      },
      {
        order: 5,
        term: 'London',
        definition: 'England',
      },
      {
        order: 6,
        term: 'Cairo',
        definition: 'Egypt',
      },
      {
        order: 7,
        term: 'Copenhagen',
        definition: 'Denmark',
      },
      {
        order: 8,
        term: 'Prague',
        definition: 'Czechia',
      },
      {
        order: 9,
        term: 'Beijing',
        definition: 'China',
      },
      {
        order: 10,
        term: 'Ottawa',
        definition: 'Canada',
      },
      {
        order: 11,
        term: 'Sofia',
        definition: 'Bulgaria',
      },
      {
        order: 12,
        term: 'Brasilia',
        definition: 'Brazil',
      },
      {
        order: 13,
        term: 'Brussels',
        definition: 'Belgium',
      },
      {
        order: 14,
        term: 'Vienna',
        definition: 'Austria',
      },
      {
        order: 15,
        term: 'Yerevan',
        definition: 'Armenia',
      },
      {
        order: 16,
        term: 'Budapest',
        definition: 'Hungary',
      },
      {
        order: 17,
        term: 'New Delhi',
        definition: 'India',
      },
      {
        order: 18,
        term: 'Dublin',
        definition: 'Ireland',
      },
      {
        order: 19,
        term: 'Rome',
        definition: 'Italy',
      },
      {
        order: 20,
        term: 'Warsaw',
        definition: 'Poland',
      },
      {
        order: 21,
        term: 'Bratislava',
        definition: 'Slovakia',
      },
      {
        order: 22,
        term: 'Seoul',
        definition: 'South Korea',
      },
      {
        order: 23,
        term: 'Taipei',
        definition: 'Taiwan',
      },
      {
        order: 24,
        term: 'Kyiv',
        definition: 'Ukraine',
      },
      {
        order: 25,
        term: 'Ankara',
        definition: 'Turkey',
      },
    ],
    createdAt: '2022-12-12T12:57:29.700Z',
    updatedAt: '2022-12-12T12:58:15.432Z',
    folders: [],
    user: {
      id: '7ca8f7b0-4d1c-4c08-b470-1895c1edb3d6',
      email: 'you@domain.com',
      name: 'user251015',
      bio: '',
      avatar: '',
      createdAt: '',
      updatedAt: '',
    },
  },
  {
    id: 'example-9bf2a68d-9280-4d13-84a1-a1f595c12158',
    title: 'Political terms',
    description: 'A learning set with political terms',
    tags: ['en-en', 'political', 'example', 'please-create-new-one-to-start'],
    cards: [
      {
        order: 0,
        term: 'Democracy',
        definition:
          'Political regime in which the people are recognized as the only legitimate source of power in the state. At the same time, the state is managed by the people, directly or through elected representatives.',
      },
      {
        order: 1,
        term: 'Autocracy',
        definition:
          'Form of political regime based on the unlimited control of power by one person or a council, such as a one-party parliament or a presidential republic, whose decisions are not subject to external legal restrictions or orderly mechanisms of popular control',
      },
      {
        order: 2,
        term: 'Monarchy',
        definition:
          'Form of government in which the head of state is the bearer of the appropriate title. The power of attorney has an unlimited term, while his rights may be limited by the law, the constitution or the parliament. Depending on the case, power varies from absolute to purely formal. As a rule, the position of head of state is inherited.',
      },
      {
        order: 3,
        term: 'Socialism',
        definition:
          'A philosophy aimed at the realization of equality, the achievement of which is assumed, including through public ownership of the means of production. In a broader sense, it can be defined as a political trend, the main principle of which is the desire for peace based on harmonious organization and the fight against injustice. In economic terms, it is characterized by public and/or state control over the economy — both over the means of production and over the process of resource distribution',
      },
    ],
    createdAt: '2022-12-11T16:08:26.048Z',
    updatedAt: '2022-12-11T16:11:42.322Z',
    folders: [],
    user: {
      id: '7ca8f7b0-4d1c-4c08-b470-1895c1edb3d6',
      email: 'you@domain.com',
      name: 'user251015',
      bio: '',
      avatar: '',
      createdAt: '',
      updatedAt: '',
    },
  },
];
