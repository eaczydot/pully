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
  const [entryMode, setEntryMode] = useState('name'); // 'name' or 'hours'
  const [nameInput, setNameInput] = useState('');
  const [hoursInput, setHoursInput] = useState('0');

  const addNewStaff = () => {
    if (!nameInput.trim()) {
      Alert.alert('Missing Name', 'Please enter a name for the support staff');
      return;
    }

    const hours = parseFloat(hoursInput) || 0;
    if (hours <= 0) {
      Alert.alert('Invalid Hours', 'Please enter valid hours worked');
      return;
    }

    const newStaff = {
      id: Date.now(),
      name: nameInput.trim(),
      hours: hours
    };

    setTipData(prev => ({
      ...prev,
      supportStaff: [...prev.supportStaff, newStaff]
    }));

    // Reset for next entry
    setNameInput('');
    setHoursInput('0');
    setEntryMode('name');
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

  const deleteStaff = (index) => {
    Alert.alert(
      'Remove Support Staff',
      'Are you sure you want to remove this support staff member?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setTipData(prev => ({
              ...prev,
              supportStaff: prev.supportStaff.filter((_, i) => i !== index)
            }));
          }
        }
      ]
    );
  };

  const totalHours = tipData.supportStaff.reduce((sum, s) => sum + s.hours, 0);
  const supportTipPool = tipData.totalTips * (tipData.supportStaffPercentage / 100);
  const isValidEntry = nameInput.trim() && parseFloat(hoursInput) > 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onPrevious} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Add Support Staff</Text>
          <Text style={styles.headerSubtitle}>
            Support pool: ${supportTipPool.toFixed(2)} ({tipData.supportStaffPercentage}%)
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Entry Section */}
      <View style={styles.entrySection}>
        {entryMode === 'name' ? (
          <View style={styles.nameEntry}>
            <Text style={styles.inputLabel}>Support Staff Name</Text>
            <TextInput
              style={styles.nameInput}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Enter name"
              placeholderTextColor="#C7C7CC"
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
                style={styles.nextButton}
                onPress={() => setEntryMode('hours')}
              >
                <Text style={styles.nextButtonText}>Next: Hours</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.hoursEntry}>
            <Text style={styles.inputLabel}>Hours Worked</Text>
            <Text style={styles.nameDisplay}>{nameInput}</Text>
            <Text style={styles.hoursDisplay}>{hoursInput} hours</Text>
            <TouchableOpacity 
              style={[styles.addButton, !isValidEntry && styles.addButtonDisabled]}
              onPress={addNewStaff}
              disabled={!isValidEntry}
            >
              <Text style={[styles.addButtonText, !isValidEntry && styles.addButtonTextDisabled]}>
                Add Support Staff
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.backToNameButton}
              onPress={() => setEntryMode('name')}
            >
              <Text style={styles.backToNameButtonText}>← Back to Name</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Support Staff List */}
      {tipData.supportStaff.length > 0 && (
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>Added Support Staff ({tipData.supportStaff.length})</Text>
          <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
            {tipData.supportStaff.map((staff, index) => {
              const percentage = totalHours > 0 ? (staff.hours / totalHours) * 100 : 0;
              const tipAmount = supportTipPool * (percentage / 100);
              
              return (
                <View key={staff.id} style={styles.staffCard}>
                  <View style={styles.staffInfo}>
                    <Text style={styles.staffName}>{staff.name}</Text>
                    <Text style={styles.staffDetails}>
                      {staff.hours} hours • {percentage.toFixed(1)}%
                    </Text>
                    <Text style={styles.staffAmount}>
                      ${tipAmount.toFixed(2)}
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
        </View>
      )}

      {/* Continue Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={onNext}
        >
          <Text style={styles.continueButtonText}>
            Calculate Results
          </Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
  },
  backButtonText: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  placeholder: {
    width: 44,
  },
  entrySection: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  nameEntry: {
    alignItems: 'center',
  },
  hoursEntry: {
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 16,
    fontWeight: '500',
  },
  nameInput: {
    fontSize: 24,
    fontWeight: '400',
    color: '#000000',
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#FF9500',
    paddingVertical: 12,
    minWidth: 200,
    marginBottom: 24,
  },
  nameDisplay: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  hoursDisplay: {
    fontSize: 40,
    fontWeight: '300',
    color: '#000000',
    marginBottom: 24,
  },
  nextButton: {
    backgroundColor: '#FF9500',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
    marginBottom: 16,
  },
  addButtonDisabled: {
    backgroundColor: '#F0F0F0',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonTextDisabled: {
    color: '#C7C7CC',
  },
  backToNameButton: {
    paddingVertical: 12,
  },
  backToNameButtonText: {
    color: '#FF9500',
    fontSize: 16,
    fontWeight: '500',
  },
  listSection: {
    flex: 1,
    paddingHorizontal: 24,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
  },
  staffCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  staffDetails: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  staffAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF9500',
  },
  deleteButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#FF6B6B',
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SupportStaffScreen;