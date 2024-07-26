import './App.css';
import {Routes ,Route} from 'react-router-dom'
import {HomePage ,ChatPage} from './pages';

function App() {
  return (
    <div className='App'>
     <Routes>
      <Route path="/" Component={HomePage}>Home</Route>
      <Route path="/chats" Component={ChatPage}>Chat</Route>
     </Routes>
    </div>
  );
}

export default App;
