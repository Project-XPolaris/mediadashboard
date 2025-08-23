var urijs = require('urijs');
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
