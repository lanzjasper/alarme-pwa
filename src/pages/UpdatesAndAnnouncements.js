import React, { useEffect, useState } from 'react';
import HomeNavigation from '../components/HomeNavigation';
import axios from 'axios';

const UpdatesAndAnnouncements = () => {
  const [news, setNews] = useState([]);
  const styles = {
    newsDescriptionStyle: {
      wordBreak: 'break-all'
    }
  };
  const like = (newsID, e) => {
    const likeJSON = {
      userid: sessionStorage.getItem('userid'),
      news_id: newsID
    };
    axios.post('/.netlify/functions/likes', likeJSON).then((res) => {
      if (res.data.success) {
        e.target.style.fontWeight = 1000;
      }
    });
  };

  useEffect(() => {
    axios.get('/.netlify/functions/news').then((res) => {
      setNews(res.data.data);
    });

    return () => {};
  }, [setNews]);

  return (
    <>
      <HomeNavigation />
      <div className="container-fluid">
        {news.map((_news) => {
          return (
            <div className="row" key={_news.news_id}>
              <div className="col s12 m6">
                <div className="card grey lighten-4">
                  <div className="card-content black-text">
                    <div className="row valign-wrapper">
                      <div className="col s2">
                        <img
                          src={`https://i.pravatar.cc/150?u=${_news.admin_id}`}
                          alt=""
                          className="circle responsive-img"
                        />
                      </div>
                      <div className="col s10">
                        <span className="black-text">
                          {`${_news.admin_fname} ${_news.admin_mname} ${_news.admin_lname}`}
                        </span>
                        <br></br>
                        <span>{_news.news_create}</span>
                      </div>
                    </div>
                    <span className="card-title">{_news.news_title}</span>
                    <p
                      style={styles.newsDescriptionStyle}
                      className="color-grey"
                    >
                      {_news.news_description}
                    </p>
                    <br></br>
                    <span>Likes: {_news.likesData.length}</span>
                    <br></br>
                    <span>Comments: {_news.commentsData.length}</span>
                  </div>
                  <div className="card-action">
                    {/* eslint-disable-next-line */}
                    <a
                      href="#"
                      onClick={(e) => {
                        like(_news.news_id, e);
                      }}
                      className="black-text"
                    >
                      Like
                    </a>
                    {/* eslint-disable-next-line */}
                    <a href="#" className="black-text">
                      Share
                    </a>
                    <ul className="collection" style={{ marginTop: 20 }}>
                      {_news.commentsData.map((comment) => {
                        return (
                          <li
                            className="collection-item avatar grey lighten-4"
                            key={comment.comment_id}
                          >
                            <img
                              src={`https://i.pravatar.cc/150?u=admin${comment.userid}`}
                              alt=""
                              className="circle"
                            />
                            <p>
                              {`${comment.user_fname} ${comment.user_mname} ${comment.user_lname}`}{' '}
                              <br />
                              {comment.comment}
                              <br />
                              {comment.date_commented}
                            </p>
                            <a href="#!" className="secondary-content">
                              <i className="material-icons">grade</i>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default UpdatesAndAnnouncements;
