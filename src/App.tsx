import React, { useState } from 'react';
import { User, Package, Wrench, Settings } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('cabinet');
  const [nickname, setNickname] = useState('Игрок');

  const icons = [
    { name: 'cabinet', Icon: User },
    { name: 'mods', Icon: Package },
    { name: 'constructor', Icon: Wrench },
    { name: 'settings', Icon: Settings }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0a0a0a', color: '#e5e5e5', fontFamily: 'sans-serif' }}>
      
      <div style={{ display: 'flex', flex: 1 }}>
        {/* ЛЕВАЯ ПОЛОСА - ПОЛНОСТЬЮ ЗЕЛЁНАЯ */}
        <div style={{ width: '75px', backgroundColor: '#00ff88', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px 0' }}>
          
          {/* ЛОГОТИП из папки icon */}
          <img src="/icon/1793961450.png" alt="Logo" style={{ width: '45px', height: '45px', marginBottom: '25px', objectFit: 'contain' }} />
          
          {icons.map((item, index) => {
            const isActive = activeTab === item.name;
            return (
              <div 
                key={index} 
                onClick={() => setActiveTab(item.name)} 
                style={{
                  width: '45px', 
                  height: '45px', 
                  borderRadius: '10px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer', 
                  marginBottom: '8px',
                  backgroundColor: isActive ? '#0a0a0a' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                <item.Icon size={22} color="#0a0a0a" />
              </div>
            );
          })}
        </div>

        {/* ЦЕНТРАЛЬНАЯ ОБЛАСТЬ */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#0a0a0a' }}>
          {/* Приветствие */}
          <div style={{ padding: '20px 30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <input 
              type='text' 
              style={{ backgroundColor: '#0f0f0f', border: '1px solid #003d20', borderRadius: '8px', padding: '10px 15px', color: '#e5e5e5', fontSize: '14px', outline: 'none', width: '250px' }} 
              placeholder='Введите никнейм...' 
              value={nickname} 
              onChange={(e) => setNickname