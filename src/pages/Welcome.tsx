import {PageContainer, ProCard, StatisticCard, ProList} from '@ant-design/pro-components';
import React, {useEffect, useMemo, useState} from 'react';
import {useModel} from '@umijs/max';
import {fetchBookList} from '@/services/youcomic/book';
import {fetchLibraryList} from '@/services/youcomic/library';
import {fetchTagList} from '@/services/youcomic/tag';
import {BookOutlined, FolderOpenOutlined, TagsOutlined, ArrowRightOutlined} from '@ant-design/icons';
import {Avatar, Button, Space, Tag, Typography} from 'antd';
import { BookCoverLoader } from '@/components/YouComic/ImageLoader';

const Welcome: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const youComicAvailable = useMemo(() => {
    const list = initialState?.proxyList || [];
    return list?.some((it) => it?.name === 'YouComic' || it?.prefix === '/api/comic');
  }, [initialState?.proxyList]);

  const [loading, setLoading] = useState<boolean>(false);
  const [libCount, setLibCount] = useState<number>(0);
  const [bookCount, setBookCount] = useState<number>(0);
  const [tagCount, setTagCount] = useState<number>(0);
  const [recentBooks, setRecentBooks] = useState<YouComicAPI.Book[]>([]);
  const [recentTags, setRecentTags] = useState<YouComicAPI.Tag[]>([]);
  const [recentLibraries, setRecentLibraries] = useState<YouComicAPI.Library[]>([]);
  const [loadingRecent, setLoadingRecent] = useState<boolean>(false);
  const LIST_CARD_HEIGHT = 360;

  useEffect(() => {
    if (!youComicAvailable) return;
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const [libs, books, tags] = await Promise.all([
          fetchLibraryList({ page: 1, page_size: 1 }),
          fetchBookList({ page: 1, page_size: 1 }),
          fetchTagList({ page: 1, page_size: 1 }),
        ]);
        if (!cancelled) {
          setLibCount(libs?.count || 0);
          setBookCount(books?.count || 0);
          setTagCount(tags?.count || 0);
        }
      } catch (e) {
        if (!cancelled) {
          setLibCount(0);
          setBookCount(0);
          setTagCount(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [youComicAvailable]);

  useEffect(() => {
    if (!youComicAvailable) return;
    let cancelled = false;
    const run = async () => {
      setLoadingRecent(true);
      try {
        const [books, tags, libs] = await Promise.all([
          fetchBookList({ page: 1, page_size: 5, order: '-books.id' } as any),
          fetchTagList({ page: 1, page_size: 5, order: '-id' }),
          fetchLibraryList({ page: 1, page_size: 5, order: '-id' } as any),
        ]);
        if (!cancelled) {
          setRecentBooks(books?.result || []);
          setRecentTags(tags?.result || []);
          setRecentLibraries(libs?.result || []);
        }
      } catch (e) {
        if (!cancelled) {
          setRecentBooks([]);
          setRecentTags([]);
          setRecentLibraries([]);
        }
      } finally {
        if (!cancelled) setLoadingRecent(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [youComicAvailable]);

  return (
    <PageContainer>
      {youComicAvailable ? (
        <ProCard title={<Space><BookOutlined /> <span>YouComic 概览</span></Space>} bordered headerBordered>
          <StatisticCard.Group direction="row">
            <StatisticCard
              loading={loading}
              statistic={{ title: '库数量', value: libCount }}
            />
            <StatisticCard
              loading={loading}
              statistic={{ title: '书目数量', value: bookCount }}
            />
            <StatisticCard
              loading={loading}
              statistic={{ title: '标签数量', value: tagCount }}
            />
          </StatisticCard.Group>
        </ProCard>
      ) : null}
      {youComicAvailable ? (
        <ProCard gutter={16} style={{ marginTop: 16 }} ghost>
          <ProCard
            colSpan={{ xs: 24, sm: 24, md: 8 }}
            title={<Space><BookOutlined /> <span>最近书籍</span></Space>}
            bordered
            extra={<Button type="link" size="small" href="/youcomic/book/list">查看全部 <ArrowRightOutlined /></Button>}
            style={{ height: LIST_CARD_HEIGHT, display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ paddingTop: 12, paddingBottom: 12, display: 'flex', flexDirection: 'column', flex: 1 }}
          >
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <ProList<YouComicAPI.Book>
                loading={loadingRecent}
                rowKey="id"
                dataSource={recentBooks}
                metas={{
                  avatar: {
                    render: (_, row) => {
                      return (
                        <Avatar shape="square" size={48}>
                          <BookCoverLoader 
                            book={row} 
                            className="w-full h-full object-cover"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Avatar>
                      );
                    }
                  },
                  title: { dataIndex: 'name' },
                  description: {
                    render: (_, row) => row?.dirName || '',
                  },
                }}
                split
              />
            </div>
          </ProCard>
          <ProCard
            colSpan={{ xs: 24, sm: 24, md: 8 }}
            title={<Space><TagsOutlined /> <span>最近标签</span></Space>}
            bordered
            extra={<Button type="link" size="small" href="/youcomic/tag/list">查看全部 <ArrowRightOutlined /></Button>}
            style={{ height: LIST_CARD_HEIGHT, display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ paddingTop: 12, paddingBottom: 12, display: 'flex', flexDirection: 'column', flex: 1 }}
          >
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <ProList<YouComicAPI.Tag>
                loading={loadingRecent}
                rowKey="id"
                dataSource={recentTags}
                metas={{
                  title: {
                    render: (_, row) => <Space size={8}><Tag>{row.name}</Tag><Typography.Text type="secondary">{row.type}</Typography.Text></Space>
                  },
                  description: {
                    render: () => null,
                  },
                }}
                split
              />
            </div>
          </ProCard>
          <ProCard
            colSpan={{ xs: 24, sm: 24, md: 8 }}
            title={<Space><FolderOpenOutlined /> <span>最近库</span></Space>}
            bordered
            extra={<Button type="link" size="small" href="/youcomic/library/list">查看全部 <ArrowRightOutlined /></Button>}
            style={{ height: LIST_CARD_HEIGHT, display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ paddingTop: 12, paddingBottom: 12, display: 'flex', flexDirection: 'column', flex: 1 }}
          >
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <ProList<YouComicAPI.Library>
                loading={loadingRecent}
                rowKey="id"
                dataSource={recentLibraries}
                metas={{
                  avatar: {
                    render: () => <Avatar shape="square" size={40} icon={<FolderOpenOutlined />} />
                  },
                  title: { dataIndex: 'name' },
                  description: {
                    render: (_, row) => <Typography.Text ellipsis style={{ maxWidth: 220 }}>{row.path}</Typography.Text>
                  },
                }}
                split
              />
            </div>
          </ProCard>
        </ProCard>
      ) : null}
    </PageContainer>
  );
};

export default Welcome;
