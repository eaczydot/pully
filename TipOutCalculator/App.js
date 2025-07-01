import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TipCalculatorScreen from './src/screens/TipCalculatorScreen';
import BartenderEntryScreen from './src/screens/BartenderEntryScreen';
import SupportStaffScreen from './src/screens/SupportStaffScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import { theme } from './src/theme';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [tipData, setTipData] = useState({
    totalTips: 0,
    bartenders: [],
    supportStaff: [],
    supportStaffPercentage: 20
  });

  const screens = [
    { component: TipCalculatorScreen, title: 'Total Tips', icon: '💰' },
    { component: BartenderEntryScreen, title: 'Bartenders', icon: '🍸' },
    { component: SupportStaffScreen, title: 'Support Staff', icon: '🛠' },
    { component: ResultsScreen, title: 'Results', icon: '📊' }
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
      <StatusBar style="light" backgroundColor={theme.colors.background} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Modern Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerIcon}>{screens[currentScreen].icon}</Text>
            <Text style={styles.headerTitle}>{screens[currentScreen].title}</Text>
          </View>
          
          {/* Progress Indicators */}
          <View style={styles.progressContainer}>
            {screens.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  { 
                    backgroundColor: index === currentScreen 
                      ? theme.colors.teal 
                      : theme.colors.surfaceSecondary,
                    width: index === currentScreen ? 24 : 8,
                  }
                ]}
              />
            ))}
          </View>
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
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  headerTitle: {
    ...theme.typography.heading,
    color: theme.colors.text,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  progressDot: {
    height: 8,
    borderRadius: theme.borderRadius.circle,
    transition: 'all 0.3s ease',
  },
  screenContainer: {
    flex: 1,
  },
});
