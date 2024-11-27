import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import FindIdPage from './LoginComponents/FindIdPage'; 
import FindPasswordPage from './LoginComponents/FindPasswordPage';
import LoginPage from './LoginComponents/LoginPage';
import HomePage from './HomePage';
import SignupPage from './LoginComponents/SignupPage'; 

import MyPage from './MyPageComponents/MyPage';
import ProfileModify from './MyPageComponents/ProfileModify';
import WishListPage from './MyPageComponents/WishListPage';

import KeywordSearchPage from './SearchComponents/KeywordSearchPage';
import ChatbotSearchPage from './SearchComponents/ChatbotSearchPage';
import KeywordSearchResults from './SearchComponents/KeywordSearchResults';
import NameSearchResults from './SearchComponents/NameSearchResults';

import CafeDetailPage from './CafeDetailComponents/CafeDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/find-id" element={<FindIdPage />} />
        <Route path="/find-password" element={<FindPasswordPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/profile-modify" element={<ProfileModify />} />
        <Route path="/mypage/wishlist" element={<WishListPage />} />

        <Route path="/keyword-search" element={<KeywordSearchPage />} />
        <Route path="/chatbot-search" element={<ChatbotSearchPage />} />
        <Route path="/keyword-search-results" element={<KeywordSearchResults />} />
        <Route path="/name-search-results" element={<NameSearchResults />} />

        <Route path="/cafe-detail/:id" element={<CafeDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
