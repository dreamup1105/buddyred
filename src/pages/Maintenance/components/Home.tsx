import React, { Fragment } from 'react';
import { useModel } from 'umi';
import MenuCard from './MenuCard';
import useMenuCards from '../hooks/useMenuCards';
import Arrow from './Arrow';
import { PageConfig } from '../type';
import type { PageType } from '../type';
import styles from '../index.less';

interface IComponentProps {
  pageType: PageType;
}

// const getHref = (base: string | undefined, cardItem: CardType) => {
//   if (!base) {
//     return '/';
//   }
//   let statusPath = '';
//   if (cardItem.status) {
//     statusPath = `&status=${cardItem.status}`;
//   }
//   return `/${base}?menu=${cardItem.menu}${statusPath}`;
// };

const Home: React.FC<IComponentProps> = ({ pageType }) => {
  const { initialState } = useModel('@@initialState');
  const orgId = initialState?.currentUser?.org.id;
  const { cards } = useMenuCards(orgId!, pageType);
  const pageConfig = PageConfig.get(pageType);

  return (
    <div className={styles.cardsWrapper}>
      {cards &&
        cards.map((cardItems, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className={styles.cardsRowWrapper} key={`row-${index}`}>
            {cardItems.map((cardItem, cardItemIndex) => (
              <Fragment key={cardItem.menu}>
                <MenuCard
                  href={`/${pageConfig?.baseHref}?menu=${cardItem.menu}`}
                  title={cardItem.title}
                  icon={cardItem.icon}
                  enTitle={cardItem.enTitle}
                  bgColor={cardItem.bgColor}
                  key={`${cardItem.menu}-card`}
                  count={cardItem.count}
                />
                {cardItems.length === cardItemIndex + 1 ? null : (
                  <Arrow
                    type={cardItem.arrow === false ? 'transparent' : 'default'}
                    key={`${cardItem.menu}-arrow`}
                  />
                )}
              </Fragment>
            ))}
          </div>
        ))}
    </div>
  );
};

export default Home;
