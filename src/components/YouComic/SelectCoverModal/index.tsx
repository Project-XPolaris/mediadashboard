import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Card,
  Space,
  Typography,
  Spin,
  message,
  Empty,
  Avatar,
  Divider,
  Checkbox
} from 'antd';
import { BookOutlined, PictureOutlined, CheckOutlined } from '@ant-design/icons';
import ImageLoader from '@/components/YouComic/ImageLoader';
import { queryPages } from '@/services/youcomic/book';
import styles from './style.less';

const { Title, Text } = Typography;

export interface SelectCoverModalProps {
  visible: boolean;
  onClose: () => void;
  books: YouComicAPI.Book[];
  onOk: (coverSelections: Array<{bookId: number, coverPath: string}>) => void;
}

interface BookCoverData {
  book: YouComicAPI.Book;
  pages: string[];
  selectedCover: string;
  loading: boolean;
}

const SelectCoverModal: React.FC<SelectCoverModalProps> = ({
  visible,
  onClose,
  books,
  onOk
}) => {
  const [bookCoverData, setBookCoverData] = useState<BookCoverData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  // 初始化数据
  useEffect(() => {
    if (visible && books.length > 0) {
      initializeCoverData();
    }
  }, [visible, books]);

  const initializeCoverData = async () => {
    setIsLoading(true);
    const initialData: BookCoverData[] = books.map(book => ({
      book,
      pages: [],
      selectedCover: book.cover || '', // 使用当前封面作为默认选择
      loading: true
    }));
    
    setBookCoverData(initialData);
    
    // 为每本书异步加载页面数据
    for (let i = 0; i < books.length; i++) {
      try {
        const pagesResponse = await queryPages({ book: books[i].id, page: 1, pageSize: 10 });
        const pages = pagesResponse.result || [];
        
        setBookCoverData(prevData => 
          prevData.map((item, index) => 
            index === i 
              ? { 
                  ...item, 
                  pages: pages.map(page => page.path),
                  selectedCover: item.selectedCover || (pages[0]?.path || ''), // 如果没有当前封面，使用第一页
                  loading: false 
                }
              : item
          )
        );
      } catch (error) {
        console.error(`加载书籍 ${books[i].id} 的页面失败:`, error);
        setBookCoverData(prevData => 
          prevData.map((item, index) => 
            index === i ? { ...item, loading: false } : item
          )
        );
      }
    }
    
    setIsLoading(false);
  };

  // 选择封面
  const handleCoverSelect = (bookIndex: number, coverPath: string) => {
    setBookCoverData(prevData => 
      prevData.map((item, index) => 
        index === bookIndex 
          ? { ...item, selectedCover: coverPath }
          : item
      )
    );
  };

  // 全选第一页作为封面
  const handleSelectFirstPageAsCovers = () => {
    setBookCoverData(prevData => 
      prevData.map(item => {
        // 如果有页面数据，使用第一页，否则保持当前封面
        const firstPageCover = item.pages.length > 0 ? item.pages[0] : item.selectedCover;
        return {
          ...item,
          selectedCover: firstPageCover
        };
      })
    );
    setSelectAll(true);
    message.success('已将有页面数据的书籍的第一页设为封面喵～');
  };

  // 从完整路径中提取文件名
  const extractFileName = (fullPath: string) => {
    if (!fullPath) return '';
    
    // 先去除URL参数（如 ?t=timestamp）和片段标识符（如 #section）
    let cleanPath = fullPath.split('?')[0].split('#')[0];
    
    // 然后提取文件名
    let fileName = cleanPath.split('/').pop() || cleanPath.split('\\').pop() || cleanPath;
    
    // 在开发环境中记录调试信息
    if (process.env.NODE_ENV === 'development') {
      console.log(`提取文件名: ${fullPath} -> ${fileName}`);
    }
    return fileName;
  };

  // 确认应用
  const handleConfirmApply = () => {
    const coverSelections = bookCoverData
      .filter(item => item.selectedCover && item.selectedCover !== item.book.cover)
      .map(item => ({
        bookId: item.book.id,
        coverPath: extractFileName(item.selectedCover) // 只使用文件名
      }));

    if (coverSelections.length === 0) {
      message.warning('没有检测到封面变更喵～');
      return;
    }

    onOk(coverSelections);
    onClose();
    message.success(`成功为 ${coverSelections.length} 本书更新了封面喵～`);
  };

  // 处理取消
  const handleCancel = () => {
    onClose();
  };

  const renderBookCoverSelection = (item: BookCoverData, index: number) => {
    const hasPages = item.pages.length > 0;
    const isChanged = item.selectedCover !== item.book.cover;

    return (
      <Card 
        key={item.book.id} 
        size="small" 
        className={`${styles.bookCard} ${isChanged ? styles.changed : ''}`}
        title={
          <Space>
            <Avatar icon={<BookOutlined />} />
            <Text strong>{item.book.name || `书籍 ${item.book.id}`}</Text>
            {isChanged && <CheckOutlined style={{color: '#52c41a'}} />}
          </Space>
        }
      >
        {item.loading ? (
          <div className={styles.loadingContainer}>
            <Spin tip="加载页面中..." />
          </div>
        ) : hasPages ? (
          <div className={styles.coverSelection}>
            <div className={styles.currentCover}>
              <Text strong>当前封面:</Text>
              <div className={styles.coverWrapper}>
                <ImageLoader 
                  className={styles.coverImage}
                  url={item.book.cover}
                />
              </div>
            </div>
            
            <Divider type="vertical" />
            
            <div className={styles.newCoverSelection}>
              <Text strong>选择新封面:</Text>
              <div className={styles.coverGrid}>
                {item.pages.slice(0, 6).map((pageUrl, pageIndex) => (
                  <div 
                    key={pageIndex}
                    className={`${styles.coverCard} ${item.selectedCover === pageUrl ? styles.selectedCover : ''}`}
                    onClick={() => handleCoverSelect(index, pageUrl)}
                  >
                    <div className={styles.coverImageWrapper}>
                      <ImageLoader 
                        className={styles.gridCoverImage}
                        url={pageUrl}
                      />
                      {item.selectedCover === pageUrl && (
                        <div className={styles.selectedOverlay}>
                          <CheckOutlined className={styles.checkIcon} />
                        </div>
                      )}
                    </div>
                    <div className={styles.pageLabel}>
                      第{pageIndex + 1}页
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="无法加载页面数据"
            className={styles.emptyPages}
          />
        )}
      </Card>
    );
  };

  const changedCount = bookCoverData.filter(item => item.selectedCover !== item.book.cover).length;

  return (
    <Modal
      title={
        <Space>
          <PictureOutlined />
          选择封面图片
        </Space>
      }
      visible={visible}
      onCancel={handleCancel}
      width="90vw"
      centered
      maskClosable={false}
      className={styles.modal}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button 
          key="selectFirst" 
          onClick={handleSelectFirstPageAsCovers}
          disabled={isLoading}
        >
          全部使用第一页作为封面
        </Button>,
        <Button 
          key="apply" 
          type="primary" 
          onClick={handleConfirmApply}
          disabled={changedCount === 0}
        >
          应用更改 ({changedCount} 项)
        </Button>
      ]}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <Space>
            <Title level={4}>待处理的书籍 ({books.length} 本)</Title>
            <Text type="secondary">已更改: {changedCount} 本</Text>
          </Space>
          <Text type="secondary">
            您可以为每本书选择新的封面图片，系统将显示前6页供您选择 ♥
          </Text>
        </div>

        <div className={styles.booksList}>
          {bookCoverData.map((item, index) => renderBookCoverSelection(item, index))}
        </div>
      </div>
    </Modal>
  );
};

export default SelectCoverModal;
