import { HomeFeatures } from '@/widgets/HomeFeatures';
import { HomeHero } from '@/widgets/HomeHero';
import { HomeTrending } from '@/widgets/HomeTrending';

export const HomePage = () => {
  return (
    <>
      <HomeHero />
      <HomeFeatures />
      <HomeTrending />
    </>
  );
};
