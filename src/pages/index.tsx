import Head from 'next/head';

import Heatmap from '@/components/Heatmap';

import styles from '@/styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Next.js | D3.js | TypeScript</title>
        <meta
          name="description"
          content="This is a demo of a heatmap using Next.js, D3.js and TypeScript."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          This is a demo of a{` `}
          <a
            href="https://d3-graph-gallery.com/graph/line_cursor.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            heatmap
          </a>
          {` `}
          using Next.js,{` `}
          <a href="https://d3js.org/" target="_blank" rel="noopener noreferrer">
            D3.js
          </a>
          {` `}
          and TypeScript.
        </p>

        <div className={styles.heatmapContainer}>
          <Heatmap className={styles.heatmap} />
        </div>
      </main>
    </div>
  );
}
