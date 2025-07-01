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
  const [entryMode, setEntryMode] = useState('name'); // 'name' or 'hours'
  const [nameInput, setNameInput] = useState('');
  const [hoursInput, setHoursInput] = useState('0');

  const addNewBartender = () => {
    if (!nameInput.trim()) {
      Alert.alert('Missing Name', 'Please enter a name for the bartender');
      return;
    }

    const hours = parseFloat(hoursInput) || 0;
    if (hours <= 0) {
      Alert.alert('Invalid Hours', 'Please enter valid hours worked');
      return;
    }

    const newBartender = {
      id: Date.now(),
      name: nameInput.trim(),
      hours: hours
    };

    setTipData(prev => ({
      ...prev,
      bartenders: [...prev.bartenders, newBartender]
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

  const deleteBartender = (index) => {
    Alert.alert(
      'Remove Bartender',
      'Are you sure you want to remove this bartender?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setTipData(prev => ({
              ...prev,
              bartenders: prev.bartenders.filter((_, i) => i !== index)
            }));
          }
        }
      ]
    );
  };

  const totalHours = tipData.bartenders.reduce((sum, b) => sum + b.hours, 0);
  const bartenderPool = tipData.totalTips * 0.8; // 80% for bartenders
  const canContinue = tipData.bartenders.length > 0;
  const isValidEntry = nameInput.trim() && parseFloat(hoursInput) > 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onPrevious} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Add Bartenders</Text>
          <Text style={styles.headerSubtitle}>
            Bartender pool: ${bartenderPool.toFixed(2)} (80%)
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Entry Section */}
      <View style={styles.entrySection}>
        {entryMode === 'name' ? (
          <View style={styles.nameEntry}>
            <Text style={styles.inputLabel}>Bartender Name</Text>
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
              onPress={addNewBartender}
              disabled={!isValidEntry}
            >
              <Text style={[styles.addButtonText, !isValidEntry && styles.addButtonTextDisabled]}>
                Add Bartender
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

      {/* Bartender List */}
      {tipData.bartenders.length > 0 && (
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>Added Bartenders ({tipData.bartenders.length})</Text>
          <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
            {tipData.bartenders.map((bartender, index) => {
              const percentage = totalHours > 0 ? (bartender.hours / totalHours) * 100 : 0;
              const tipAmount = bartenderPool * (percentage / 100);
              
              return (
                <View key={bartender.id} style={styles.bartenderCard}>
                  <View style={styles.bartenderInfo}>
                    <Text style={styles.bartenderName}>{bartender.name}</Text>
                    <Text style={styles.bartenderDetails}>
                      {bartender.hours} hours • {percentage.toFixed(1)}%
                    </Text>
                    <Text style={styles.bartenderAmount}>
                      ${tipAmount.toFixed(2)}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => deleteBartender(index)}
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
      {canContinue && (
        <View style={styles.bottomSection}>
          <TouchableOpacity 
            style={styles.continueButton} 
            onPress={onNext}
          >
            <Text style={styles.continueButtonText}>
              Continue to Support Staff
            </Text>
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
    borderBottomColor: '#007AFF',
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
    backgroundColor: '#007AFF',
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
    color: '#007AFF',
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
  bartenderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  bartenderInfo: {
    flex: 1,
  },
  bartenderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  bartenderDetails: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  bartenderAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#34C759',
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

export default BartenderEntryScreen;