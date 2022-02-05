import React, { useEffect, useState } from 'react';
import HomeNavigation from '../components/HomeNavigation';
import axios from 'axios';

const UpdatesAndAnnouncements = () => {
  const [news, setNews] = useState([]);
  const [comments, setComments] = useState({});
  const [isGettingNews, setIsGettingNews] = useState(true);
  const styles = {
    newsDescriptionStyle: {
      wordBreak: 'break-all'
    },
    bold: {
      fontWeight: 'bold'
    },
    normalFontWeight: {
      fontWeight: 'normal'
    }
  };
  const like = (newsID, e, didCurrentUserLike) => {
    e.preventDefault();

    if (didCurrentUserLike) {
      const likeJSON = {
        userid: sessionStorage.getItem('userid'),
        news_id: newsID
      };
      axios
        .delete('/.netlify/functions/likes', { data: likeJSON })
        .then((res) => {
          if (res.data.success) {
            e.target.style.fontWeight = 'normal';

            const updatedNews = news.map((value) => {
              if (newsID === value.news_id) {
                value.didCurrentUserLike = false;
                value.likeCount -= 1;
              }

              return value;
            });
            setNews(updatedNews);
          }
        });
    } else {
      const likeJSON = {
        userid: sessionStorage.getItem('userid'),
        news_id: newsID
      };
      axios.post('/.netlify/functions/likes', likeJSON).then((res) => {
        if (res.data.success) {
          e.target.style.fontWeight = 1000;

          const updatedNews = news.map((value) => {
            if (newsID === value.news_id) {
              value.didCurrentUserLike = true;
              value.likeCount += 1;
            }

            return value;
          });
          setNews(updatedNews);
        }
      });
    }
  };

  useEffect(() => {
    setIsGettingNews(true);
    axios.get('/.netlify/functions/news').then((res) => {
      let news = res.data.data;

      news = news.map((value) => {
        return {
          ...{
            didCurrentUserLike: Boolean(checkIfUserLikedNews(value.likesData)),
            likeCount: value.likesData.length
          },
          ...value
        };
      });

      setNews(news);
      setIsGettingNews(false);
    });

    return () => {};
  }, [setNews]);

  const checkIfUserLikedNews = (likesData) => {
    return likesData.find(
      (likeData) =>
        likeData.userid === parseInt(sessionStorage.getItem('userid'))
    );
  };

  const addComment = async (e, newsID) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (comments[newsID].trim() === '') return;

      const commentJSON = {
        userid: sessionStorage.getItem('userid'),
        news_id: newsID,
        comment: comments[newsID].trim()
      };
      const commentSuccess = await axios.post(
        '/.netlify/functions/comments',
        commentJSON
      );

      if (commentSuccess.data.success) {
        const newComments = await axios.get('/.netlify/functions/comments', {
          params: {
            newsID: newsID
          }
        });
        const newNewsData = news.map((value) => {
          if (value.news_id === newsID) {
            value.commentsData = newComments.data.data;
          }

          return value;
        });

        comments[newsID] = '';

        setNews(newNewsData);
        setComments(comments);
      }
    }
  };

  return (
    <>
      <HomeNavigation />
      <div className="container-fluid">
        <div className="row">
          <div className="col s12">
            <h5>Updates and Announcements</h5>
          </div>
        </div>
        {isGettingNews && (
          <div className="col s12">
            <div className="center-loader-container">
              <div className="preloader-wrapper big active">
                <div className="spinner-layer spinner-blue-only">
                  <div className="circle-clipper left">
                    <div className="circle"></div>
                  </div>
                  <div className="gap-patch">
                    <div className="circle"></div>
                  </div>
                  <div className="circle-clipper right">
                    <div className="circle"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {!isGettingNews &&
          news.map((_news) => {
            return (
              <div className="row" key={_news.news_id}>
                <div className="col s12">
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
                      <span>Likes: {_news.likeCount}</span>
                      <br></br>
                      <span>Comments: {_news.commentsData.length}</span>
                    </div>
                    <div className="card-action">
                      {/* eslint-disable-next-line */}
                      <a
                        href="#"
                        onClick={(e) => {
                          like(_news.news_id, e, _news.didCurrentUserLike);
                        }}
                        className="black-text"
                        style={
                          checkIfUserLikedNews(_news.likesData)
                            ? styles.bold
                            : styles.normalFontWeight
                        }
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
                            </li>
                          );
                        })}
                        <li className="collection-item avatar grey lighten-4">
                          <div className="row" style={{ marginBottom: 0 }}>
                            <div className="input-field col s12">
                              <textarea
                                id="newsComment"
                                className="materialize-textarea"
                                onKeyDown={(e) => {
                                  addComment(e, _news.news_id);
                                }}
                                onChange={(e) => {
                                  setComments({
                                    ...comments,
                                    ...{
                                      [_news.news_id]: e.target.value
                                    }
                                  });
                                }}
                                value={comments[_news.news_id]}
                              ></textarea>
                              <label htmlFor="newsComment">
                                Press enter to add comment
                              </label>
                            </div>
                          </div>
                        </li>
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
