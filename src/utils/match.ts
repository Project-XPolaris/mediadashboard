export interface MatchTextInfo {
  series?: string;
  artist?: string;
  title?: string;
  translator?: string;
  theme?: string;
}

export function matchTagInfo(text: string): MatchTextInfo | null {
  let result = text.match(
    /\((.*?)\)\s{0,1}\[(.*? \(.*?\))]\s{0,1}(.*?)\s{0,1}\((.*?)\)\s{0,1}\[(.*?)]/,
  );
  if (result !== null) {
    const info = {
      series: result[1],
      artist: result[2],
      title: result[3],
      translator: result[5],
      theme: result[4],
    };
    return info;
  }

  result = text.match(/^\((.*?)\)\s?\[(.*?)]\s{0,1}(.*?)\s?\[(.*?)]$/);
  if (result !== null) {
    const info = {
      series: result[1],
      artist: result[2],
      title: result[3],
      translator: result[4],
    };
    return info;
  }
  result = text.match(/^\[(.*?)]\s?\[(.*?)]\s{0,1}(.*?)$/);
  if (result !== null) {
    const info = {
      artist: result[2],
      title: result[3],
      translator: result[1],
    };
    return info;
  }
  result = text.match(/^\[(.*?)]\s?\((.*?)\)\s?\[(.*?)]\s?(.*?)\s?\((.*?)\)$/);
  if (result !== null) {
    const info = {
      series: result[2],
      artist: result[3],
      title: result[4],
      translator: result[1],
      theme: result[5],
    };
    return info;
  }
  result = text.match(/^\[(.*?)]\s?\((.*?)\)\s?\[(.*?)]\s?(.*?)\s?$/);
  if (result !== null) {
    const info = {
      series: result[2],
      artist: result[3],
      title: result[4],
      translator: result[1],
    };
    return info;
  }

  result = text.match(/^[[［](.*?)[\]|］]\s?\((.*?)\)\s?\[(.*?)]\s?(.*?)\s?\((.*?)\)$/);
  if (result !== null) {
    const info = {
      series: result[2],
      artist: result[3],
      title: result[4],
      translator: result[1],
      theme: result[5],
    };
    return info;
  }
  result = text.match(/\((.*?)\)\s{0,1}\[(.*?)]\s{0,1}(.*?)\s{0,1}\((.*?)\)/);
  if (result !== null) {
    const info = {
      series: result[1],
      artist: result[2],
      title: result[3],
      theme: result[4],
    };
    return info;
  }

  result = text.match(/\((.*?)\)\s{0,1}\[(.*?)]\s{0,1}(.*?)$/);
  if (result !== null) {
    const info = {
      series: result[1],
      artist: result[2],
      title: result[3],
      theme: result[4],
    };
    return info;
  }
  return null;
}
