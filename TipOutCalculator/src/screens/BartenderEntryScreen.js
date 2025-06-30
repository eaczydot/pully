import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  Alert 
} from 'react-native';
import Keypad from '../components/Keypad';

const BartenderEntryScreen = ({ tipData, setTipData, onNext, onPrevious }) => {
  const [currentBartender, setCurrentBartender] = useState(0);
  const [entryMode, setEntryMode] = useState('name'); // 'name' or 'hours'
  const [nameInput, setNameInput] = useState('');
  const [hoursInput, setHoursInput] = useState('0');

  const addNewBartender = () => {
    const newBartender = {
      id: Date.now(),
      name: '',
      hours: 0
    };
    setTipData(prev => ({
      ...prev,
      bartenders: [...prev.bartenders, newBartender]
    }));
    setCurrentBartender(tipData.bartenders.length);
    setEntryMode('name');
    setNameInput('');
    setHoursInput('0');
  };

  const handleNumberPress = (number) => {
    if (entryMode === 'hours') {
      if (hoursInput === '0') {
        setHoursInput(number);
      } else {
        setHoursInput(hoursInput + number);
      }
    }
  };

  const handleDecimalPress = () => {
    if (entryMode === 'hours' && !hoursInput.includes('.')) {
      setHoursInput(hoursInput + '.');
    }
  };

  const handleDeletePress = () => {
    if (entryMode === 'hours') {
      if (hoursInput.length > 1) {
        setHoursInput(hoursInput.slice(0, -1));
      } else {
        setHoursInput('0');
      }
    }
  };

  const saveBartender = () => {
    if (!nameInput.trim()) {
      Alert.alert('Error', 'Please enter a name for the bartender');
      return;
    }

    const hours = parseFloat(hoursInput) || 0;
    if (hours <= 0) {
      Alert.alert('Error', 'Please enter valid hours worked');
      return;
    }

    setTipData(prev => ({
      ...prev,
      bartenders: prev.bartenders.map((bartender, index) => 
        index === currentBartender 
          ? { ...bartender, name: nameInput.trim(), hours }
          : bartender
      )
    }));

    // Reset for next entry
    setNameInput('');
    setHoursInput('0');
    setEntryMode('name');
  };

  const deleteBartender = (index) => {
    setTipData(prev => ({
      ...prev,
      bartenders: prev.bartenders.filter((_, i) => i !== index)
    }));
    if (currentBartender >= tipData.bartenders.length - 1) {
      setCurrentBartender(Math.max(0, tipData.bartenders.length - 2));
    }
  };

  const currentBartenderData = tipData.bartenders[currentBartender];
  const totalHours = tipData.bartenders.reduce((sum, b) => sum + b.hours, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onPrevious} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Bartender {currentBartender + 1}
        </Text>
        <TouchableOpacity onPress={addNewBartender} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Current Bartender Display */}
      <View style={styles.displayContainer}>
        {entryMode === 'name' ? (
          <View style={styles.nameEntry}>
            <Text style={styles.labelText}>Bartender Name</Text>
            <TextInput
              style={styles.nameInput}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Enter name"
              placeholderTextColor="#8E8E93"
              autoFocus
              returnKeyType="next"
              onSubmitEditing={() => {
                if (nameInput.trim()) {
                  setEntryMode('hours');
                }
              }}
            />
            {nameInput.trim() && (
              <TouchableOpacity 
                style={styles.continueButton}
                onPress={() => setEntryMode('hours')}
              >
                <Text style={styles.continueButtonText}>Set Hours</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.hoursEntry}>
            <Text style={styles.labelText}>Hours Worked</Text>
            <Text style={styles.nameDisplay}>{nameInput}</Text>
            <Text style={styles.hoursDisplay}>{hoursInput} hours</Text>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={saveBartender}
            >
              <Text style={styles.saveButtonText}>Save Bartender</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Bartender List */}
      <ScrollView style={styles.listContainer}>
        {tipData.bartenders.map((bartender, index) => (
          <View key={bartender.id} style={styles.bartenderItem}>
            <View style={styles.bartenderInfo}>
              <Text style={styles.bartenderName}>{bartender.name}</Text>
              <Text style={styles.bartenderHours}>{bartender.hours} hours</Text>
              {totalHours > 0 && (
                <Text style={styles.bartenderPercentage}>
                  {((bartender.hours / totalHours) * 100).toFixed(1)}%
                </Text>
              )}
            </View>
            <TouchableOpacity 
              onPress={() => deleteBartender(index)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Continue Button */}
      {tipData.bartenders.length > 0 && tipData.bartenders.every(b => b.name && b.hours > 0) && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.continueMainButton} onPress={onNext}>
            <Text style={styles.continueMainButtonText}>Continue to Support Staff</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Keypad (only show when entering hours) */}
      {entryMode === 'hours' && (
        <Keypad
          onNumberPress={handleNumberPress}
          onDecimalPress={handleDecimalPress}
          onDeletePress={handleDeletePress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E7',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 28,
    color: '#007AFF',
  },
  displayContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  nameEntry: {
    width: '100%',
    alignItems: 'center',
  },
  hoursEntry: {
    width: '100%',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 15,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: '300',
    color: '#000',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
    paddingVertical: 10,
    minWidth: 200,
    marginBottom: 20,
  },
  nameDisplay: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
    marginBottom: 10,
  },
  hoursDisplay: {
    fontSize: 36,
    fontWeight: '300',
    color: '#000',
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#34C759',
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  bartenderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E7',
  },
  bartenderInfo: {
    flex: 1,
  },
  bartenderName: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000',
  },
  bartenderHours: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 2,
  },
  bartenderPercentage: {
    fontSize: 13,
    color: '#007AFF',
    marginTop: 2,
  },
  deleteButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 24,
    color: '#FF3B30',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  continueMainButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  continueMainButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default BartenderEntryScreen;