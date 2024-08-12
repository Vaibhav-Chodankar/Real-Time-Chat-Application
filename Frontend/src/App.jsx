import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register';
import Login from './pages/Login';
import Chats from './pages/Chats';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<Chats />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;