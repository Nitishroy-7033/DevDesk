import apiClient, { authAPI } from './ApiClient';

// Task API methods
export const taskAPI = {
  async getTasks(userId = null) {
    try {
      const response = await apiClient.get('/Task/all', {
        params: userId ? { userId } : {}
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    }
  },

  async getUpcomingTasks(date, status = null) {
    try {
      const params = { date };
      if (status && status !== "All") {
        params.status = status;
      }
      
      const response = await apiClient.get('/Task/upcoming', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch upcoming tasks');
    }
  },

  async getTask(id) {
    try {
      const response = await apiClient.get(`/Task/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch task');
    }
  },

  async createTask(taskData) {
    try {
      const response = await apiClient.post('/Task', taskData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create task');
    }
  },

  async updateTask(id, updates) {
    try {
      const response = await apiClient.put(`/Task/${id}`, updates);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update task');
    }
  },

  async deleteTask(id) {
    try {
      const response = await apiClient.delete(`/Task/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete task');
    }
  },

  async executeTask(taskData) {
    try {
      const response = await apiClient.post('/Task/execute', taskData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to execute task');
    }
  },

  async getTaskHistory(userId) {
    try {
      const response = await apiClient.get(`/Task/history/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch task history');
    }
  },

  async logHours(logData) {
    try {
      const response = await apiClient.post('/Task/log-hours', logData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to log hours');
    }
  },

  async completeTask(taskData) {
    try {
      const response = await apiClient.post('/Task/complete', taskData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to complete task');
    }
  }
};

// User API methods
export const userAPI = {
  async getUser(id) {
    try {
      const response = await apiClient.get(`/User/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  },

  async getUserByPhone(phone) {
    try {
      const response = await apiClient.get(`/User/phone/${phone}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  },

  async getAllUsers() {
    try {
      const response = await apiClient.get('/User/all');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  async updatePreferences(id, preferences) {
    try {
      const response = await apiClient.put(`/User/${id}/preferences`, preferences);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update preferences');
    }
  },

  async incrementTasksCreated(id) {
    try {
      const response = await apiClient.post(`/User/${id}/tasks-created`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update task count');
    }
  },

  async incrementTasksCompleted(id) {
    try {
      const response = await apiClient.post(`/User/${id}/tasks-completed`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update completed count');
    }
  },

  async logHours(id, hours) {
    try {
      const response = await apiClient.post(`/User/${id}/log-hours?hours=${hours}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to log hours');
    }
  },

  async deleteUser(id) {
    try {
      const response = await apiClient.delete(`/User/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  }
};

// Export auth API for convenience
export { authAPI };

// Export the main client for direct use if needed
export default apiClient;
