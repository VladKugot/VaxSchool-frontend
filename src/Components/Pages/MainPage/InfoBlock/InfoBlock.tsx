import classNames from "classnames";
import './InfoBlock.scss';
import { useEffect, useState } from 'react';
import { API_URL } from "../../../../utils/config";

interface NewsItem {
  id: number;
  title: string;
  description: string;
}

interface Props {
  title: string;
  start: boolean;
}

export const InfoBlock: React.FC<Props> = ({ title, start }) => {
  const [newsArray, setNewsArray] = useState<NewsItem[]>([]);
  const [isActiveId, setIsActiveId] = useState<number | null>(1);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const encodedTitle = encodeURIComponent(title);
        const response = await fetch(`${API_URL}api/news/sort?type=${encodedTitle}`);
        const data = await response.json();
        setNewsArray(data);
      } catch (error) {
        console.error('Помилка при завантаженні новин:', error);
      }
    };

    fetchNews();
  }, [title]);

  const handleImageClick = (id: number) => {
    setIsActiveId(prev => (prev === id ? null : id));
  };

  return (
    <div className={classNames('information__conteiner', { 'information__conteiner--reserved': start })}>
      <div className={classNames('information', { 'information--reserved': start })}>
        <h2 className="information__title">{title}</h2>

        <ul className="information__list">
          {newsArray.map((newsItem) => (
            <li className="information__line" key={newsItem.id}>
              <h3
                className="information__line--title"
                onClick={() => handleImageClick(newsItem.id)}
              >
                {newsItem.title}
              </h3>
              <div
                className={classNames('information__img', {
                  'information__img--active': isActiveId === newsItem.id,
                })}
                onClick={() => handleImageClick(newsItem.id)}
              />
            </li>
          ))}
        </ul>
      </div>

      {isActiveId !== null ? (
        <div className="information__active">
          {newsArray.map(
            (newsItem) =>
              isActiveId === newsItem.id && (
                <p className="information__text" key={newsItem.id}>
                  {newsItem.description}
                </p>
              )
          )}
        </div>
      ) : (
        <div className="information__active information__active--no"></div>
      )}
    </div>
  );
};
