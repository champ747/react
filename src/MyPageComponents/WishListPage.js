import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/cafe_chuchu_logo.png';
import myPageIcon from '../assets/images/cafe_chuchu_mypage.png';
import shareIcon from '../assets/images/cafe_chuchu_share.png';
import filledHeartIcon from '../assets/images/filled_heart_icon.png';
import emptyHeartIcon from '../assets/images/empty_heart_icon.png';
import starIcon from '../assets/images/cafe_chuchu_star.png';
import './WishListPage.css';

const WishListPage = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [likedItems, setLikedItems] = useState({});
  const [error, setError] = useState('');

  // 토큰 가져오기 함수
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // 찜한 카페 목록 불러오기
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

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
          setWishlist(data.favorites || []);
          console.log("API 응답 데이터:", data)

          // 초기 찜 상태 설정
          const initialLikes = (data.favorites || []).reduce((acc, cafe) => {
            acc[cafe.cafe_id] = true;
            return acc;
          }, {});
          setLikedItems(initialLikes);
        } else {
          const errorData = await response.json();
          setError(errorData.message || '찜 목록을 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('찜 목록을 불러오는 중 오류 발생:', error);
        setError('서버 오류가 발생했습니다.');
      }
    };

    fetchWishlist();
  }, [navigate]);

  // 찜 상태 토글 함수
  const toggleLike = async (cafeId) => {
    const updatedLikedStatus = !likedItems[cafeId];
    setLikedItems((prev) => ({
      ...prev,
      [cafeId]: updatedLikedStatus,
    }));

    const token = getToken();
    if (!token) return;

    try {
      await fetch(`https://port-0-back-m341pqyi646021b2.sel4.cloudtype.app/favorites/${cafeId}`, {
        method: updatedLikedStatus ? 'POST' : 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // 찜 해제 시 UI에서 해당 카페 제거
      if (!updatedLikedStatus) {
        setWishlist((prev) => prev.filter((cafe) => cafe.cafe_id !== cafeId));
      }
    } catch (error) {
      console.error('찜 상태 업데이트 오류:', error);
    }
  };

  const goToHome = () => {
    navigate('/home');
  };

  const goToMyPage = () => {
    navigate('/mypage');
  };

  return (
    <div className="wishlist-container">
      <img src={logo} alt="Cafe ChuChu" className="wishlist-logo" onClick={goToHome} />
      <img src={myPageIcon} alt="My Page" className="wishlist_menu-icon" onClick={goToMyPage} />

      <span className="wishlist-count"> 찜한 카페 {wishlist.length}개 </span>

      {error && <p className="error-message">{error}</p>}

      <div className="wishlist-items">
        {wishlist.map((cafe) => (
          <div
            key={cafe.cafe_id}
            className="wishlist-box"
            onClick={(e) => {
              if (!e.target.closest('.wishlist-icon-heart') && !e.target.closest('.wishlist-icon-share')) {
                navigate(`/cafe-detail/${cafe.cafe_id}`, { state: { cafeId: cafe.cafe_id } });
              }
            }}
          >
            <div className="wishlist-image-container">
              {cafe.image_url && (
                <img
                  src={cafe.image_url}
                  alt={cafe.name}
                  className="wishlist-cafe-image"
                />
              )}
            </div>

            <div className="wishlist-info">
              <div className="wishlist-info-name">
                <span className={cafe.name.length > 12 ? 'long-text' : ''}>{cafe.name}</span>
              </div>
              <div>
                <img src={starIcon} alt="Star" className="wishlist-star-icon" />
                <div className="wishlist-info-rating">{parseFloat(cafe.rating).toFixed(1)}</div>
                <div className="wishlist-info-review"> 리뷰 {cafe.reviewCount > 999 ? '999+' : cafe.reviewCount}개 </div>
              </div>
              <div className="wishlist-info-location"> {cafe.address}</div>
            </div>

            <div className="wishlist-icons">
              <img src={shareIcon} alt="Share" className="wishlist-icon-share" onClick={(e) => e.stopPropagation()} />
            </div>
            <img
              src={likedItems[cafe.cafe_id] ? filledHeartIcon : emptyHeartIcon}
              alt="Heart"
              className="wishlist-icon-heart"
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(cafe.cafe_id);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishListPage;
