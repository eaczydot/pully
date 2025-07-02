import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanGestureHandler,
  State
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import TipCalculatorScreen from './src/screens/TipCalculatorScreen';
import BartenderEntryScreen from './src/screens/BartenderEntryScreen';
import SupportStaffScreen from './src/screens/SupportStaffScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import { theme } from './src/theme';
import PushNotificationService from './src/components/PushNotificationService';

const { width } = Dimensions.get('window');

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [tipData, setTipData] = useState({
    totalTips: 0,
    bartenders: [],
    supportStaff: [],
    supportStaffPercentage: 20
  });

  // Animation refs
  const screenTranslateX = useRef(new Animated.Value(0)).current;
  const progressAnimations = useRef(
    Array.from({ length: 4 }, () => new Animated.Value(0))
  ).current;
  const headerIconScale = useRef(new Animated.Value(1)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  const screens = [
    { component: TipCalculatorScreen, title: 'Total', icon: '💰' },
    { component: BartenderEntryScreen, title: 'Bartenders', icon: '🍸' },
    { component: SupportStaffScreen, title: 'Support', icon: '🛠' },
    { component: ResultsScreen, title: 'Results', icon: '🎉' }
  ];

  useEffect(() => {
    // Initialize push notifications
    const initializeNotifications = async () => {
      try {
        await PushNotificationService.initialize();
        console.log('Push notifications initialized successfully');
      } catch (error) {
        console.error('Failed to initialize push notifications:', error);
      }
    };

    initializeNotifications();

    // Cleanup on unmount
    return () => {
      PushNotificationService.cleanup();
    };
  }, []);

  useEffect(() => {
    // Animate header on mount
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(headerIconScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate progress indicators
    progressAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: index === currentScreen ? 1 : 0.3,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
  }, [currentScreen, headerOpacity, headerIconScale, progressAnimations]);

  const handleSwipe = (direction) => {
    const newScreen = direction === 'left' 
      ? Math.min(currentScreen + 1, screens.length - 1)
      : Math.max(currentScreen - 1, 0);
    
    if (newScreen !== currentScreen) {
      // Enhanced haptic feedback based on direction
      if (direction === 'left') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Screen transition animation
      const translateValue = direction === 'left' ? -50 : 50;
      
      Animated.sequence([
        Animated.timing(screenTranslateX, {
          toValue: translateValue,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(screenTranslateX, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      // Icon bounce animation
      Animated.sequence([
        Animated.timing(headerIconScale, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(headerIconScale, {
          toValue: 1,
          tension: 300,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentScreen(newScreen);
    }
  };

  const handleProgressTap = (index) => {
    if (index !== currentScreen) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Direction-based animation
      const direction = index > currentScreen ? 'left' : 'right';
      handleSwipe(direction);
      setCurrentScreen(index);
    }
  };

  const CurrentScreenComponent = screens[currentScreen].component;

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={theme.colors.background} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Enhanced Animated Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: headerOpacity,
            }
          ]}
        >
          <View style={styles.headerContent}>
            <Animated.Text 
              style={[
                styles.headerIcon,
                {
                  transform: [{ scale: headerIconScale }]
                }
              ]}
            >
              {screens[currentScreen].icon}
            </Animated.Text>
            <Text style={styles.headerTitle}>{screens[currentScreen].title}</Text>
          </View>
          
          {/* Enhanced Progress Indicators */}
          <View style={styles.progressContainer}>
            {screens.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleProgressTap(index)}
                activeOpacity={0.7}
                style={styles.progressTouchArea}
              >
                <Animated.View
                  style={[
                    styles.progressDot,
                    {
                      backgroundColor: progressAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [theme.colors.surfaceSecondary, theme.colors.teal],
                      }),
                      width: progressAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [8, 32],
                      }),
                      opacity: progressAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      }),
                    }
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Enhanced Screen Container with Transition Animation */}
        <Animated.View 
          style={[
            styles.screenContainer,
            {
              transform: [{ translateX: screenTranslateX }],
            }
          ]}
        >
          <CurrentScreenComponent
            tipData={tipData}
            setTipData={setTipData}
            onNext={() => handleSwipe('left')}
            onPrevious={() => handleSwipe('right')}
          />
        </Animated.View>
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
  progressTouchArea: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.circle,
  },
  progressDot: {
    height: 8,
    borderRadius: theme.borderRadius.circle,
  },
  screenContainer: {
    flex: 1,
  },
});
