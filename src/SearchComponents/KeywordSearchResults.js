import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/images/cafe_chuchu_logo.png';
import myPageIcon from '../assets/images/cafe_chuchu_mypage.png';
import shareIcon from '../assets/images/cafe_chuchu_share.png';
import filledHeartIcon from '../assets/images/filled_heart_icon.png';
import emptyHeartIcon from '../assets/images/empty_heart_icon.png';
import starIcon from '../assets/images/cafe_chuchu_star.png';
import './KeywordSearchResults.css';

const KeywordSearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [likedItems, setLikedItems] = useState({});
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const requestData = location.state?.requestData;
  const [visiblePages, setVisiblePages] = useState([1, 2, 3, 4, 5]);

  console.log('받은 데이터:', requestData);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  // 검색 결과 API 호출 
  const fetchSearchResults = async (page = 1) => {
    if (!requestData) {
      setError('요청 데이터가 없습니다.');
      return;
    }

    try {
      const response = await fetch(
        `https://port-0-back-m341pqyi646021b2.sel4.cloudtype.app/cafes/search?category=${encodeURIComponent(
          requestData.categories.join(',')
        )}&limit=10&page=${page}` 
      );

      if (!response.ok) {
        throw new Error('검색 결과를 불러오는 데 실패했습니다.');
      }

      const data = await response.json();
      console.log('API 응답 데이터:', data);

      setSearchResults(data.cafes);
      setTotalPages(data.totalPages);

      const favorites = await fetchFavorites(); 
      const initialLikes = data.cafes.reduce((acc, cafe) => {
        acc[cafe.id] = !!favorites[cafe.id];
        return acc;
      }, {});
      setLikedItems(initialLikes);
    } catch (error) {
      console.error('검색 결과를 불러오는 중 오류 발생:', error);
      setError('검색 결과를 불러오는 중 오류가 발생했습니다.');
    }
  };

  // 찜 목록 가져오기
  const fetchFavorites = async () => {
    const token = getToken();
    if (!token) return {};

    try {
      const response = await fetch('https://port-0-back-m341pqyi646021b2.sel4.cloudtype.app/favorites', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('찜 목록 API 응답 데이터', data);
      if (data.success) {
        return data.favorites.reduce((acc, item) => {
          acc[item.cafe_id] = true;
          return acc;
        }, {});
      } else {
        console.error('찜 목록을 불러오는 데 실패했습니다.');
        return {};
      }
    } catch (error) {
      console.error('찜 목록 가져오기 오류:', error);
      return {};
    }
  };

  // 찜 상태 토글
  const toggleLike = async (cafeId) => {
    const updatedLikedStatus = !likedItems[cafeId];
    setLikedItems((prev) => ({
      ...prev,
      [cafeId]: updatedLikedStatus
    }));

    const token = getToken();
    if (!token) return;

    try {
      await fetch(`https://port-0-back-m341pqyi646021b2.sel4.cloudtype.app/favorites/${cafeId}`, {
        method: updatedLikedStatus ? 'POST' : 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('찜 상태 업데이트 오류:', error);
    }
  };

  // 표시할 페이지 번호를 업데이트하는 함수
  const updateVisiblePages = (page) => {
    const start = Math.floor((page - 1) / 5) * 5 + 1; 
    const end = Math.min(start + 4, totalPages); 
    const newVisiblePages = [];
    for (let i = start; i <= end; i++) {
      newVisiblePages.push(i);
    }
    setVisiblePages(newVisiblePages);
  };

  // 페이지 번호 변경 핸들러
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchSearchResults(page);
    }
  };

  useEffect(() => {
    fetchSearchResults(currentPage); 
  }, [requestData]);

  useEffect(() => {
    updateVisiblePages(currentPage); 
  }, [currentPage]);

  return (
    <div className="search-results-container">
      {/* 상단 로고 및 메뉴 아이콘 */}
      <img src={logo} alt="Cafe ChuChu" className="search-results-logo" onClick={() => navigate('/home')} />
      <img src={myPageIcon} alt="My Page" className="search-results_menu-icon" onClick={() => navigate('/mypage')} />

      {/* 키워드 선택하기 & 챗봇 검색 버튼 */}
      <div className="search-results-buttons">
        <button className="keyword-search-button" onClick={() => navigate('/keyword-search')}>
          키워드 선택하기
        </button>
        <button className="chatbot-search-button" onClick={() => navigate('/chatbot-search')}>
          챗봇에게 물어보기
        </button>
      </div>

      {/* 오류 메시지 */}
      {error && <p className="kresults-error-message">{error}</p>}

      {/* 검색 결과 목록 */}
      <div className="keywordresults-items">
        {searchResults.map((cafe) => (
          <div
            key={cafe.id}
            className="keywordresults-box"
            onClick={(e) => {
              if (!e.target.closest('.keywordresults-icon-heart') && !e.target.closest('.keywordresults-icon-share')) {
                navigate(`/cafe-detail/${cafe.id}`, { state: { cafeId: cafe.id } });
              }
            }}
          >
            <div className="keywordresults-image-container">
              {cafe.image_url && (
                <img src={cafe.image_url} alt={cafe.name} className="keywordresults-cafe-image" />
              )}
            </div>

            <div className="keywordresults-info">
              <div className="keywordresults-info-name">
                <span className={cafe.name.length > 11 ? 'long-text' : ''}>{cafe.name}</span>
              </div>
              <div>
                <img src={starIcon} alt="Star" className="keywordresults-star-icon" />
                <div className="keywordresults-info-rating">{parseFloat(cafe.rating).toFixed(1)}</div>
                <div className="keywordresults-info-review">
                  리뷰 {cafe.reviewCount > 999 ? '999+' : cafe.reviewCount}개
                </div>
              </div>
              <div className="keywordresults-info-location"> {cafe.address}</div>
            </div>

            <div className="keywordresults-icons">
              <img src={shareIcon} alt="Share" className="keywordresults-icon-share" onClick={(e) => e.stopPropagation()} />
            </div>
            <img
              src={likedItems[cafe.id] ? filledHeartIcon : emptyHeartIcon}
              alt="Heart"
              className="keywordresults-icon-heart"
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(cafe.id);
              }}
            />
          </div>
        ))}
      </div>

      {/* 페이지네이션 UI */}
      {searchResults.length > 0 && (
        <div className="pagination-container">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            &lt;
          </button>
          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`pagination-button ${page === currentPage ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default KeywordSearchResults;
