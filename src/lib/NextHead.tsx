import Head from 'next/head';

interface NextHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const NextHead = ({
  title,
  description = 'Web app designed to catalyze the learning process.',
  image = '/icon.png',
  url,
}: NextHeadProps): React.ReactElement => {
  const headTitle = title ? `${title} – Project MWB` : 'Project MWB';

  return (
    <Head>
      <title>{headTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      {url ? <link rel="canonical" href={url} /> : null}

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en-US" />
      <meta property="og:site_name" content="PROJECT MWB" />
      <meta property="og:title" content={headTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {url ? <meta property="og:url" content={url} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={headTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
};

export default NextHead;
