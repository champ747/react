import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ChatbotSearchPage.css';
import starIcon from '../assets/images/cafe_chuchu_star.png';
import searchIcon from '../assets/images/cafe_chuchu_search.png';
import filledHeartIcon from '../assets/images/filled_heart_icon.png';
import emptyHeartIcon from '../assets/images/empty_heart_icon.png';
import shareIcon from '../assets/images/cafe_chuchu_share.png';

const ChatbotSearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [cafeList, setCafeList] = useState([]);
  const [replyCount, setReplyCount] = useState(0);
  const [likedItems, setLikedItems] = useState({});
  const [initialMessage, setInitialMessage] = useState(location.state?.initialMessage || '');

  // 홈화면에서 넘어온 텍스트 받기
  useEffect(() => {
    if (initialMessage) {
      setMessages([{ text: initialMessage, isUser: true }]);
      const userInputData = { user_input: initialMessage };
      setInitialMessage('');

      setTimeout(async () => {
        await fetchCafeRecommendations(userInputData);
      }, 500);
    }
  }, [initialMessage]);

  // 사용자 찜 목록 가져오기
  const fetchFavorites = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('https://port-0-back-m341pqyi646021b2.sel4.cloudtype.app/favorites', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const favoritesMap = data.favorites.reduce((acc, item) => {
          acc[item.cafe_id] = true;
          return acc;
        }, {});
        setLikedItems(favoritesMap);
      }
    } catch (error) {
      console.error('찜 목록 가져오기 오류:', error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // 찜 상태 토글
  const toggleLike = async (cafeId) => {
    const updatedLikedStatus = !likedItems[cafeId];
    setLikedItems((prev) => ({
      ...prev,
      [cafeId]: updatedLikedStatus,
    }));

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await fetch(`https://port-0-back-m341pqyi646021b2.sel4.cloudtype.app/favorites/${cafeId}`, {
        method: updatedLikedStatus ? 'POST' : 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('찜 상태 업데이트 오류:', error);
    }
  };

  const handleBack = () => {
    navigate('/home');
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const newMessages = [{ text: inputText, isUser: true }];
      setMessages(newMessages);
      setInputText('');

      const userInputData = { user_input: inputText };

      setTimeout(async () => {
        await fetchCafeRecommendations(userInputData);
        setReplyCount(replyCount + 1);
      }, 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const fetchCafeRecommendations = async (userInputData) => {
    try {
      const response = await fetch('https://port-0-flask-m39ixlhha27ce70c.sel4.cloudtype.app/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInputData),
      });

      if (response.ok) {
        const data = await response.json();
        const cafeList = Array.isArray(data) ? data : data.recommendations || [];
        setCafeList(cafeList.slice(0, 5));

        setMessages((prevMessages) => [
          ...prevMessages,
          { text: '아래 카페를 추천드려요!', isUser: false, isCafeList: true },
        ]);
      } else {
        console.error('서버 오류:', response.status);
      }
    } catch (error) {
      console.error('카페 추천을 불러오는 중 오류 발생:', error);
    }
  };

  const goToSearchResults = () => {
    navigate('/chatbot-search-results', { state: { cafeList } });
  };

  return (
    <div className="chatbot-container">
      <span className="back-button" onClick={handleBack}>&lt;</span>
      <p className="chatbot-instruction">어떤 카페를 찾고 싶은지 알려주세요!</p>

      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chatbot-message-bubble ${message.isUser ? 'user-message' : 'reply-message'}`}>
            {message.text}
            {message.isCafeList && (
              <>
                <div className="chatbotlist-items">
                  {cafeList.map((cafe) => (
                    <div
                      key={cafe.id}
                      className="chatbotlist-box"
                      onClick={(e) => {
                        if (!e.target.closest('.chatbotlist-icon-heart')) {
                          navigate(`/cafe-detail/${cafe.id}`, { state: { cafeId: cafe.id } });
                        }
                      }}
                    >
                      <div className="chatbotlist-image-container">
                        {cafe.image && <img src={cafe.image} alt={cafe.name} className="chatbotlist-cafe-image" />}
                      </div>

                      <div className="chatbotlist-info">
                        <div className="chatbotlist-info-name">
                          <span className={cafe.name.length > 12 ? 'long-text' : ''}>{cafe.name}</span>
                        </div>
                        <div>
                          <img src={starIcon} alt="Star" className="chatbotlist-star-icon" />
                          <div className="chatbotlist-info-rating">{cafe.rating}</div>
                          <div className="chatbotlist-info-review">리뷰 {cafe.reviews > 999 ? '999+' : cafe.reviews}개</div>
                        </div>
                        <div className="chatbotlist-info-location">{cafe.location}</div>
                      </div>

                      <img
                        src={likedItems[cafe.id] ? filledHeartIcon : emptyHeartIcon}
                        alt="Heart"
                        className="chatbotlist-icon-heart"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(cafe.id);
                        }}
                      />
                    </div>
                  ))}
                </div>
                {/*<div className="chatbot-next-icon" onClick={goToSearchResults}>더보기 &gt;</div>*/}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="chatbot-input-container">
        <input
          type="text"
          className="chatbot-input"
          value={inputText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요"
        />
        <img src={searchIcon} alt="Send" className="chatbot-send-icon" onClick={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatbotSearchPage;
