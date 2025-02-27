// API service for handling all backend requests
import { PublicKey } from '@solana/web3.js';

// Store goals in localStorage to persist between page refreshes
const getStoredGoals = (): Goal[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const storedGoals = localStorage.getItem('mockGoals');
    return storedGoals ? JSON.parse(storedGoals) : defaultMockGoals;
  } catch (error) {
    console.error('Error retrieving goals from localStorage:', error);
    return defaultMockGoals;
  }
};

const saveGoalsToStorage = (goals: Goal[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('mockGoals', JSON.stringify(goals));
  } catch (error) {
    console.error('Error saving goals to localStorage:', error);
  }
};

// Default mock data with time included in deadlines
const defaultMockGoals: Goal[] = [
  {
    id: '1',
    title: 'Learn Solana Development',
    description: 'Complete a Solana development course and build a simple dApp',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(), // 14 days from now at 8:00 AM
    stakingAmount: 0.5,
    progress: 65,
    status: 'active',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    walletAddress: 'mock-wallet-address',
  },
  {
    id: '2',
    title: 'Complete DeFi Project',
    description: 'Finish building and testing my decentralized finance application',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(), // 30 days from now at 2:00 PM
    stakingAmount: 1.2,
    progress: 40,
    status: 'active',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    walletAddress: 'mock-wallet-address',
  },
  {
    id: '3',
    title: 'Daily Blockchain Study',
    description: 'Study blockchain concepts for at least 1 hour every day',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000).toISOString(), // 5 days from now at 6:00 PM
    stakingAmount: 0.3,
    progress: 80,
    status: 'active',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
    walletAddress: 'mock-wallet-address',
  },
  {
    id: '4',
    title: 'Launch NFT Collection',
    description: 'Create and launch a collection of 10 NFTs on Solana',
    deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000).toISOString(), // 5 days ago at 12:00 PM
    stakingAmount: 2.0,
    progress: 100,
    status: 'completed',
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), // 35 days ago
    walletAddress: 'mock-wallet-address',
  },
  {
    id: '5',
    title: 'Contribute to Open Source',
    description: 'Make 5 contributions to Solana open source projects',
    deadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000).toISOString(), // 10 days ago at 4:00 PM
    stakingAmount: 0.8,
    progress: 40,
    status: 'failed',
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days ago
    walletAddress: 'mock-wallet-address',
  }
];

// Initialize mockGoals with stored data or defaults
let mockGoals: Goal[] = [];

// This will be initialized on the client side
if (typeof window !== 'undefined') {
  mockGoals = getStoredGoals();
}

const mockProgressUpdates = [
  {
    id: '101',
    goalId: '1',
    description: 'Completed the first module of the Solana development course',
    progressPercentage: 20,
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
  },
  {
    id: '102',
    goalId: '1',
    description: 'Built a simple wallet integration demo',
    progressPercentage: 40,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
  },
  {
    id: '103',
    goalId: '1',
    description: 'Implemented token transfers in my test application',
    progressPercentage: 65,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: '201',
    goalId: '2',
    description: 'Designed the UI for the DeFi application',
    progressPercentage: 20,
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
  },
  {
    id: '202',
    goalId: '2',
    description: 'Implemented smart contract for token swaps',
    progressPercentage: 40,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: '301',
    goalId: '3',
    description: 'Studied consensus mechanisms',
    progressPercentage: 30,
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
  },
  {
    id: '302',
    goalId: '3',
    description: 'Learned about tokenomics and token design',
    progressPercentage: 50,
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
  },
  {
    id: '303',
    goalId: '3',
    description: "Studied Solana's architecture and performance optimizations",
    progressPercentage: 80,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  }
];

// Types
export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  stakingAmount: number;
  progress: number;
  status: 'active' | 'completed' | 'failed';
  createdAt: string;
  walletAddress: string;
}

export interface ProgressUpdate {
  id: string;
  goalId: string;
  description: string;
  progressPercentage: number;
  date: string;
}

export interface CreateGoalRequest {
  title: string;
  description: string;
  deadline: string;
  stakingAmount: number;
  walletAddress: string;
}

export interface StakeRequest {
  goalId: string;
  amount: number;
  walletAddress: string;
}

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Goal Management
export const goalService = {
  // Create a new goal
  createGoal: async (goalData: CreateGoalRequest): Promise<Goal> => {
    await delay(1000); // Simulate network delay
    
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: goalData.title,
      description: goalData.description,
      deadline: goalData.deadline,
      stakingAmount: goalData.stakingAmount,
      progress: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      walletAddress: goalData.walletAddress,
    };
    
    mockGoals.push(newGoal);
    saveGoalsToStorage(mockGoals);
    return newGoal;
  },

  // Get all goals for a user
  getGoals: async (walletAddress: string): Promise<Goal[]> => {
    await delay(800); // Simulate network delay
    
    // If we're on the client side, refresh mockGoals from localStorage
    if (typeof window !== 'undefined') {
      mockGoals = getStoredGoals();
    }
    
    return mockGoals.filter(goal => goal.walletAddress === walletAddress);
  },

  // Get a specific goal by ID
  getGoalById: async (goalId: string): Promise<Goal> => {
    await delay(500); // Simulate network delay
    
    // If we're on the client side, refresh mockGoals from localStorage
    if (typeof window !== 'undefined') {
      mockGoals = getStoredGoals();
    }
    
    const goal = mockGoals.find(g => g.id === goalId);
    if (!goal) {
      throw new Error('Goal not found');
    }
    return goal;
  },

  // Update a goal
  updateGoal: async (goalId: string, goalData: Partial<Goal>): Promise<Goal> => {
    await delay(800); // Simulate network delay
    
    const goalIndex = mockGoals.findIndex(g => g.id === goalId);
    if (goalIndex === -1) {
      throw new Error('Goal not found');
    }
    
    mockGoals[goalIndex] = {
      ...mockGoals[goalIndex],
      ...goalData,
    };
    
    saveGoalsToStorage(mockGoals);
    return mockGoals[goalIndex];
  },

  // Log progress for a goal
  logProgress: async (goalId: string, progressData: Omit<ProgressUpdate, 'id' | 'goalId' | 'date'>): Promise<ProgressUpdate> => {
    await delay(1000); // Simulate network delay
    
    const newUpdate: ProgressUpdate = {
      id: `progress-${Date.now()}`,
      goalId,
      description: progressData.description,
      progressPercentage: progressData.progressPercentage,
      date: new Date().toISOString(),
    };
    
    mockProgressUpdates.push(newUpdate);
    return newUpdate;
  },

  // Get progress updates for a goal
  getProgressUpdates: async (goalId: string): Promise<ProgressUpdate[]> => {
    await delay(700); // Simulate network delay
    return mockProgressUpdates
      .filter(update => update.goalId === goalId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
};

// Staking & Blockchain Interaction
export const stakingService = {
  // Stake funds for a goal
  stakeForGoal: async (stakeData: StakeRequest): Promise<any> => {
    await delay(1500); // Simulate blockchain transaction
    return { success: true, txHash: `mock-tx-${Date.now()}` };
  },

  // Mark a goal as complete
  completeGoal: async (goalId: string, walletAddress: string): Promise<any> => {
    await delay(1500); // Simulate blockchain transaction
    return { success: true, txHash: `mock-tx-${Date.now()}` };
  },

  // Claim staked funds and rewards
  claimRewards: async (goalId: string, walletAddress: string): Promise<any> => {
    await delay(2000); // Simulate blockchain transaction
    return { success: true, txHash: `mock-tx-${Date.now()}` };
  }
};

export default {
  goal: goalService,
  staking: stakingService
};