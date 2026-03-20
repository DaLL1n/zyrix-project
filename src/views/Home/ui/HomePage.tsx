import { Hero } from './sections/Hero/Hero';
import { Features } from './sections/Features/Features';
import { Trending } from './sections/Trending/Trending';
import { Faq } from './sections/Faq/Faq';

export const HomePage = () => {
  return (
    <>
      <Hero />
      <Features />
      <Trending />
      <Faq />
    </>
  );
};
