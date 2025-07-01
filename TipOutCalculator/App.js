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
    { component: TipCalculatorScreen, title: 'Total', icon: '💰' },
    { component: BartenderEntryScreen, title: 'Bartenders', icon: '🍸' },
    { component: SupportStaffScreen, title: 'Support', icon: '🛠' },
    { component: ResultsScreen, title: 'Results', icon: '🎉' }
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
        {/* Minimal Header */}
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
                    width: index === currentScreen ? 28 : 8,
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
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerIcon: {
    fontSize: 28,
    marginBottom: theme.spacing.xs,
  },
  headerTitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  progressDot: {
    height: 8,
    borderRadius: theme.borderRadius.circle,
  },
  screenContainer: {
    flex: 1,
  },
});
