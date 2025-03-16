import { FluentProvider, teamsLightTheme, teamsDarkTheme } from '@fluentui/react-components';
import { useState, useEffect } from 'react';
import ToggleTheme from './components/primatives/ToggleTheme/ToggleTheme';
import PairsChart from './components/templates/PairsChart/PairsChart';
import './App.css'; 

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const graphqlEndpoint = "http://134.209.183.65:8080/graphql";

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
          <h1>Crypto Chart</h1>
        {/* Pass graphqlEndpoint as a prop */}
        <PairsChart graphqlEndpoint={graphqlEndpoint} />
            
        </FluentProvider>
        
    );
};

export default App;
