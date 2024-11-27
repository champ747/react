import React, { useState, useEffect } from 'react';
import profileImage from '../assets/images/cafe_chuchu_profile.png';
import starIcon from '../assets/images/cafe_chuchu_star.png';
import emptyStar from "../assets/images/cafe_chuchu_empty_star.png";
import halfStar from "../assets/images/cafe_chuchu_half_star.png";
import './CafeDetailReviews.css';

const CafeDetailReviews = ({ cafeId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [error, setError] = useState('');

  const getToken = () => {
    const token = localStorage.getItem('token');
    return token;
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `https://port-0-back-m341pqyi646021b2.sel4.cloudtype.app/reviews/${cafeId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching reviews: ${response.statusText}`);
      }

      const data = await response.json();
      setReviews(data.reviews);
      console.log("Fetched reviews:", data.reviews);
    } catch (err) {
      console.error("Error fetching reviews:", err.message);
      setError("리뷰를 불러오는 중 문제가 발생했습니다.");
    }
  };

  const handleCreateReview = async () => {
    if (newReview.length < 5 || newRating === 0) {
      setError('리뷰 내용과 별점을 모두 입력해주세요.');
      return;
    }
  
    const token = getToken();
    if (!token) return;
  
    try {
      const body = JSON.stringify({ content: newReview, rating: newRating });
      console.log("Request Body:", body); // 요청 본문 확인
  
      const response = await fetch(
        `https://port-0-back-m341pqyi646021b2.sel4.cloudtype.app/reviews/${cafeId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: body,
        }
      );
  
      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("Error Response:", errorResponse); // 서버 오류 응답 확인
        throw new Error('리뷰 작성에 실패했습니다.');
      }
  
      await fetchReviews();
      setNewReview('');
      setNewRating(0);
      setError('');
    } catch (err) {
      console.error("Error creating review:", err.message);
      setError('리뷰 작성 중 문제가 발생했습니다.');
    }
  };  

  const handleRatingSelect = (rating) => {
    setNewRating(rating);
  };

  useEffect(() => {
    fetchReviews();
  }, [cafeId]);

  return (
    <div className="reviews-container">
      <span className="review-title">리뷰 작성하기</span>
      <textarea
        className="input-review"
        placeholder="리뷰 내용을 입력하세요"
        value={newReview}
        onChange={(e) => setNewReview(e.target.value)}
      />

      <div className="star-rating-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className="star-wrapper"
            onClick={(e) => {
              const rect = e.target.getBoundingClientRect();
              const clickPosition = e.clientX - rect.left;
              const isHalf = clickPosition < rect.width / 2;
              handleRatingSelect(isHalf ? star - 0.5 : star);
            }}
          >
            {newRating >= star - 0.5 && newRating < star ? (
              <img src={halfStar} alt="Half Star" className="star" />
            ) : null}
            {newRating >= star ? (
              <img src={starIcon} alt="Full Star" className="star" />
            ) : null}
            {newRating < star - 0.5 ? (
              <img src={emptyStar} alt="Empty Star" className="star" />
            ) : null}
          </div>
        ))}
      </div>

      <button
        className={`create-button ${newReview.length >= 5 && newRating > 0 ? '' : 'disabled'}`}
        onClick={handleCreateReview}
        disabled={newReview.length < 5 || newRating === 0}
      >
        작성
      </button>

      {/* 리뷰 목록 */}
      {reviews.map((review) => (
        <div key={review._id} className="review-item">
          
          <div className="review-header">
            <img src={profileImage} alt="프로필" className="profile-image" />
            <span className="review-username">{review.writer}</span>
              <img className='rating-star-icon' src={starIcon} alt="별점" />
              <span className="review-rating">{review.rating}</span>
          </div>
          
          <div className='review-content'>{review.content}</div>
        </div>
      ))}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default CafeDetailReviews;