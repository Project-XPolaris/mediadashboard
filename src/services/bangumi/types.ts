export declare namespace BangumiAPI {
  export interface Count {
    10: number;
    9: number;
    8: number;
    7: number;
    6: number;
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  }

  export interface Rating {
    total: number;
    count: Count;
    score: number;
  }

  export interface Images {
    large: string;
    common: string;
    medium: string;
    small: string;
    grid: string;
  }

  export interface Collection {
    wish: number;
    collect: number;
    doing: number;
    on_hold: number;
    dropped: number;
  }

  export interface Subject {
    id: number;
    url: string;
    type: number;
    name: string;
    name_cn: string;
    summary: string;
    eps: number;
    eps_count: number;
    air_date: string;
    air_weekday: number;
    rating: Rating;
    rank: number;
    images: Images;
    collection: Collection;
  }

  export interface SearchSubjectResult {
    results: number;
    list: Subject[];
  }

}
