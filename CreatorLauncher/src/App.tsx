function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#0a0a0a', color: '#e5e5e5', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* Левая панель */}
      <div style={{ width: '250px', backgroundColor: '#0f0f0f', borderRight: '1px solid #003d20', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ color: '#00ff88', fontSize: '24px', fontWeight: 'bold', marginBottom: '40px' }}>CreatorLauncher</h1>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ padding: '12px', backgroundColor: '#003d20', color: '#00ff88', borderRadius: '8px', cursor: 'pointer' }}>Кабинет</div>
          <div style={{ padding: '12px', borderRadius: '8px', cursor: 'pointer', color: '#a3a3a3' }}>Моды и РП</div>
          <div style={{ padding: '12px', borderRadius: '8px', cursor: 'pointer', color: '#a3a3a3' }}>Конструктор</div>
          <div style={{ padding: '12px', borderRadius: '8px', cursor: 'pointer', color: '#a3a3a3' }}>Настройки</div>
        </nav>
      </div>

      {/* Правая часть */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Центр */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '32px', color: '#00ff88' }}>Добро пожаловать в CreatorLauncher</h2>
        </div>

        {/* Нижняя панель */}
        <div style={{ height: '80px', backgroundColor: '#0f0f0f', borderTop: '1px solid #003d20', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' }}>
          <select style={{ backgroundColor: '#0a0a0a', color: 'white', border: '1px solid #003d20', padding: '10px 15px', borderRadius: '8px', outline: 'none' }}>
            <option>Forge 1.21.1</option>
            <option>Fabric 1.20.4</option>
          </select>
          <button style={{ backgroundColor: '#00ff88', color: '#0a0a0a', padding: '12px 40px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', border: 'none', cursor: 'pointer', boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)' }}>
            ИГРАТЬ
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;