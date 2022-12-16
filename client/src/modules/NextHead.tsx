import Head from 'next/head';
import { NextPage } from 'next';

interface NextHeadProps {
  title?: string;
  description?: string;
  image?: string;
  themeColor?: string;
}

export const NextHead: NextPage<NextHeadProps> = ({
  title,
  description = 'Web application that helps fast learning and memorizing anything',
  image = '/logo.png',
  themeColor = '#000000',
}) => {
  return (
    <Head>
      {title ? <title>{`${title} – PROJ MWB`}</title> : <title>MEMORY WORD BOOST</title>}
      <meta name="description" content={description} />
      <meta name="theme-color" content={themeColor} />
      <meta name="og:title" content={title ? `${title} – PROJ MWB` : 'MEMORY WORD BOOST'} />
      <meta name="og:description" content={description} />
      <meta name="og:site_name" content="MEMORY WORD BOOST" />
      <meta name="og:image" content={image} />
      <meta name="og:type" content={'website'} />
    </Head>
  );
};
