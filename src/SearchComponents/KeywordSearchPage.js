import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './KeywordSearchPage.css';

const KeywordSearchPage = () => {
  const navigate = useNavigate();
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [error, setError] = useState('');

  const handleBack = () => {
    navigate('/home');
  };

  const toggleKeyword = (keyword) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword) ? prev.filter((item) => item !== keyword) : [...prev, keyword]
    );
  };

  const isSelected = (keyword) => selectedKeywords.includes(keyword);

  const handleRecommendClick = () => {
    // 키워드를 선택하지 않았을 경우, 메시지 표시
    if (selectedKeywords.length === 0) {
      setError('키워드를 하나 이상 선택하세요.');
      return;
    }

    // 선택된 키워드 데이터를 형식에 맞게 변환
    const requestData = {
      categories: selectedKeywords,
    };

    // 검색 결과 페이지로 데이터 전달
    navigate('/keyword-search-results', { state: { requestData } });
    console.log('전송 데이터:', requestData);
  };

  return (
    <div className="keyword-search-container">
      <span className="back-button" onClick={handleBack}>&lt;</span>
      <p className="keword-instruction">찾고 싶은 카페의 키워드를 선택해주세요!</p>

      <div className="keyword-section2">
        <h3 className="keyword-type2">카페 분위기 키워드</h3>
        <div className="keyword-group">
          {['경치가 좋은', '넓은', '사람 많은', '인테리어 예쁜', '사진찍기 좋은', '조용한'].map((keyword, index) => (
            <span
              key={index}
              className={`keyword ${isSelected(keyword) ? 'selected' : ''}`}
              onClick={() => toggleKeyword(keyword)}
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {error && <p className="keyword-error-message">{error}</p>}
      <button className="keyword-recommend-button" onClick={handleRecommendClick}>
        카페 추천 받기
      </button>
    </div>
  );
};

export default KeywordSearchPage;
