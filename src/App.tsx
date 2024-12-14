import { FluentProvider, teamsLightTheme, teamsDarkTheme } from '@fluentui/react-components';
import { useState, useEffect } from 'react';
import ToggleTheme from './components/primatives/ToggleTheme/ToggleTheme';
import './App.css'; 

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Apply the class to the body based on the theme
  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : 'customLightTheme';
  }, [isDarkMode]);

  return (
    <FluentProvider theme={isDarkMode ? teamsDarkTheme : teamsLightTheme}>
          
        <ToggleTheme 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
        />
            <div>Hello World</div>
            
            
        </FluentProvider>
        
    );
};

export default App;
