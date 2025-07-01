import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import WheelPicker from './WheelPicker';

const WheelPickerDemo = () => {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedRole, setSelectedRole] = useState('Bartender');

  // Sample data for demonstration
  const sampleData = [
    { id: 1, name: 'Alice', role: 'Bartender', hours: 8 },
    { id: 2, name: 'Bob', role: 'Bartender', hours: 6 },
    { id: 3, name: 'Charlie', role: 'Barback', hours: 4 },
    { id: 4, name: 'Diana', role: 'Barback', hours: 5 },
  ];

  const handlePersonSelect = (person) => {
    setSelectedPerson(person);
    console.log('Selected person:', person);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    console.log('Selected role:', role);
  };

  const handleAddNew = () => {
    console.log('Add new person for role:', selectedRole);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wheel Picker Demo</Text>
      <Text style={styles.subtitle}>
        Swipe up/down to change roles, swipe left/right to select people
      </Text>

      <View style={styles.wheelContainer}>
        <WheelPicker
          data={sampleData}
          currentRole={selectedRole}
          onRoleSelect={handleRoleSelect}
          onPersonSelect={handlePersonSelect}
          onAddNew={handleAddNew}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Current Selection:</Text>
        <Text style={styles.infoText}>Role: {selectedRole}</Text>
        <Text style={styles.infoText}>
          Person: {selectedPerson ? selectedPerson.name : 'None selected'}
        </Text>
        {selectedPerson && (
          <Text style={styles.infoText}>
            Hours: {selectedPerson.hours}
          </Text>
        )}
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>How to use:</Text>
        <Text style={styles.instructionText}>• Swipe UP/DOWN on left wheel to change role</Text>
        <Text style={styles.instructionText}>• Swipe LEFT/RIGHT on carousel to select person</Text>
        <Text style={styles.instructionText}>• "+ Add New" appears at the end of person list</Text>
        <Text style={styles.instructionText}>• Smooth animations provide visual feedback</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 32,
  },
  wheelContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  infoContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 4,
  },
  instructions: {
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
});

export default WheelPickerDemo; 