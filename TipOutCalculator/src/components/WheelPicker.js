import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanGestureHandler,
  State,
  Animated,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');
const ITEM_HEIGHT = 60;
const ITEM_WIDTH = 120; // Width for each employee item
const VISIBLE_ITEMS = 3;
const CAROUSEL_HEIGHT = 80;

const WheelPicker = ({ 
  data = [], 
  roles = ['Bartender', 'Barback'],
  onPersonSelect,
  onRoleSelect,
  onAddNew,
  currentPerson,
  currentRole = 'Bartender'
}) => {
  const [selectedPersonIndex, setSelectedPersonIndex] = useState(0);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');

  const personScrollX = useRef(new Animated.Value(0)).current;
  const roleScrollY = useRef(new Animated.Value(0)).current;

  // Filter data by current role
  const filteredData = data.filter(item => item.role === currentRole);
  const allItems = [...filteredData, { id: 'new', name: '+ Add New', isNew: true }];

  useEffect(() => {
    // Update role index when currentRole changes
    const roleIndex = roles.indexOf(currentRole);
    if (roleIndex !== -1) {
      setSelectedRoleIndex(roleIndex);
      animateToRole(roleIndex);
    }
  }, [currentRole]);

  const animateToPerson = (index) => {
    Animated.spring(personScrollX, {
      toValue: index * ITEM_WIDTH,
      useNativeDriver: true,
      tension: 100,
      friction: 8
    }).start();
  };

  const animateToRole = (index) => {
    Animated.spring(roleScrollY, {
      toValue: index * ITEM_HEIGHT,
      useNativeDriver: true,
      tension: 100,
      friction: 8
    }).start();
  };

  const handlePersonGesture = (event) => {
    const { translationX, state } = event.nativeEvent;
    
    if (state === State.ACTIVE) {
      personScrollX.setValue(selectedPersonIndex * ITEM_WIDTH + translationX);
    } else if (state === State.END) {
      const velocity = event.nativeEvent.velocityX;
      const threshold = ITEM_WIDTH / 2;
      
      let newIndex = selectedPersonIndex;
      if (Math.abs(translationX) > threshold || Math.abs(velocity) > 500) {
        if (translationX > 0 || velocity > 0) {
          // Swipe right - go to previous person
          newIndex = Math.max(0, selectedPersonIndex - 1);
        } else {
          // Swipe left - go to next person
          newIndex = Math.min(allItems.length - 1, selectedPersonIndex + 1);
        }
      }
      
      setSelectedPersonIndex(newIndex);
      animateToPerson(newIndex);
      
      const selectedItem = allItems[newIndex];
      if (selectedItem.isNew) {
        setIsAddingNew(true);
        onAddNew && onAddNew();
      } else {
        setIsAddingNew(false);
        onPersonSelect && onPersonSelect(selectedItem);
      }
    }
  };

  const handleRoleGesture = (event) => {
    const { translationY, state } = event.nativeEvent;
    
    if (state === State.ACTIVE) {
      roleScrollY.setValue(selectedRoleIndex * ITEM_HEIGHT + translationY);
    } else if (state === State.END) {
      const velocity = event.nativeEvent.velocityY;
      const threshold = ITEM_HEIGHT / 2;
      
      let newIndex = selectedRoleIndex;
      if (Math.abs(translationY) > threshold || Math.abs(velocity) > 500) {
        if (translationY > 0 || velocity > 0) {
          // Swipe down - go to previous role (Bartender)
          newIndex = Math.max(0, selectedRoleIndex - 1);
        } else {
          // Swipe up - go to next role (Barback)
          newIndex = Math.min(roles.length - 1, selectedRoleIndex + 1);
        }
      }
      
      setSelectedRoleIndex(newIndex);
      animateToRole(newIndex);
      onRoleSelect && onRoleSelect(roles[newIndex]);
    }
  };

  const renderPersonItem = (item, index) => {
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];

    const scale = personScrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1.2, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = personScrollX.interpolate({
      inputRange,
      outputRange: [0.4, 1, 0.4],
      extrapolate: 'clamp',
    });

    const translateY = personScrollX.interpolate({
      inputRange,
      outputRange: [10, 0, 10],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        key={item.id}
        style={[
          styles.personItem,
          {
            transform: [{ scale }, { translateY }],
            opacity,
          },
        ]}
      >
        <Text style={[
          styles.personText,
          item.isNew && styles.addNewText
        ]}>
          {item.name}
        </Text>
      </Animated.View>
    );
  };

  const renderRoleItem = (role, index) => {
    const inputRange = [
      (index - 1) * ITEM_HEIGHT,
      index * ITEM_HEIGHT,
      (index + 1) * ITEM_HEIGHT,
    ];

    const scale = roleScrollY.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = roleScrollY.interpolate({
      inputRange,
      outputRange: [0.4, 1, 0.4],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        key={role}
        style={[
          styles.roleItem,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        <Text style={styles.roleText}>{role}</Text>
      </Animated.View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.wheelContainer}>
        {/* Role Picker - Vertical */}
        <View style={styles.roleSection}>
          <Text style={styles.sectionLabel}>Employee Type</Text>
          <View style={styles.roleWheel}>
            <View style={styles.selectionIndicator} />
            <PanGestureHandler onGestureEvent={handleRoleGesture}>
              <Animated.View style={styles.roleScrollView}>
                {roles.map((role, index) => renderRoleItem(role, index))}
              </Animated.View>
            </PanGestureHandler>
          </View>
        </View>

        {/* Person Carousel - Horizontal */}
        <View style={styles.personSection}>
          <Text style={styles.sectionLabel}>Employees</Text>
          <View style={styles.carouselContainer}>
            <View style={styles.carouselSelectionIndicator} />
            <PanGestureHandler onGestureEvent={handlePersonGesture}>
              <Animated.View style={styles.carouselScrollView}>
                {allItems.map((item, index) => renderPersonItem(item, index))}
              </Animated.View>
            </PanGestureHandler>
          </View>
        </View>

        {/* New Person Input */}
        {isAddingNew && (
          <View style={styles.newPersonInput}>
            <Text style={styles.inputLabel}>Enter Name for {currentRole}</Text>
            <TextInput
              style={styles.nameInput}
              value={newPersonName}
              onChangeText={setNewPersonName}
              placeholder="Type name here..."
              placeholderTextColor="#C7C7CC"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={() => {
                if (newPersonName.trim()) {
                  // Handle adding new person
                  setIsAddingNew(false);
                  setNewPersonName('');
                }
              }}
            />
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wheelContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  roleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  personSection: {
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 16,
  },
  roleWheel: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: ITEM_WIDTH * 0.8,
    overflow: 'hidden',
    position: 'relative',
  },
  carouselContainer: {
    height: CAROUSEL_HEIGHT,
    width: width * 0.9,
    overflow: 'hidden',
    position: 'relative',
  },
  selectionIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 8,
    zIndex: 1,
  },
  carouselSelectionIndicator: {
    position: 'absolute',
    top: 10,
    left: width * 0.45 - ITEM_WIDTH / 2,
    width: ITEM_WIDTH,
    height: 60,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
    zIndex: 1,
  },
  roleScrollView: {
    height: ITEM_HEIGHT * 2, // Fixed for 2 roles (Bartender, Barback)
  },
  carouselScrollView: {
    height: CAROUSEL_HEIGHT,
    width: ITEM_WIDTH * 100, // Large enough for many items
  },
  roleItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  personItem: {
    width: ITEM_WIDTH,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    marginHorizontal: 8,
  },
  roleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  personText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
  addNewText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  newPersonInput: {
    position: 'absolute',
    bottom: -80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  nameInput: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    paddingVertical: 8,
    minWidth: 200,
  },
});

export default WheelPicker; 