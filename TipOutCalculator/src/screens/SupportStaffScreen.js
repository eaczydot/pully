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

const SupportStaffScreen = ({ tipData, setTipData, onNext, onPrevious }) => {
  const [currentStaff, setCurrentStaff] = useState(0);
  const [entryMode, setEntryMode] = useState('name'); // 'name' or 'hours'
  const [nameInput, setNameInput] = useState('');
  const [hoursInput, setHoursInput] = useState('0');

  const addNewStaff = () => {
    const newStaff = {
      id: Date.now(),
      name: '',
      hours: 0
    };
    setTipData(prev => ({
      ...prev,
      supportStaff: [...prev.supportStaff, newStaff]
    }));
    setCurrentStaff(tipData.supportStaff.length);
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

  const saveStaff = () => {
    if (!nameInput.trim()) {
      Alert.alert('Error', 'Please enter a name for the support staff');
      return;
    }

    const hours = parseFloat(hoursInput) || 0;
    if (hours <= 0) {
      Alert.alert('Error', 'Please enter valid hours worked');
      return;
    }

    setTipData(prev => ({
      ...prev,
      supportStaff: prev.supportStaff.map((staff, index) => 
        index === currentStaff 
          ? { ...staff, name: nameInput.trim(), hours }
          : staff
      )
    }));

    // Reset for next entry
    setNameInput('');
    setHoursInput('0');
    setEntryMode('name');
  };

  const deleteStaff = (index) => {
    setTipData(prev => ({
      ...prev,
      supportStaff: prev.supportStaff.filter((_, i) => i !== index)
    }));
    if (currentStaff >= tipData.supportStaff.length - 1) {
      setCurrentStaff(Math.max(0, tipData.supportStaff.length - 2));
    }
  };

  const totalHours = tipData.supportStaff.reduce((sum, s) => sum + s.hours, 0);
  const supportTipPool = tipData.totalTips * (tipData.supportStaffPercentage / 100);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onPrevious} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Support Staff {currentStaff + 1}
        </Text>
        <TouchableOpacity onPress={addNewStaff} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Support Staff Pool Info */}
      <View style={styles.poolInfo}>
        <Text style={styles.poolText}>
          Support Staff Pool: ${supportTipPool.toFixed(2)} ({tipData.supportStaffPercentage}% of total)
        </Text>
      </View>

      {/* Current Staff Display */}
      <View style={styles.displayContainer}>
        {entryMode === 'name' ? (
          <View style={styles.nameEntry}>
            <Text style={styles.labelText}>Support Staff Name</Text>
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
              onPress={saveStaff}
            >
              <Text style={styles.saveButtonText}>Save Support Staff</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Support Staff List */}
      <ScrollView style={styles.listContainer}>
        {tipData.supportStaff.map((staff, index) => {
          const percentage = totalHours > 0 ? (staff.hours / totalHours) * 100 : 0;
          const tipAmount = supportTipPool * (percentage / 100);
          
          return (
            <View key={staff.id} style={styles.staffItem}>
              <View style={styles.staffInfo}>
                <Text style={styles.staffName}>{staff.name}</Text>
                <Text style={styles.staffHours}>{staff.hours} hours</Text>
                <Text style={styles.staffPercentage}>
                  {percentage.toFixed(1)}% • ${tipAmount.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => deleteStaff(index)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.continueMainButton} onPress={onNext}>
          <Text style={styles.continueMainButtonText}>Calculate Results</Text>
        </TouchableOpacity>
      </View>

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
  poolInfo: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F2F2F7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E7',
  },
  poolText: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
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
  staffItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E7',
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000',
  },
  staffHours: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 2,
  },
  staffPercentage: {
    fontSize: 13,
    color: '#FF9500',
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

export default SupportStaffScreen;