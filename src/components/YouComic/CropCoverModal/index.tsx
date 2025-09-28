import React, { useState, useRef, useCallback } from 'react';
import {
  Modal,
  Button,
  Space,
  Typography,
  message,
  Row,
  Col,
  Card,
  Spin
} from 'antd';
import { ScissorOutlined, SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import styles from './style.less';

const { Title, Text } = Typography;

export interface CropCoverModalProps {
  visible: boolean;
  onClose: () => void;
  book: YouComicAPI.Book | null;
  onOk: (croppedImageData: { bookId: number; imageBlob: Blob; fileName: string }) => void;
}

// 使用16:9的宽高比作为默认推荐比例
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 50,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

const CropCoverModal: React.FC<CropCoverModalProps> = ({
  visible,
  onClose,
  book,
  onOk
}) => {

  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [isLoading, setIsLoading] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [aspect, setAspect] = useState<number | undefined>(16 / 9)
  const [imgSrc, setImgSrc] = useState('')

  const imgRef = useRef<HTMLImageElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  // 构建带认证的图片URL  
  React.useEffect(() => {
    if (book?.cover && visible) {
      const token = localStorage.getItem('token');
      // 使用与ImageLoader完全相同的URL构建方式
      const urijs = require('urijs');
      const link = urijs(book.cover).addQuery('a', token).addQuery('t', Date.now()).readable();
      const coverUrl = "/api/comic" + link;
      console.log('CropCoverModal: book.cover =', book.cover);
      console.log('CropCoverModal: 构建的URL =', coverUrl); // Debug log
      setImgSrc(coverUrl);
      setImageLoaded(false);
    }
  }, [book?.cover, visible]);

  // 更新预览当裁剪区域变化时
  React.useEffect(() => {
    if (
      completedCrop &&
      imgRef.current &&
      previewCanvasRef.current &&
      completedCrop.width &&
      completedCrop.height &&
      imageLoaded
    ) {
      canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop,
        scale,
        rotate,
      )
    }
  }, [completedCrop, scale, rotate, imageLoaded]);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget as HTMLImageElement;
    console.log('CropCoverModal: 图片加载完成', { width, height }); // Debug log
    setImageLoaded(true);
    const newCrop = centerAspectCrop(width, height, aspect || 1);
    setCrop(newCrop);
    
    // 立即设置 completedCrop 以启用保存按钮
    if (newCrop) {
      const pixelCrop: PixelCrop = {
        unit: 'px',
        x: (newCrop.x / 100) * width,
        y: (newCrop.y / 100) * height,
        width: (newCrop.width / 100) * width,
        height: (newCrop.height / 100) * height,
      };
      console.log('CropCoverModal: 设置初始completedCrop', pixelCrop); // Debug log
      setCompletedCrop(pixelCrop);
    }
  }, [aspect])

  const onCropComplete = useCallback(
    (crop: PixelCrop) => {
      console.log('CropCoverModal: 裁剪完成', crop); // Debug log
      setCompletedCrop(crop)
      if (imgRef.current && previewCanvasRef.current && crop.width && crop.height) {
        console.log('CropCoverModal: 准备更新预览'); // Debug log
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          crop,
          scale,
          rotate,
        )
      }
    },
    [scale, rotate],
  )

  const canvasPreview = async (
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    crop: PixelCrop,
    scale = 1,
    rotate = 0,
  ) => {
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('No 2d context')
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = Math.floor(crop.width * scaleX)
    canvas.height = Math.floor(crop.height * scaleY)

    ctx.imageSmoothingQuality = 'high'

    const cropX = crop.x * scaleX
    const cropY = crop.y * scaleY

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 直接绘制裁剪区域
    ctx.drawImage(
      image,
      cropX,
      cropY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    )
  }

  const handleSave = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current || !book) {
      message.error('请先选择裁剪区域喵～');
      return;
    }

    setIsLoading(true);
    try {
      // 创建一个用于生成最终图片的canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('无法获取canvas context');
      }

      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;

      ctx.imageSmoothingQuality = 'high';
      
      // 绘制裁剪后的图片
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      // 转换为Blob
      canvas.toBlob((blob) => {
        if (blob) {
          // 生成新的文件名 - 正确提取扩展名，去掉URL参数
          let originalExt = 'jpg';
          if (book.cover) {
            // 去掉URL参数，只保留文件路径部分
            const cleanPath = book.cover.split('?')[0];
            const ext = cleanPath.split('.').pop();
            if (ext) {
              originalExt = ext.toLowerCase();
            }
          }
          
          const timestamp = Date.now();
          // 清理书籍名称，去掉可能的特殊字符
          const cleanBookName = book.name?.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_') || 'book';
          const fileName = `${cleanBookName}_cropped_${timestamp}.${originalExt}`;
          
          console.log('CropCoverModal: 生成文件名:', fileName); // Debug log

          onOk({
            bookId: book.id,
            imageBlob: blob,
            fileName: fileName
          });
        } else {
          message.error('裁剪失败，请重试喵～');
        }
        setIsLoading(false);
      }, 'image/jpeg', 0.95);

    } catch (error) {
      console.error('裁剪保存失败:', error);
      message.error('裁剪保存失败，请重试喵～');
      setIsLoading(false);
    }
  }, [completedCrop, book, onOk]);

  const handleReset = useCallback(() => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const newCrop = centerAspectCrop(width, height, aspect || 1);
      setCrop(newCrop);
      
      // 重新设置 completedCrop
      const pixelCrop: PixelCrop = {
        unit: 'px',
        x: (newCrop.x / 100) * width,
        y: (newCrop.y / 100) * height,
        width: (newCrop.width / 100) * width,
        height: (newCrop.height / 100) * height,
      };
      setCompletedCrop(pixelCrop);
    }
    setScale(1);
    setRotate(0);
  }, [aspect]);

  const toggleAspect = useCallback(() => {
    if (aspect) {
      setAspect(undefined);
    } else {
      setAspect(16 / 9);
      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, 16 / 9);
        setCrop(newCrop);
        
        // 重新设置 completedCrop
        const pixelCrop: PixelCrop = {
          unit: 'px',
          x: (newCrop.x / 100) * width,
          y: (newCrop.y / 100) * height,
          width: (newCrop.width / 100) * width,
          height: (newCrop.height / 100) * height,
        };
        setCompletedCrop(pixelCrop);
      }
    }
  }, [aspect]);

  if (!book) {
    return null;
  }

  return (
    <Modal
      title={
        <Space>
          <ScissorOutlined />
          <span>裁剪封面 - {book.name}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            重置
          </Button>
          <Button onClick={toggleAspect}>
            {aspect ? '自由裁剪' : '16:9比例'}
          </Button>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSave}
            loading={isLoading}
          >
            保存裁剪
          </Button>
        </Space>
      }
      destroyOnClose
    >
      <div className={styles.cropContainer}>
        <Row gutter={16}>
          <Col span={16}>
            <Card title="原图裁剪" size="small">
              <div className={styles.cropWrapper}>
                {imgSrc ? (
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                    className={styles.reactCrop}
                  >
                    <img
                      ref={imgRef}
                      src={imgSrc}
                      style={{
                        transform: `scale(${scale}) rotate(${rotate}deg)`,
                        maxWidth: '100%',
                        maxHeight: '60vh'
                      }}
                      onLoad={onImageLoad}
                      alt="封面"
                      crossOrigin="anonymous"
                    />
                  </ReactCrop>
                ) : (
                  <div style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin size="large" />
                  </div>
                )}
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="预览效果" size="small">
              <div className={styles.previewWrapper}>
                {Boolean(completedCrop?.width && completedCrop?.height) && (
                  <canvas
                    ref={previewCanvasRef}
                    className={styles.previewCanvas}
                  />
                )}
                {!completedCrop && (
                  <div className={styles.previewPlaceholder}>
                    <Text type="secondary">选择裁剪区域后显示预览</Text>
                  </div>
                )}
              </div>
              <div className={styles.cropInfo}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {completedCrop ? 
                    `尺寸: ${Math.round(completedCrop.width)}×${Math.round(completedCrop.height)}` : 
                    '未选择裁剪区域'
                  }
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default CropCoverModal;
