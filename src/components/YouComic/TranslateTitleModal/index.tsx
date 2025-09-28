import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Button, Select, Space, List, Checkbox, Typography, message } from 'antd';
import { translateBookTitles } from '@/services/youcomic/book';

export interface TranslateTitleModalProps {
  visible: boolean;
  onClose: () => void;
  books: YouComicAPI.Book[];
  onApplied?: () => void;
}

const COMMON_LANGS = [
  { label: '中文(简体) zh-CN', value: 'zh-CN' },
  { label: '中文(繁体) zh-TW', value: 'zh-TW' },
  { label: 'English en', value: 'en' },
  { label: '日本語 ja', value: 'ja' },
  { label: '한국어 ko', value: 'ko' },
  { label: 'Français fr', value: 'fr' },
  { label: 'Deutsch de', value: 'de' },
];

interface PreviewItem {
  id: number;
  original: string;
  translated?: string;
  selected: boolean;
}

const TranslateTitleModal: React.FC<TranslateTitleModalProps> = ({ visible, onClose, books, onApplied }) => {
  const [language, setLanguage] = useState<string>('zh-CN');
  const [loading, setLoading] = useState<boolean>(false);
  const [applying, setApplying] = useState<boolean>(false);
  const [preview, setPreview] = useState<PreviewItem[]>([]);

  const bookIds = useMemo(() => books.map(b => b.id), [books]);

  useEffect(() => {
    if (!visible) {
      // reset
      setLanguage('zh-CN');
      setLoading(false);
      setApplying(false);
      setPreview([]);
    }
  }, [visible]);

  const generatePreview = async () => {
    if (bookIds.length === 0) {
      message.warning('请先选择书籍喵～');
      return;
    }
    try {
      setLoading(true);
      const res = await translateBookTitles(bookIds, [language], { dryRun: true });
      const items: PreviewItem[] = res.results.map(r => ({
        id: r.id as number,
        original: books.find(b => b.id === (r.id as number))?.name || `ID ${r.id}`,
        translated: r.data?.[language],
        selected: Boolean(r.data?.[language]),
      }));
      setPreview(items);
      if (items.every(i => !i.translated)) {
        message.info('没有识别到可用的翻译喵～');
      } else {
        message.success('预览已生成喵～');
      }
    } catch (e) {
      console.error(e);
      message.error('生成预览失败喵～');
    } finally {
      setLoading(false);
    }
  };

  const toggleAll = () => {
    const hasUnselected = preview.some(p => p.translated && !p.selected);
    setPreview(prev => prev.map(p => ({ ...p, selected: Boolean(p.translated) && hasUnselected })));
  };

  const selectedCount = preview.filter(p => p.selected && p.translated).length;

  const handleApply = async () => {
    const applyIds = preview.filter(p => p.selected && p.translated).map(p => p.id);
    if (applyIds.length === 0) {
      message.warning('请勾选要应用的翻译喵～');
      return;
    }
    try {
      setApplying(true);
      await translateBookTitles(applyIds, [language], { dryRun: false });
      message.success('翻译已应用喵～');
      onApplied?.();
      onClose();
    } catch (e) {
      console.error(e);
      message.error('应用失败喵～');
    } finally {
      setApplying(false);
    }
  };

  return (
    <Modal
      title="翻译标题"
      open={visible}
      onCancel={onClose}
      width={720}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={loading || applying}>取消</Button>,
        <Button key="apply" type="primary" onClick={handleApply} disabled={selectedCount === 0} loading={applying}>
          应用所选 ({selectedCount})
        </Button>,
      ]}
      maskClosable={false}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <span>目标语言</span>
          <Select
            style={{ minWidth: 220 }}
            options={COMMON_LANGS}
            value={language}
            onChange={setLanguage}
          />
          <Button type="primary" onClick={generatePreview} loading={loading} disabled={books.length === 0}>
            生成预览
          </Button>
          <Button onClick={toggleAll} disabled={preview.length === 0}>全选/取消全选</Button>
        </Space>
        <Typography.Text type="secondary">共 {books.length} 本书</Typography.Text>
        <List
          bordered
          dataSource={preview}
          renderItem={item => (
            <List.Item>
              <Space align="start" style={{ width: '100%', justifyContent: 'space-between' }}>
                <div style={{ maxWidth: '80%' }}>
                  <div><Typography.Text strong>{item.original}</Typography.Text></div>
                  <div>
                    <Typography.Text type={item.translated ? undefined : 'secondary'}>
                      {item.translated || '（无翻译结果）'}
                    </Typography.Text>
                  </div>
                </div>
                <Checkbox
                  disabled={!item.translated}
                  checked={item.selected}
                  onChange={e => setPreview(prev => prev.map(p => p.id === item.id ? { ...p, selected: e.target.checked } : p))}
                />
              </Space>
            </List.Item>
          )}
        />
      </Space>
    </Modal>
  );
};

export default TranslateTitleModal;
