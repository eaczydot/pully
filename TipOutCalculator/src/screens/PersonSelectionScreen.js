import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  TextInput
} from 'react-native';
import WheelPicker from '../components/WheelPicker';
import Keypad from '../components/Keypad';

const PersonSelectionScreen = ({ tipData, setTipData, onNext, onPrevious }) => {
  const [currentRole, setCurrentRole] = useState('Bartender');
  const [currentPerson, setCurrentPerson] = useState(null);
  const [entryMode, setEntryMode] = useState('selection'); // 'selection' or 'hours'
  const [hoursInput, setHoursInput] = useState('0');
  const [newPersonName, setNewPersonName] = useState('');

  // Combine all people with their roles
  const allPeople = [
    ...tipData.bartenders.map(person => ({ ...person, role: 'Bartender' })),
    ...tipData.supportStaff.map(person => ({ ...person, role: 'Barback' }))
  ];

  const handleRoleSelect = (role) => {
    setCurrentRole(role);
    setCurrentPerson(null);
    setEntryMode('selection');
  };

  const handlePersonSelect = (person) => {
    setCurrentPerson(person);
    setEntryMode('hours');
    setHoursInput(person.hours ? person.hours.toString() : '0');
  };

  const handleAddNew = () => {
    setEntryMode('newPerson');
  };

  const handleAddNewPerson = () => {
    if (!newPersonName.trim()) {
      Alert.alert('Missing Name', 'Please enter a name for the person');
      return;
    }

    const newPerson = {
      id: Date.now(),
      name: newPersonName.trim(),
      role: currentRole,
      hours: 0
    };

    if (currentRole === 'Bartender') {
      setTipData(prev => ({
        ...prev,
        bartenders: [...prev.bartenders, newPerson]
      }));
    } else {
      setTipData(prev => ({
        ...prev,
        supportStaff: [...prev.supportStaff, newPerson]
      }));
    }

    setCurrentPerson(newPerson);
    setNewPersonName('');
    setEntryMode('hours');
    setHoursInput('0');
  };

  const handleSaveHours = () => {
    if (!currentPerson) return;

    const hours = parseFloat(hoursInput) || 0;
    if (hours <= 0) {
      Alert.alert('Invalid Hours', 'Please enter valid hours worked');
      return;
    }

    const updatedPerson = { ...currentPerson, hours };

    if (currentRole === 'Bartender') {
      setTipData(prev => ({
        ...prev,
        bartenders: prev.bartenders.map(p => 
          p.id === currentPerson.id ? updatedPerson : p
        )
      }));
    } else {
      setTipData(prev => ({
        ...prev,
        supportStaff: prev.supportStaff.map(p => 
          p.id === currentPerson.id ? updatedPerson : p
        )
      }));
    }

    setCurrentPerson(updatedPerson);
    setEntryMode('selection');
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

  const deletePerson = (person) => {
    Alert.alert(
      'Remove Person',
      `Are you sure you want to remove ${person.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            if (person.role === 'Bartender') {
              setTipData(prev => ({
                ...prev,
                bartenders: prev.bartenders.filter(p => p.id !== person.id)
              }));
            } else {
              setTipData(prev => ({
                ...prev,
                supportStaff: prev.supportStaff.filter(p => p.id !== person.id)
              }));
            }
            setCurrentPerson(null);
            setEntryMode('selection');
          }
        }
      ]
    );
  };

  const getRolePool = () => {
    if (currentRole === 'Bartender') {
      return tipData.totalTips * 0.8; // 80% for bartenders
    } else {
      return tipData.totalTips * (tipData.supportStaffPercentage / 100);
    }
  };

  const getRolePercentage = () => {
    if (currentRole === 'Bartender') {
      return 100 - tipData.supportStaffPercentage;
    } else {
      return tipData.supportStaffPercentage;
    }
  };

  const rolePool = getRolePool();
  const rolePercentage = getRolePercentage();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onPrevious} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Add People</Text>
          <Text style={styles.headerSubtitle}>
            {currentRole} pool: ${rolePool.toFixed(2)} ({rolePercentage}%)
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Wheel Picker Section */}
      {entryMode === 'selection' && (
        <View style={styles.wheelSection}>
          <WheelPicker
            data={allPeople}
            currentRole={currentRole}
            onRoleSelect={handleRoleSelect}
            onPersonSelect={handlePersonSelect}
            onAddNew={handleAddNew}
          />
        </View>
      )}

      {/* New Person Input */}
      {entryMode === 'newPerson' && (
        <View style={styles.newPersonSection}>
          <Text style={styles.inputLabel}>Enter Name for {currentRole}</Text>
          <TextInput
            style={styles.nameInput}
            value={newPersonName}
            onChangeText={setNewPersonName}
            placeholder="Type name here..."
            placeholderTextColor="#C7C7CC"
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleAddNewPerson}
          />
          <TouchableOpacity 
            style={[styles.addButton, !newPersonName.trim() && styles.addButtonDisabled]}
            onPress={handleAddNewPerson}
            disabled={!newPersonName.trim()}
          >
            <Text style={[styles.addButtonText, !newPersonName.trim() && styles.addButtonTextDisabled]}>
              Add {currentRole}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setEntryMode('selection')}
          >
            <Text style={styles.backButtonText}>← Back to Selection</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Hours Entry */}
      {entryMode === 'hours' && currentPerson && (
        <View style={styles.hoursSection}>
          <Text style={styles.inputLabel}>Hours Worked</Text>
          <Text style={styles.nameDisplay}>{currentPerson.name}</Text>
          <Text style={styles.roleDisplay}>{currentPerson.role}</Text>
          <Text style={styles.hoursDisplay}>{hoursInput} hours</Text>
          <TouchableOpacity 
            style={[styles.saveButton, parseFloat(hoursInput) <= 0 && styles.saveButtonDisabled]}
            onPress={handleSaveHours}
            disabled={parseFloat(hoursInput) <= 0}
          >
            <Text style={[styles.saveButtonText, parseFloat(hoursInput) <= 0 && styles.saveButtonTextDisabled]}>
              Save Hours
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.backToSelectionButton}
            onPress={() => setEntryMode('selection')}
          >
            <Text style={styles.backToSelectionButtonText}>← Back to Selection</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* People List */}
      <View style={styles.listSection}>
        <Text style={styles.listTitle}>Added People ({allPeople.length})</Text>
        <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
          {allPeople.map((person) => {
            const rolePool = person.role === 'Bartender' 
              ? tipData.totalTips * 0.8 
              : tipData.totalTips * (tipData.supportStaffPercentage / 100);
            
            const totalHours = person.role === 'Bartender'
              ? tipData.bartenders.reduce((sum, p) => sum + p.hours, 0)
              : tipData.supportStaff.reduce((sum, p) => sum + p.hours, 0);
            
            const percentage = totalHours > 0 ? (person.hours / totalHours) * 100 : 0;
            const tipAmount = rolePool * (percentage / 100);
            
            return (
              <View key={person.id} style={[
                styles.personCard,
                person.role === 'Barback' && styles.supportPersonCard
              ]}>
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>{person.name}</Text>
                  <Text style={styles.personRole}>{person.role}</Text>
                  <Text style={styles.personDetails}>
                    {person.hours} hours • {percentage.toFixed(1)}%
                  </Text>
                  <Text style={[
                    styles.personAmount,
                    person.role === 'Barback' && styles.supportAmount
                  ]}>
                    ${tipAmount.toFixed(2)}
                  </Text>
                </View>
                <TouchableOpacity 
                  onPress={() => deletePerson(person)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>

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
  wheelSection: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  newPersonSection: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  hoursSection: {
    paddingHorizontal: 24,
    paddingVertical: 32,
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
  roleDisplay: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  hoursDisplay: {
    fontSize: 40,
    fontWeight: '300',
    color: '#000000',
    marginBottom: 24,
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
  saveButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
    marginBottom: 16,
  },
  saveButtonDisabled: {
    backgroundColor: '#F0F0F0',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: '#C7C7CC',
  },
  backToSelectionButton: {
    paddingVertical: 12,
  },
  backToSelectionButtonText: {
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
  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  supportPersonCard: {
    backgroundColor: '#FFF8F0',
    borderLeftColor: '#FF9500',
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  personRole: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
    fontWeight: '500',
  },
  personDetails: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  personAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  supportAmount: {
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

export default PersonSelectionScreen; 