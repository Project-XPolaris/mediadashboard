var urijs = require('urijs');
import {getYouComicConfig} from "@/utils/config";
import {YouComicConfig} from "@/models/appsModel";
interface ImageLoaderPropsType {
  url?: string;
  className: any;
  alt?: string;
}

export default function ImageLoader({ url, className, alt, ...props }: ImageLoaderPropsType) {
  if (!url) {
    return <div className={className} />;
  }
  const youComicConfig:YouComicConfig | null = getYouComicConfig()

  const token = youComicConfig?.token ?? "";
  const link = urijs(url)
    .addQuery('a', token)
    .readable();
  return <img src={youComicConfig?.baseUrl + link} className={className} alt={alt} {...props} />;
}
