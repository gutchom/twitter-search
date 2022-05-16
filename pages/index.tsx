import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import styles from 'styles/Home.module.css';

type Props = {};

const Index: NextPage<Props> = (props) => {
  const {} = props;

  return (
    <>
      <Head>
        <title>Twitter Search</title>
      </Head>

      <main className={styles.main}>
        Hello, World!
      </main>
    </>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const { req } = context;
  if (!req.headers.host) {
    throw new Error('host is undefined.');
  }
  // const [hostname] = req.headers.host.split(':');

  return { props: {} };
};
