import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class PushNotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  // Initialize push notifications
  async initialize() {
    try {
      // Register for push notifications
      this.expoPushToken = await this.registerForPushNotificationsAsync();
      
      // Store token for sending notifications
      if (this.expoPushToken) {
        await AsyncStorage.setItem('expoPushToken', this.expoPushToken);
      }

      // Listen for incoming notifications
      this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification received:', notification);
      });

      // Listen for notification responses (when user taps notification)
      this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;
        this.handleNotificationResponse(data);
      });

      return this.expoPushToken;
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      return null;
    }
  }

  // Register for push notifications
  async registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#00D4AA',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return null;
      }
      
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('Must use physical device for Push Notifications');
    }

    return token;
  }

  // Send notification to all workers when calculations are complete
  async sendEndOfNightNotification(calculationData) {
    try {
      const { workers, totalAmount, cashAmount, cardAmount, date, venue } = calculationData;
      
      // Get all stored push tokens for workers
      const notifications = [];
      
      for (const worker of workers) {
        const workerToken = await this.getWorkerPushToken(worker.id);
        if (workerToken) {
          const notification = this.createNotificationForWorker(worker, {
            totalAmount,
            cashAmount,
            cardAmount,
            date,
            venue,
            allWorkers: workers
          });
          
          notifications.push({
            to: workerToken,
            ...notification
          });
        }
      }

      // Send all notifications
      const results = await Promise.allSettled(
        notifications.map(notification => this.sendPushNotification(notification))
      );

      console.log(`Sent ${results.length} end-of-night notifications`);
      return results;
    } catch (error) {
      console.error('Error sending end-of-night notifications:', error);
      throw error;
    }
  }

  // Create personalized notification for each worker
  createNotificationForWorker(worker, data) {
    const { totalAmount, cashAmount, cardAmount, date } = data;
    
    return {
      title: "Shifty - Your Night's Complete! 🍺",
      body: `You earned $${worker.totalEarnings.toFixed(2)} tonight (Cash: $${worker.cashEarnings.toFixed(2)}, Card: $${worker.cardEarnings.toFixed(2)})`,
      data: {
        type: 'end_of_night',
        workerId: worker.id,
        workerRole: worker.role,
        workerEarnings: {
          total: worker.totalEarnings,
          cash: worker.cashEarnings,
          card: worker.cardEarnings
        },
        venueData: {
          totalAmount,
          cashAmount,
          cardAmount,
          date,
          allWorkers: data.allWorkers
        }
      },
      sound: 'default',
      priority: 'high',
    };
  }

  // Send individual push notification
  async sendPushNotification(notification) {
    const message = {
      to: notification.to,
      sound: 'default',
      title: notification.title,
      body: notification.body,
      data: notification.data,
      priority: 'high',
      channelId: 'default',
    };

    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  }

  // Handle notification response (when user taps notification)
  handleNotificationResponse(data) {
    if (data.type === 'end_of_night') {
      // Navigate to full tipout sheet with role-based filtering
      this.navigateToTipoutSheet(data);
    }
  }

  // Navigate to tipout sheet with role-based view
  navigateToTipoutSheet(notificationData) {
    const { workerRole, venueData } = notificationData;
    
    // Filter workers based on role
    const filteredWorkers = this.filterWorkersByRole(venueData.allWorkers, workerRole);
    
    // Navigate to ResultsScreen with filtered data
    // This would integrate with your navigation system
    console.log('Navigating to tipout sheet with filtered data:', {
      role: workerRole,
      workers: filteredWorkers,
      venue: venueData
    });
    
    // Example navigation (you'll need to adapt this to your navigation setup)
    // navigation.navigate('ResultsScreen', {
    //   tipoutData: {
    //     ...venueData,
    //     workers: filteredWorkers,
    //     viewerRole: workerRole
    //   }
    // });
  }

  // Filter workers based on role for role-based view
  filterWorkersByRole(allWorkers, viewerRole) {
    // Group workers by role
    const workersByRole = allWorkers.reduce((acc, worker) => {
      if (!acc[worker.role]) acc[worker.role] = [];
      acc[worker.role].push(worker);
      return acc;
    }, {});

    // Return full breakdown for viewer's role, summary for others
    const result = {};
    
    Object.keys(workersByRole).forEach(role => {
      if (role === viewerRole) {
        // Full breakdown for same role
        result[role] = {
          type: 'detailed',
          workers: workersByRole[role]
        };
      } else {
        // Summary for other roles
        const roleTotal = workersByRole[role].reduce((sum, worker) => sum + worker.totalEarnings, 0);
        const roleCash = workersByRole[role].reduce((sum, worker) => sum + worker.cashEarnings, 0);
        const roleCard = workersByRole[role].reduce((sum, worker) => sum + worker.cardEarnings, 0);
        
        result[role] = {
          type: 'summary',
          count: workersByRole[role].length,
          totals: {
            total: roleTotal,
            cash: roleCash,
            card: roleCard
          }
        };
      }
    });

    return result;
  }

  // Store worker push token
  async storeWorkerPushToken(workerId, pushToken) {
    try {
      await AsyncStorage.setItem(`worker_token_${workerId}`, pushToken);
    } catch (error) {
      console.error('Error storing worker push token:', error);
    }
  }

  // Get worker push token
  async getWorkerPushToken(workerId) {
    try {
      return await AsyncStorage.getItem(`worker_token_${workerId}`);
    } catch (error) {
      console.error('Error getting worker push token:', error);
      return null;
    }
  }

  // Register worker for notifications
  async registerWorker(workerId, role, name) {
    try {
      const pushToken = await this.registerForPushNotificationsAsync();
      if (pushToken) {
        await this.storeWorkerPushToken(workerId, pushToken);
        
        // Store worker info
        await AsyncStorage.setItem(`worker_info_${workerId}`, JSON.stringify({
          id: workerId,
          role,
          name,
          registeredAt: new Date().toISOString()
        }));
        
        return pushToken;
      }
    } catch (error) {
      console.error('Error registering worker:', error);
      return null;
    }
  }

  // Clean up listeners
  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }
}

// Export singleton instance
export default new PushNotificationService();