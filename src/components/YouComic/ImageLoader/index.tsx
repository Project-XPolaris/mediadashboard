const urijs = require('urijs');
interface ImageLoaderPropsType {
  url?: string;
  className: any;
  alt?: string;
}

export default function ImageLoader({ url, className, alt, ...props }: ImageLoaderPropsType) {
  if (!url) {
    return <div className={className} />;
  }

  const token = localStorage.getItem('token') ?? "";
  const link = urijs(url)
    .addQuery('a', token)
    .readable();
  return <img src={"/api/comic" + link} className={className} alt={alt} {...props} />;
}

// 智能书籍封面加载器 - 优先使用缩略图
interface BookCoverLoaderPropsType {
  book: YouComicAPI.Book;
  className: any;
  alt?: string;
  preferThumbnail?: boolean; // 是否优先使用缩略图，默认true
}

export function BookCoverLoader({ 
  book, 
  className, 
  alt, 
  preferThumbnail = true,
  ...props 
}: BookCoverLoaderPropsType) {
  if (!book?.cover) {
    return <div className={className} />;
  }

  // 智能选择图片URL
  const getImageUrl = () => {
    if (preferThumbnail && book.hasThumbnail && book.coverThumbnail) {
      return book.coverThumbnail;
    }
    return book.cover;
  };

  const token = localStorage.getItem('token') ?? "";
  const link = urijs(getImageUrl())
    .addQuery('a', token)
    .readable();
  
  return <img src={"/api/comic" + link} className={className} alt={alt} {...props} />;
}
