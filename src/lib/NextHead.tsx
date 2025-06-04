import { NextPage } from 'next';
import Head from 'next/head';

interface NextHeadProps {
  title?: string;
  description?: string;
  image?: string;
}

const NextHead: NextPage<NextHeadProps> = ({
  title,
  description = 'Web app designed to catalyze the learning process.',
  image = '/icon.png',
}) => {
  const headTitle = title ? `${title} – Project MWB` : 'Project MWB';

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

export default NextHead;
