export interface Book {
  cover: {
    large: string;
    small: string;
  };
  title: string;
  author: string;
  releaseDate: string;
  pages: number;
  link: string;
}
