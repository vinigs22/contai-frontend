import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AccountingEntries } from './pages/AccountingEntries';

function App() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Radio: {
            colorPrimary: '#6052E4',
          },
          Button: {
            colorPrimary: '#6052E4',
            colorPrimaryHover: '#6052E4',
            
          },
          Select: {
            colorPrimary: '#6052E4',
            colorPrimaryHover: '#6052E4',
            optionSelectedBg: '#F1EFFF',
          },
          Input: {
            colorPrimary: '#6052E4',
            colorPrimaryHover: '#6052E4',
          },
          DatePicker:{
            colorPrimary: '#6052E4',
            colorPrimaryHover: '#6052E4',
          },
          Table:{
            headerBg:'#F1EFFF',
            headerSplitColor: '#ffffff'
          }
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<AccountingEntries />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
