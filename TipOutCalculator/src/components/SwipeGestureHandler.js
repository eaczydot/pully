import React, { useRef, useState } from 'react';
import { View, PanGestureHandler, State } from 'react-native-gesture-handler';
import { Animated, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const SwipeGestureHandler = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  swipeThreshold = width * 0.25, // 25% of screen width
  style,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [isGesturing, setIsGesturing] = useState(false);
  const [gestureDirection, setGestureDirection] = useState(null);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { 
      useNativeDriver: true,
      listener: (event) => {
        const { translationX: tx } = event.nativeEvent;
        
        // Detect direction and provide haptic feedback
        if (!isGesturing && Math.abs(tx) > 20) {
          setIsGesturing(true);
          const direction = tx > 0 ? 'right' : 'left';
          setGestureDirection(direction);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        
        // Progressive haptic feedback for longer swipes
        if (isGesturing && Math.abs(tx) > swipeThreshold * 0.7) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      }
    }
  );

  const onHandlerStateChange = (event) => {
    const { translationX: tx, velocityX, state } = event.nativeEvent;

    if (state === State.END) {
      const shouldSwipe = Math.abs(tx) > swipeThreshold || Math.abs(velocityX) > 1000;
      
      if (shouldSwipe) {
        // Successful swipe
        const direction = tx > 0 ? 'right' : 'left';
        
        // Strong haptic feedback for successful swipe
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        
        // Complete the swipe animation
        Animated.timing(translateX, {
          toValue: direction === 'right' ? width : -width,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          // Trigger navigation callback
          if (direction === 'right' && onSwipeRight) {
            onSwipeRight();
          } else if (direction === 'left' && onSwipeLeft) {
            onSwipeLeft();
          }
          
          // Reset position
          translateX.setValue(0);
        });
      } else {
        // Snap back animation
        Animated.spring(translateX, {
          toValue: 0,
          tension: 200,
          friction: 10,
          useNativeDriver: true,
        }).start();
      }
      
      setIsGesturing(false);
      setGestureDirection(null);
    }
  };

  const getOpacity = () => {
    return translateX.interpolate({
      inputRange: [-width, 0, width],
      outputRange: [0.7, 1, 0.7],
      extrapolate: 'clamp',
    });
  };

  const getScale = () => {
    return translateX.interpolate({
      inputRange: [-width, 0, width],
      outputRange: [0.95, 1, 0.95],
      extrapolate: 'clamp',
    });
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      activeOffsetX={[-20, 20]}
      failOffsetY={[-50, 50]}
    >
      <Animated.View
        style={[
          style,
          {
            transform: [
              { translateX },
              { scale: getScale() },
            ],
            opacity: getOpacity(),
          },
        ]}
      >
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};

export default SwipeGestureHandler;