function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0a0a0a', color: '#e5e5e5', fontFamily: 'sans-serif' }}>
      <div style={{ width: '250px', backgroundColor: '#0f0f0f', borderRight: '1px solid #003d20', padding: '20px' }}>
        <h1 style={{ color: '#00ff88', marginBottom: '40px' }}>CreatorLauncher</h1>
        <div style={{ padding: '12px', backgroundColor: '#003d20', color: '#00ff88', borderRadius: '8px', marginBottom: '10px' }}>Кабинет</div>
        <div style={{ padding: '12px', color: '#a3a3a3' }}>Моды и РП</div>
        <div style={{ padding: '12px', color: '#a3a3a3' }}>Конструктор</div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ color: '#00ff88' }}>Добро пожаловать</h2>
        </div>
        <div style={{ height: '80px', backgroundColor: '#0f0f0f', borderTop: '1px solid #003d20', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' }}>
          <select style={{ background: '#0a0a0a', color: 'white', border: '1px solid #003d20', padding: '10px', borderRadius: '8px' }}>
            <option>Forge 1.21.1</option>
          </select>
          <button style={{ background: '#00ff88', color: '#0a0a0a', padding: '12px 40px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>ИГРАТЬ</button>
        </div>
      </div>
    </div>
  )
}
export default App
