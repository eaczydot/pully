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
    { component: TipCalculatorScreen, title: 'Total Tips' },
    { component: BartenderEntryScreen, title: 'Bartenders' },
    { component: SupportStaffScreen, title: 'Support Staff' },
    { component: ResultsScreen, title: 'Results' }
  ];

  const handleSwipe = (direction) => {
    if (direction === 'left' && currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else if (direction === 'right' && currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const CurrentScreenComponent = screens[currentScreen].component;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{screens[currentScreen].title}</Text>
          <View style={styles.progressDots}>
            {screens.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { backgroundColor: index === currentScreen ? '#000' : '#E5E5E7' }
                ]}
              />
            ))}
          </View>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity 
            style={[styles.navButton, currentScreen === 0 && styles.navButtonDisabled]}
            onPress={() => handleSwipe('right')}
            disabled={currentScreen === 0}
          >
            <Text style={styles.navButtonText}>← Previous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navButton, currentScreen === screens.length - 1 && styles.navButtonDisabled]}
            onPress={() => handleSwipe('left')}
            disabled={currentScreen === screens.length - 1}
          >
            <Text style={styles.navButtonText}>Next →</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.screenContainer}>
          <CurrentScreenComponent
            tipData={tipData}
            setTipData={setTipData}
            onNext={() => handleSwipe('left')}
            onPrevious={() => handleSwipe('right')}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  screenContainer: {
    flex: 1,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  navButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#E5E5E7',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
