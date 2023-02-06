import logo from './logo.svg';
import './App.css';
import { WebcamCapture } from './camera';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <WebcamCapture />
      </header>
    </div>
  );
}

export default App;
