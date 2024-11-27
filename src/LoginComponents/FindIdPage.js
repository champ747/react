import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FindIdPage.css';
import cafeLogo from '../assets/images/cafe_chuchu_logo.png';

const FindIdPage = () => {
  const navigate = useNavigate();
  const [usePhone, setUsePhone] = useState(true); // 전화 번호와 이메일 전환을 위한 상태

  const handleSwitchMethod = () => {
    setUsePhone(!usePhone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 아이디 찾기 로직 추가
    alert('아이디 찾기 성공!');
  };

  return (
    <div className="find-id-container">
      <img src={cafeLogo} alt="Cafe ChuChu" className="findidpage_logo" onClick={() => navigate('/login')} />
      <h2 className="find-id-title">아이디 찾기</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="input-label_1"
          placeholder="이름 입력"
          required
        />
        <input
          type={usePhone ? 'tel' : 'email'}
          className="input-label_2"
          placeholder={usePhone ? '전화 번호 입력' : '이메일 입력'}
          required
        />
        <button type="submit" className="find-id-button">아이디 찾기</button>
      </form>
      <div className="find-id-link" onClick={handleSwitchMethod}>
        {usePhone ? '이메일로 찾기' : '전화 번호로 찾기'}
      </div>
    </div>
  );
}

export default FindIdPage;
