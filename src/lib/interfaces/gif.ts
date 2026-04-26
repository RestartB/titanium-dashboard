export type GifFile = {
  url: string;
  width: number;
  height: number;
  size: number;
};

export type GifFormats = {
  gif: GifFile;
  webp: GifFile;
  jpg: GifFile;
  mp4: GifFile;
  webm: GifFile;
};

export type GifData = {
  id: number;
  slug: string;
  title: string;
  file: {
    hd: GifFormats;
    md: GifFormats;
    sm: GifFormats;
    xs: GifFormats;
  };
  tags: string[];
  type: string;
  blur_preview: string;
};

export type GifResults = {
  result: boolean;
  data: {
    data: GifData[];
    current_page: number;
    per_page: number;
    has_next: boolean;
  };
};

export type GifCategoriesResult = {
  result: boolean;
  data: {
    locale: string;
    categories: {
      category: string;
      query: string;
      preview_url: string;
    }[];
  };
};
