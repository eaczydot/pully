import 'react-native-gesture-handler';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppRegistry } from 'react-native';

import App from './App';

// Register the app for web
AppRegistry.registerComponent('TipOutCalculator', () => App);

// For web rendering
if (typeof document !== 'undefined') {
  const container = document.getElementById('root');
  const root = createRoot(container);
  root.render(<App />);
}
