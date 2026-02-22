import Link from 'next/link';
import { FooterNavMenu } from './FooterNavMenu/FooterNavMenu';
import { Icon, SocialList } from '@/shared/ui';
import { SOCIAL_ITEMS } from '../model/constants';

import styles from './Footer.module.scss';

export const Footer = () => {
  return (
    <footer className={styles['footer']}>
      <div className="container">
        <div className={styles['wrapper']}>
          <div className={styles['content']}>
            <div className={styles['top']}>
              <Link className={styles['logo-link']} href="/">
                <Icon name="logo-footer" width={140} height={50} />
              </Link>
              <div className={styles['line']}></div>
              <SocialList socialLinks={SOCIAL_ITEMS} />
            </div>
            <FooterNavMenu />
          </div>
          <div className={styles['copyright-wrapper']}>
            <span className={styles['copyright']}>
              Copy Right 2013-2025 Zyrix lnc. All Rights Reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
