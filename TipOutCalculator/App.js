import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
// import { PanGestureHandler } from 'react-native-gesture-handler';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TipCalculatorScreen from './src/screens/TipCalculatorScreen';
import BartenderEntryScreen from './src/screens/BartenderEntryScreen';
import SupportStaffScreen from './src/screens/SupportStaffScreen';
import ResultsScreen from './src/screens/ResultsScreen';



export default function App() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [tipData, setTipData] = useState({
    totalTips: 0,
    bartenders: [],
    supportStaff: [],
    supportStaffPercentage: 20
  });

  const screens = [
    { component: TipCalculatorScreen, title: 'Enter Total Tips' },
    { component: BartenderEntryScreen, title: 'Add Bartenders' },
    { component: SupportStaffScreen, title: 'Add Support Staff' },
    { component: ResultsScreen, title: 'Results' }
  ];

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handlePrevious = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const goToScreen = (screenIndex) => {
    setCurrentScreen(screenIndex);
  };

  const CurrentScreenComponent = screens[currentScreen].component;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />
        
        {/* Minimal Header with Progress */}
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${((currentScreen + 1) / screens.length) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.stepText}>
              {currentScreen + 1} of {screens.length}
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.screenContainer}>
          <CurrentScreenComponent
            tipData={tipData}
            setTipData={setTipData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            goToScreen={goToScreen}
            currentScreen={currentScreen}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 3,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  stepText: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  screenContainer: {
    flex: 1,
  },
});
