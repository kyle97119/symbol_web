/*

  Symbol関連の情報のうち、公的な情報の取り扱いページ（インデックス側より飛んだ先のページ）

*/
import type { NextPage } from 'next';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Header from '../../components/moleculs/Header';
import Footer from '../../components/moleculs/Footer';
import { useEffect, useState } from 'react';
import strapi from '../../service/StrapiService';
import { NewsReleaseFindOneResponse } from '../../model/StrapiMode';
import { Toolbar } from '../../components/atom/Toolbar';
import Container from '@mui/material/Container';
import { PageTitle } from '../../components/atom/Titles';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import Link from 'next/link';
import CodeBlock from '../../components/atom/CodeBlock';
import UtilService from '../../service/UtilService';
import MarkdownParser from '../../components/moleculs/MarkdownParser';

const NewsArticle: NextPage = (args: any) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.between('xs', 'md'));
  const [news, setNews] = useState<NewsReleaseFindOneResponse['data'] | null>(null);
  const router = useRouter();
  const query = router.query;

  // ページの起動時にニュースを取得する
  useEffect(() => {
    if (typeof window === 'object' && query !== undefined && query.slug !== undefined) {
      strapi.findOneNewsRelease((query as { slug: string }).slug).then((e) => {
        setNews({ ...e.data });
      });
    }
  }, [query, router]);

  if (news === null) {
    return <div />;
  }

  return (
    <div style={{ marginBottom: '5vh' }}>
      <Container maxWidth="lg" style={{ height: '100%' }}>
        <Header />
        <Toolbar />
        <div
          style={{ marginTop: '10px', display: 'flex', flexWrap: 'nowrap', justifyContent: 'flex-start', gap: '10px' }}
        >
          <Typography color="text.secondary">作者</Typography>
          <Typography color="text.secondary">{'Symbol address'}</Typography>
        </div>
        <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'flex-start', gap: '10px' }}>
          <Typography color="text.secondary">作成</Typography>
          <Typography color="text.secondary">
            {UtilService.formatDate(new Date(news.attributes.publishedAt), 'yyyy/MM/dd')}
          </Typography>
          <Typography color="text.secondary">更新</Typography>
          <Typography color="text.secondary">
            {UtilService.formatDate(new Date(news.attributes.updatedAt), 'yyyy/MM/dd')}
          </Typography>
        </div>
        <PageTitle>{news.attributes.title}</PageTitle>
        <MarkdownParser markdown={news.attributes.body} />
        <div style={{ height: '10vh' }} />
        <Footer />
      </Container>
    </div>
  );
};

export default NewsArticle;
