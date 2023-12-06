import Head from 'next/head';

const HomeSEO = () => {
  return (
    <Head>
      <title>Open Idea</title>
      <meta
        name='description'
        content='记录美好想法'
      />

      {/* Open Graph tags for social media banner */}
      <meta
        property='og:title'
        content='Open Idea'
      />
      <meta
        property='og:description'
        content='Open Idea - A personal note software'
      />
      <meta
        property='og:site_name'
        content='Open Idea'
      />
      <meta
        property='og:type'
        content='website'
      />
      <meta
        property='og:image'
        content='/logo-og.png'
      />
      <meta
        property='og:url'
        content='https://openbytecode.com'
      />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1'
      />

      {/* Image tags */}
      <link
        rel='icon'
        href='/favicon.ico'
      />
      <link
        rel='apple-touch-icon'
        href='/favicon.ico'
      />
    </Head>
  );
};

export default HomeSEO;
