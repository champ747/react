import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileModify.css';

const ProfileModifyPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const keywords = ['사진찍기 좋은', '사람 많은', '조용한', '경치가 좋은', '넓은', '인테리어 예쁜'];
  const handleNameChange = (e) => setName(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);
  const [selectedKeywords, setSelectedKeywords] = useState([]);

  // 토큰 가져오기
  const getToken = () => {
    return localStorage.getItem('token');
  };

  const handleKeywordClick = (keyword) => {
    if (!selectedKeywords.includes(keyword) && selectedKeywords.length < 6) {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };

  const handleRemoveKeyword = (index) => {
    const newKeywords = [...selectedKeywords];
    newKeywords.splice(index, 1);
    setSelectedKeywords(newKeywords);
  };

  // 프로필 수정 요청
  // 입력이 모두 완료되었는지 확인하는 함수
  const isFormComplete = () => {
    return name.trim() !== '' && phone.trim() !== '';
  };
  
  const handleProfileUpdate = async () => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }
  
    if (!isFormComplete()) {
      setError('이름과 전화번호를 모두 입력해주세요.');
      return;
    }
  
    const updateData = {
      name: name.trim(),
      phone: phone.trim(),
      ...(selectedKeywords.length > 0 && { cafe_preferences: selectedKeywords }),
    };
  
    console.log('Update Data:', updateData);
  
    try {
      const response = await fetch('https://port-0-back-m341pqyi646021b2.sel4.cloudtype.app/users/mypage', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });
  
      if (response.ok) {
        navigate('/mypage');
      } else {
        const errorData = await response.json();
        setError(errorData.message || '프로필 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 수정 오류:', error);
      setError('서버 오류가 발생했습니다.');
    }
  };
  
  

  const handleBack = () => {
    navigate('/mypage');
  };

  return (
    <div className="profile-modify-container">
      <span className="back-button" onClick={handleBack}>&lt;</span>

      <p className="ptext-name">이름</p>
      <input type="text" className="pinput-box_name" value={name || ''} onChange={handleNameChange} />

      <p className="ptext-phonenumber">전화번호</p>
      <input type="tel" className="pinput-box_phonenumber" value={phone} onChange={handlePhoneChange} />

      <p className="ptext-cafe_preference">선호하는 키워드 순위</p>
      <p className="ptext-1">1</p>
      <p className="ptext-2">2</p>
      <p className="ptext-3">3</p>
      <p className="ptext-4">4</p>
      <p className="ptext-5">5</p>
      <p className="ptext-6">6</p>

      <div className="pranking-box">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className={`pranking-slot ${selectedKeywords[index] ? 'filled' : ''}`}
            onClick={() => handleRemoveKeyword(index)}
          >
            {selectedKeywords[index] || ''}
          </div>
        ))}
      </div>

      <div className="psignup-keyword_buttons">
        {keywords.map((keyword, index) => (
          <button
            key={index}
            onClick={() => handleKeywordClick(keyword)}
            className={`psignup-keyword_button ${selectedKeywords.includes(keyword) ? 'selected' : ''}`}
          >
            {keyword}
          </button>
        ))}
      </div>

      {error && <p className="error-message">{error}</p>}
      <button
        className={isFormComplete() ? 'update-button_O' : 'update-button_X'}
        onClick={handleProfileUpdate}
      >
        프로필 수정하기
      </button>
    </div>
  );
};

export default ProfileModifyPage;