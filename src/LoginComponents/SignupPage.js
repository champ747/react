import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import checkIcon from '../assets/images/cafe_chuchu_check.png';
import maleIcon from '../assets/images/male_icon.png';
import femaleIcon from '../assets/images/female_icon.png';
import cafeLogo from '../assets/images/cafe_chuchu_logo.png';
import checkIconO from '../assets/images/cafe_chuchu_password_check-O.png';
import checkIconX from '../assets/images/cafe_chuchu_password_check-X.png';

const SignupPage = () => {
  const navigate = useNavigate();
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [idValue, setIdValue] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [isPasswordMatched, setIsPasswordMatched] = useState(false);
  const [name, setName] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [cafePreferences, setCafePreferences] = useState([]);

  const handleIdChange = (e) => setIdValue(e.target.value);
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setIsPasswordMatched(e.target.value === passwordCheck);
  };
  const handlePasswordCheckChange = (e) => {
    setPasswordCheck(e.target.value);
    setIsPasswordMatched(password === e.target.value);
  };
  const handleCafePreferenceClick = (preference) => {
    setCafePreferences((prev) => 
      prev.includes(preference)
        ? prev.filter((item) => item !== preference)
        : [...prev, preference]
    );
  };

  const handleGenderSelect = (gender) => setSelectedGender(gender);
  const handleNameChange = (e) => setName(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value); 

  const keywords = ['사진찍기 좋은', '사람 많은', '조용한', '경치가 좋은', '넓은', '인테리어 예쁜'];
  const [selectedKeywords, setSelectedKeywords] = useState([]);

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

  const isFormComplete = () => {
    return (
      idValue &&
      password &&
      passwordCheck &&
      isPasswordMatched &&
      name &&
      selectedGender &&
      phone &&
      email &&
      selectedKeywords.length > 0
    );
  };

  const handleSignup = async () => {
    if (!isFormComplete()) {
      setError('모든 입력 항목을 완료해주세요.');
      return;
    }

    const signupData = {
      userid: idValue,
      name: name,
      password: password,
      gender: selectedGender === 'male' ? 'male' : 'female',
      email: email,
      phone: phone,
      cafe_preferences: selectedKeywords
    };

    try {
      const response = await fetch('https://port-0-back-m341pqyi646021b2.sel4.cloudtype.app/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('서버 오류 발생:', error);
      setError('서버 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="signup-container">
      <img src={cafeLogo} alt="Cafe ChuChu" className="signuppage-logo" onClick={() => navigate('/login')} />

      <p className="text-id">아이디</p>
      <input type="text" className="input-box_id" value={idValue || ''} onChange={handleIdChange} />

      <p className="text-password">비밀번호(5자 이상)</p>
      <input type="password" className="input-box_password" value={password || ''} onChange={handlePasswordChange} />
      <p className="text-passwordcheck">비밀번호 확인</p>
      <input type="password" className="input-box_passwordcheck" value={passwordCheck || ''} onChange={handlePasswordCheckChange} />
      {passwordCheck && (
        <img src={isPasswordMatched ? checkIconO : checkIconX} alt={isPasswordMatched ? "비밀번호 일치" : "비밀번호 불일치"} className="password_check-icon" />
      )}

      <p className="text-name">이름</p>
      <input type="text" className="input-box_name" value={name || ''} onChange={handleNameChange} />

      <p className="text-gender">성별</p>
      <img src={maleIcon} alt="Male" className="male-icon" />
      <img src={femaleIcon} alt="Female" className="female-icon" />
      <button className={`male-button ${selectedGender === 'male' ? 'select-male-button' : ''}`} onClick={() => handleGenderSelect('male')}></button>
      <span className={`male-button_span ${selectedGender === 'male' ? 'select-male-button_span' : ''}`} onClick={() => handleGenderSelect('male')}>남</span>
      <button className={`female-button ${selectedGender === 'female' ? 'select-female-button' : ''}`} onClick={() => handleGenderSelect('female')}></button>
      <span className={`female-button_span ${selectedGender === 'female' ? 'select-female-button_span' : ''}`} onClick={() => handleGenderSelect('female')}>여</span>

      <p className="text-phonenumber">전화번호</p>
      <input type="tel" className="input-box_phonenumber" value={phone} onChange={handlePhoneChange} />

      <p className="text-email">이메일</p>
      <input type="email" className="input-box_email" value={email} onChange={handleEmailChange} />

      <p className="text-cafe_preference">선호하는 키워드 순위</p>
      <p className="text-1">1</p>
      <p className="text-2">2</p>
      <p className="text-3">3</p>
      <p className="text-4">4</p>
      <p className="text-5">5</p>
      <p className="text-6">6</p>

      <div className="ranking-box">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className={`ranking-slot ${selectedKeywords[index] ? 'filled' : ''}`}
            onClick={() => handleRemoveKeyword(index)}
          >
            {selectedKeywords[index] || ''}
          </div>
        ))}
      </div>

      <div className="signup-keyword_buttons">
        {keywords.map((keyword, index) => (
          <button
            key={index}
            onClick={() => handleKeywordClick(keyword)}
            className={`signup-keyword_button ${selectedKeywords.includes(keyword) ? 'selected' : ''}`}
          >
            {keyword}
          </button>
        ))}
      </div>

      {error && <p className="error-message">{error}</p>}
      
      <button className={isFormComplete() ? 'signup-button_O' : 'signup-button_X'} onClick={handleSignup}>회원가입 하기</button>
    </div>
  );
};

export default SignupPage;