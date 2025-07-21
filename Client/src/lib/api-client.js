// API Client for handling all API calls
// This is a mock implementation that simulates API calls with localStorage

const API_BASE_URL = '/api';
const MOCK_DELAY = 500; // Simulate network delay

// Mock data storage keys
const STORAGE_KEYS = {
  TASKS: 'studyplanner_tasks',
  USERS: 'studyplanner_users',
  SETTINGS: 'studyplanner_settings'
};

// Utility functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getFromStorage = (key, defaultValue = []) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage: ${error.message}`);
    return defaultValue;
  }
};

const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage: ${error.message}`);
  }
};

const generateId = () => Date.now().toString();

// API Client class
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  // Authentication methods
  async login(credentials) {
    await delay(MOCK_DELAY);
    
    // Mock authentication
    if (credentials.email === 'demo@studyplanner.com' && credentials.password === 'demo123') {
      const user = {
        id: '1',
        name: 'Demo User',
        email: 'demo@studyplanner.com',
        token: 'mock-jwt-token'
      };
      
      setToStorage('auth_user', user);
      return user;
    }
    
    throw new Error('Invalid credentials');
  }

  async logout() {
    await delay(MOCK_DELAY);
    localStorage.removeItem('auth_user');
    return { success: true };
  }

  async getCurrentUser() {
    await delay(MOCK_DELAY);
    return getFromStorage('auth_user', null);
  }

  // Task methods
  async getTasks(userId = null) {
    await delay(MOCK_DELAY);
    
    let tasks = getFromStorage(STORAGE_KEYS.TASKS, []);
    
    if (userId) {
      tasks = tasks.filter(task => task.userId === userId);
    }
    
    return tasks;
  }

  async getTask(id) {
    await delay(MOCK_DELAY);
    
    const tasks = getFromStorage(STORAGE_KEYS.TASKS, []);
    const task = tasks.find(t => t.id.toString() === id.toString());
    
    if (!task) {
      throw new Error('Task not found');
    }
    
    return task;
  }

  async createTask(taskData) {
    await delay(MOCK_DELAY);
    
    const tasks = getFromStorage(STORAGE_KEYS.TASKS, []);
    const newTask = {
      ...taskData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    setToStorage(STORAGE_KEYS.TASKS, tasks);
    
    return newTask;
  }

  async updateTask(id, updates) {
    await delay(MOCK_DELAY);
    
    const tasks = getFromStorage(STORAGE_KEYS.TASKS, []);
    const taskIndex = tasks.findIndex(t => t.id.toString() === id.toString());
    
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    tasks[taskIndex] = updatedTask;
    setToStorage(STORAGE_KEYS.TASKS, tasks);
    
    return updatedTask;
  }

  async deleteTask(id) {
    await delay(MOCK_DELAY);
    
    const tasks = getFromStorage(STORAGE_KEYS.TASKS, []);
    const filteredTasks = tasks.filter(t => t.id.toString() !== id.toString());
    
    if (tasks.length === filteredTasks.length) {
      throw new Error('Task not found');
    }
    
    setToStorage(STORAGE_KEYS.TASKS, filteredTasks);
    
    return { success: true };
  }

  // User methods
  async getUsers() {
    await delay(MOCK_DELAY);
    return getFromStorage(STORAGE_KEYS.USERS, []);
  }

  async getUser(id) {
    await delay(MOCK_DELAY);
    
    const users = getFromStorage(STORAGE_KEYS.USERS, []);
    const user = users.find(u => u.id.toString() === id.toString());
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  async updateUser(id, updates) {
    await delay(MOCK_DELAY);
    
    const users = getFromStorage(STORAGE_KEYS.USERS, []);
    const userIndex = users.findIndex(u => u.id.toString() === id.toString());
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const updatedUser = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    users[userIndex] = updatedUser;
    setToStorage(STORAGE_KEYS.USERS, users);
    
    return updatedUser;
  }

  // Analytics methods
  async getUserStats(userId) {
    await delay(MOCK_DELAY);
    
    const tasks = await this.getTasks(userId);
    const completedTasks = tasks.filter(task => task.status === 'completed');
    
    const totalTimeSpent = completedTasks.reduce((total, task) => total + (task.timeSpent || 0), 0);
    const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
    
    // Calculate weekly stats (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyCompletedTasks = completedTasks.filter(task => 
      new Date(task.completedAt) >= weekAgo
    );
    
    const weeklyTimeSpent = weeklyCompletedTasks.reduce((total, task) => total + (task.timeSpent || 0), 0);
    
    // Calculate monthly stats (last 30 days)
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    
    const monthlyCompletedTasks = completedTasks.filter(task => 
      new Date(task.completedAt) >= monthAgo
    );
    
    const monthlyTimeSpent = monthlyCompletedTasks.reduce((total, task) => total + (task.timeSpent || 0), 0);
    
    return {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      totalTimeSpent,
      completionRate,
      weeklyStats: {
        tasksCompleted: weeklyCompletedTasks.length,
        timeSpent: weeklyTimeSpent
      },
      monthlyStats: {
        tasksCompleted: monthlyCompletedTasks.length,
        timeSpent: monthlyTimeSpent
      }
    };
  }

  async getTasksByCategory(category) {
    await delay(MOCK_DELAY);
    
    const tasks = getFromStorage(STORAGE_KEYS.TASKS, []);
    return tasks.filter(task => task.category === category);
  }

  async getTimeSpentOnSimilarTasks(category) {
    await delay(MOCK_DELAY);
    
    const tasks = await this.getTasksByCategory(category);
    const completedTasks = tasks.filter(task => task.status === 'completed');
    
    return completedTasks.reduce((total, task) => total + (task.timeSpent || 0), 0);
  }

  async getLeaderboard(period = 'weekly') {
    await delay(MOCK_DELAY);
    
    const users = getFromStorage(STORAGE_KEYS.USERS, []);
    const tasks = getFromStorage(STORAGE_KEYS.TASKS, []);
    
    // Calculate leaderboard based on period
    let startDate;
    if (period === 'weekly') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'monthly') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
    }
    
    const leaderboard = users.map(user => {
      const userTasks = tasks.filter(task => task.userId === user.id);
      const completedTasks = userTasks.filter(task => 
        task.status === 'completed' && 
        (!startDate || new Date(task.completedAt) >= startDate)
      );
      
      const timeSpent = completedTasks.reduce((total, task) => total + (task.timeSpent || 0), 0);
      
      return {
        ...user,
        tasksCompleted: completedTasks.length,
        timeSpent,
        completionRate: userTasks.length > 0 ? (completedTasks.length / userTasks.length) * 100 : 0
      };
    });
    
    return leaderboard.sort((a, b) => b.tasksCompleted - a.tasksCompleted);
  }

  // Settings methods
  async getSettings() {
    await delay(MOCK_DELAY);
    return getFromStorage(STORAGE_KEYS.SETTINGS, {});
  }

  async updateSettings(settings) {
    await delay(MOCK_DELAY);
    
    const currentSettings = getFromStorage(STORAGE_KEYS.SETTINGS, {});
    const updatedSettings = { ...currentSettings, ...settings };
    
    setToStorage(STORAGE_KEYS.SETTINGS, updatedSettings);
    
    return updatedSettings;
  }

  // Helper methods
  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// Export the class for potential extension
export default ApiClient;