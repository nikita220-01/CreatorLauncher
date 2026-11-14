import React, { useState } from 'react';
import { User, Package, Wrench, Settings, ArrowLeft, X, Loader } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';

const SkinSVG = ({ skin, size = 80 }: { skin: typeof skins[0]; size?: number }) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 20 30" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="0" width="8" height="8" fill={skin.skinColor} />
    <rect x="7" y="1" width="2" height="2" fill="#ffffff" />
    <rect x="11" y="1" width="2" height="2" fill="#ffffff" />
    <rect x="7.5" y="1.5" width="1" height="1" fill="#000000" />
    <rect x="11.5" y="1.5" width="1" height="1" fill="#000000" />
    <rect x="8" y="5" width="4" height="1" fill={skin.mouthColor} />
    {skin.hat && <rect x="5" y="0" width="10" height="2" fill={skin.hatColor} />}
    <rect x="6" y="8" width="8" height="10" fill={skin.shirtColor} />
    <rect x="2" y="8" width="4" height="10" fill={skin.shirtColor} />
    <rect x="14" y="8" width="4" height="10" fill={skin.shirtColor} />
    <rect x="2" y="18" width="4" height="3" fill={skin.skinColor} />
    <rect x="14" y="18" width="4" height="3" fill={skin.skinColor} />
    <rect x="6" y="18" width="4" height="12" fill={skin.pantsColor} />
    <rect x="10" y="18" width="4" height="12" fill={skin.pantsColor} />
    <rect x="6" y="27" width="4" height="3" fill={skin.shoeColor} />
    <rect x="10" y="27" width="4" height="3" fill={skin.shoeColor} />
  </svg>
);

const skins = [
  { id: 1, name: 'Steve', skinColor: '#c49a6c', shirtColor: '#00a8a8', pantsColor: '#3b3b8f', shoeColor: '#5a5a5a', hat: false, mouthColor: '#8b5a3a', hatColor: '' },
  { id: 2, name: 'Alex', skinColor: '#f0c8a0', shirtColor: '#6ab04c', pantsColor: '#5a3a2a', shoeColor: '#4a3a2a', hat: false, mouthColor: '#c49a6c', hatColor: '' },
  { id: 3, name: 'Knight', skinColor: '#c49a6c', shirtColor: '#7a7a7a', pantsColor: '#4a4a4a', shoeColor: '#2a2a2a', hat: true, mouthColor: '#8b5a3a', hatColor: '#5a5a5a' },
  { id: 4, name: 'Mage', skinColor: '#e8d5b7', shirtColor: '#5a3a7c', pantsColor: '#3a2a5c', shoeColor: '#2a1a3c', hat: true, mouthColor: '#c49a6c', hatColor: '#3a2a5c' },
  { id: 5, name: 'Ninja', skinColor: '#d4b896', shirtColor: '#2a2a2a', pantsColor: '#1a1a1a', shoeColor: '#0a0a0a', hat: true, mouthColor: '#8b5a3a', hatColor: '#1a1a1a' },
  { id: 6, name: 'Hero', skinColor: '#f0c8a0', shirtColor: '#c0392b', pantsColor: '#2c3e50', shoeColor: '#1a1a1a', hat: false, mouthColor: '#c49a6c', hatColor: '' },
  { id: 7, name: 'Robot', skinColor: '#95a5a6', shirtColor: '#7f8c8d', pantsColor: '#5a6a6a', shoeColor: '#3a4a4a', hat: false, mouthColor: '#7f8c8d', hatColor: '' },
  { id: 8, name: 'Zombie', skinColor: '#5a8a5a', shirtColor: '#3a6a3a', pantsColor: '#2a4a2a', shoeColor: '#1a3a1a', hat: false, mouthColor: '#3a5a3a', hatColor: '' }
];

function App() {
  const [activeTab, setActiveTab] = useState('cabinet');
  const [nickname] = useState('Игрок');
  const [view, setView] = useState<'catalog' | 'preview'>('catalog');
  const [selectedSkin, setSelectedSkin] = useState<typeof skins[0] | null>(null);
  const [selectedVersion, setSelectedVersion] = useState('1.21.1');
  
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchProgress, setLaunchProgress] = useState(0);
  const [launchStatus, setLaunchStatus] = useState('');

  const icons = [
    { name: 'cabinet', Icon: User },
    { name: 'mods', Icon: Package },
    { name: 'constructor', Icon: Wrench },
    { name: 'settings', Icon: Settings }
  ];

  const handlePlay = async () => {
    if (isLaunching) return;
    
    setIsLaunching(true);
    setLaunchProgress(0);
    setLaunchStatus('Проверка версии...');
    
    try {
      const result = await invoke<string>('launch_minecraft', {
        nickname: nickname,
        version: selectedVersion
      });
      
      console.log(result);
      setLaunchStatus(result);
      setLaunchProgress(100);
      
    } catch (error) {
      console.error('Ошибка запуска:', error);
      setLaunchStatus(`Ошибка: ${error}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    setIsLaunching(false);
    setLaunchProgress(0);
    setLaunchStatus('');
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      fontFamily: 'sans-serif',
      margin: 0,
      padding: 0
    }}>
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ 
          width: '75px', 
          backgroundColor: '#52b788', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: '15px 0',
          flexShrink: 0
        }}>
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
                  backgroundColor: 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                <item.Icon size={22} color={isActive ? '#ffffff' : '#2d6a4f'} />
              </div>
            );
          })}
        </div>

        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 60%, #000000 100%)',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '25px 0 0 0',
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}>
            <span style={{ 
              color: '#52b788', 
              fontSize: '20px', 
              fontWeight: '600',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9), -1px -1px 2px rgba(82, 183, 136, 0.3)'
            }}>
              {nickname}
            </span>
          </div>
          
          <div style={{ 
            flex: 1, 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            overflow: 'auto'
          }}>
            {isLaunching ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '30px',
                width: '100%',
                maxWidth: '500px'
              }}>
                <Loader size={64} color="#52b788" style={{ animation: 'spin 2s linear infinite' }} />
                
                <h2 style={{
                  color: '#52b788',
                  fontSize: '24px',
                  margin: 0,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
                  textAlign: 'center',
                  whiteSpace: 'pre-wrap'
                }}>
                  {launchStatus}
                </h2>
                
                <div style={{
                  width: '100%',
                  height: '20px',
                  backgroundColor: '#0f0f0f',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '2px solid #40916c'
                }}>
                  <div style={{
                    width: `${launchProgress}%`,
                    height: '100%',
                    backgroundColor: '#52b788',
                    transition: 'width 0.5s ease',
                    boxShadow: '0 0 10px rgba(82, 183, 136, 0.5)'
                  }} />
                </div>
                
                <span style={{
                  color: '#aaaaaa',
                  fontSize: '14px'
                }}>
                  {launchProgress}%
                </span>
              </div>
            ) : view === 'catalog' ? (
              <>
                <h2 style={{ 
                  color: '#52b788', 
                  fontSize: '16px', 
                  margin: '0 0 20px 0',
                  fontWeight: '500',
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.9)',
                  letterSpacing: '2px'
                }}>
                  КАТАЛОГ СКИНОВ
                </h2>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '15px',
                  maxWidth: '500px',
                  width: '100%'
                }}>
                  {skins.map((skin) => (
                    <div 
                      key={skin.id}
                      onClick={() => { setSelectedSkin(skin); setView('preview'); }}
                      style={{
                        width: '100px',
                        height: '100px',
                        backgroundColor: '#0f0f0f',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: '1px solid #40916c',
                        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.8), 0 2px 5px rgba(0,0,0,0.5)'
                      }}
                    >
                      <SkinSVG skin={skin} size={50} />
                      <span style={{ 
                        color: '#aaaaaa', 
                        fontSize: '10px', 
                        fontWeight: '500',
                        marginTop: '5px',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.9)'
                      }}>
                        {skin.name}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              selectedSkin && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px'
                }}>
                  <div 
                    onClick={() => setView('catalog')}
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '30px',
                      cursor: 'pointer',
                      padding: '5px'
                    }}
                  >
                    <X size={24} color="#52b788" />
                  </div>

                  <div style={{
                    backgroundColor: '#0f0f0f',
                    borderRadius: '16px',
                    padding: '30px',
                    border: '2px solid #40916c',
                    boxShadow: 'inset 0 0 30px rgba(0,0,0,0.9), 0 4px 15px rgba(0,0,0,0.7)'
                  }}>
                    <SkinSVG skin={selectedSkin} size={120} />
                  </div>

                  <h3 style={{
                    color: '#52b788',
                    fontSize: '24px',
                    margin: 0,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
                    letterSpacing: '2px'
                  }}>
                    {selectedSkin.name}
                  </h3>

                  <button
                    onClick={() => setView('catalog')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      backgroundColor: '#0a0a0a',
                      color: '#52b788',
                      border: '1px solid #40916c',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.2s'
                    }}
                  >
                    <ArrowLeft size={16} />
                    В каталог
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div style={{ 
        height: '70px', 
        backgroundColor: '#52b788', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 20px',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {['1.21.1', '1.20.1', '1.19.2'].map((ver) => (
            <button
              key={ver}
              onClick={() => setSelectedVersion(ver)}
              style={{
                padding: '10px 20px',
                backgroundColor: selectedVersion === ver ? '#52b788' : '#0a0a0a',
                color: selectedVersion === ver ? '#0a0a0a' : '#52b788',
                border: '2px solid #52b788',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px'
              }}
            >
              {ver}
            </button>
          ))}
        </div>
        
        <button 
          onClick={handlePlay}
          disabled={isLaunching}
          style={{ 
            width: '180px', 
            height: '45px', 
            backgroundColor: '#0a0a0a', 
            color: '#52b788', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            border: 'none', 
            borderRadius: '10px', 
            cursor: isLaunching ? 'not-allowed' : 'pointer', 
            opacity: isLaunching ? 0.5 : 1,
            transition: 'all 0.2s' 
          }}
        >
          {isLaunching ? 'ЗАПУСК...' : 'ИГРАТЬ'}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;