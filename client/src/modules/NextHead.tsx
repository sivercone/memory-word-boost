import Head from 'next/head';
import { NextPage } from 'next';

interface NextHeadProps {
  title?: string;
  description?: string;
  image?: string;
}

export const NextHead: NextPage<NextHeadProps> = ({
  title,
  description = 'Web app designed to catalyze the learning process.',
  image = '/logo.png',
}) => {
  const headTitle = title ? `${title} – PROJECT MWB` : 'Memory Word Boost';

  return (
    <Head>
      <title>{headTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en-US" />
      <meta property="og:site_name" content="PROJECT MWB" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
};
