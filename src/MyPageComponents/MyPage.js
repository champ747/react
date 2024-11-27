import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/cafe_chuchu_logo.png';
import profileImage from '../assets/images/cafe_chuchu_profile.png';
import wishlistImage from '../assets/images/cafe_chuchu_wishlist.png';
import myProfileIcon from '../assets/images/cafe_chuchu_myprofile.png';
import maleIcon from '../assets/images/male_icon.png';
import femaleIcon from '../assets/images/female_icon.png';
import './MyPage.css';

const MyPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [profile, setProfile] = useState({});
  const [error, setError] = useState('');

  // 토큰 가져오기 및 만료 검사
  const getToken = () => {
    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    if (tokenExpiration && Date.now() > tokenExpiration) {
      console.error('토큰이 만료되었습니다.');
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      navigate('/login');
      return null;
    }

    if (!token) {
      console.error('토큰이 없습니다.');
      navigate('/login');
      return null;
    }
    return token;
  };

  // 프로필 정보 가져오기
  const fetchUserInfo = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch('https://port-0-back-m341pqyi646021b2.sel4.cloudtype.app/users/auth', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("프로필 데이터:", data); // 디버깅용
        setProfile(data);
      } else if (response.status === 401) {
        console.error('토큰이 만료되었습니다.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('사용자 정보를 가져오는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error);
      setError('서버 오류 발생');
    }
  };

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // 페이지 이동 함수
  const goToHome = () => navigate('/home');
  const goToProfileModify = () => navigate('/mypage/profile-modify');
  const goToWishlist = () => navigate('/mypage/wishlist');
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className="mypage-container">
      {profile.userid ? (
        <>
          <img src={logo} alt="Cafe ChuChu" className="logo" onClick={goToHome} />
          <div className="profile-picture" onClick={openModal}></div>
          <div className="mypage-id">{profile.userid}</div>

          <div className="line1"></div>

          {/* 찜 목록 */}
          <img className="wishlist-icon" onClick={goToWishlist} src={wishlistImage} alt="Wishlist" />
          <div className="wishlist-linkname" onClick={goToWishlist}>찜 목록</div>

          <div className="line2"></div>

          {/* 내 프로필 */}
          <img className="myprofile-icon" src={myProfileIcon} alt="My Profile" />
          <div className="myprofile">내 프로필</div>
          <div className="profilemodify-link" onClick={goToProfileModify}>프로필 수정 &gt;</div>

          {/* 프로필 상세 정보 */}
          <span className="profile-title_name">이름</span>
          <div className="myprofile-line1"></div>
          <span className="profile-details_name">{profile.name}</span>
          <img src={profile.gender === 'male' ? maleIcon : femaleIcon} alt="gender" className="gender-icon" />

          <span className="profile-title_phone">전화번호</span>
          <div className="myprofile-line2"></div>
          <span className="profile-details_phone">{profile.phone}</span>

          <span className="profile-title_email">이메일</span>
          <div className="myprofile-line3"></div>
          <span className="profile-details_email">{profile.email}</span>

          <span className="profile-title_preferences">선호하는 키워드 순위</span>
          <span className="profile-title_preferences">선호하는 키워드 순위</span>
          <div className="profile-details_preferences">
            {profile.cafe_preferences?.map((keyword, index) => (
              <span key={index} className="preference-item">
                {keyword}
              </span>
            ))}
          </div>

          <div className="logout" onClick={handleLogout}>로그아웃</div>
        </>
      ) : (
        <p>프로필 정보를 불러오는 중...</p>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content">
            <img src={profileImage} alt="Profile" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
