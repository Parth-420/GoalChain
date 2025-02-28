"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { goalService, Goal } from '@/lib/api-service';
import { useToast } from '@/hooks/use-toast';
import { CalendarClock, CheckCircle, Clock, Plus, Target, TrendingUp, XCircle, Award } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectWalletButton } from '@/components/ui/connect-wallet-button';

export default function Dashboard() {
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchGoals() {
      if (!connected || !publicKey) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const walletAddress = publicKey.toString();
        const fetchedGoals = await goalService.getGoals(walletAddress);
        setGoals(fetchedGoals);
      } catch (error) {
        console.error('Error fetching goals:', error);
        toast({
          title: "Error fetching goals",
          description: "There was a problem loading your goals. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchGoals();
  }, [toast, connected, publicKey]);

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const failedGoals = goals.filter(goal => goal.status === 'failed');

  // Calculate total staked and claimed amounts
  const totalStaked = goals.reduce((sum, goal) => sum + goal.stakingAmount, 0);
  const totalClaimed = completedGoals.reduce((sum, goal) => sum + goal.stakingAmount, 0);

  if (!connected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>
                Please connect your Solana wallet to view your goals and track your progress.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <ConnectWalletButton />
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Your Goal Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Track, manage, and achieve your goals
              </p>
            </div>
            <Button asChild>
              <Link href="/goals/create">
                <Plus className="mr-2 h-4 w-4" /> Create New Goal
              </Link>
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-chart-1 mr-2" />
                  <div className="text-2xl font-bold">{activeGoals.length}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-chart-2 mr-2" />
                  <div className="text-2xl font-bold">{completedGoals.length}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Staked</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-chart-3 mr-2" />
                  <div className="text-2xl font-bold">
                    {totalStaked.toFixed(2)} SOL
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Claimed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-chart-4 mr-2" />
                  <div className="text-2xl font-bold">
                    {totalClaimed.toFixed(2)} SOL
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goals List */}
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="active">Active Goals</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-pulse text-muted-foreground">Loading goals...</div>
                </div>
              ) : activeGoals.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Target className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">You don't have any active goals yet.</p>
                    <Button asChild>
                      <Link href="/goals/create">Create Your First Goal</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeGoals.map((goal) => (
                    <Link href={`/goals/${goal.id}`} key={goal.id} className="block">
                      <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                        <CardHeader>
                          <CardTitle>{goal.title}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDistanceToNow(new Date(goal.deadline), { addSuffix: true })}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Progress</span>
                              <span className="text-sm font-medium">{goal.progress}%</span>
                            </div>
                            <Progress value={goal.progress} className="h-2" />
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {goal.description}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <div className="text-sm font-medium">
                            Staked: {goal.stakingAmount} SOL
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-pulse text-muted-foreground">Loading goals...</div>
                </div>
              ) : completedGoals.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">You haven't completed any goals yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedGoals.map((goal) => (
                    <Link href={`/goals/${goal.id}`} key={goal.id} className="block">
                      <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                        <CardHeader>
                          <CardTitle>{goal.title}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <CalendarClock className="h-4 w-4 mr-1" />
                            Completed on {new Date(goal.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Progress</span>
                              <span className="text-sm font-medium">100%</span>
                            </div>
                            <Progress value={100} className="h-2" />
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {goal.description}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <div className="text-sm font-medium">
                            Staked: {goal.stakingAmount} SOL
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="failed">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-pulse text-muted-foreground">Loading goals...</div>
                </div>
              ) : failedGoals.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">You don't have any failed goals.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {failedGoals.map((goal) => (
                    <Link href={`/goals/${goal.id}`} key={goal.id} className="block">
                      <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                        <CardHeader>
                          <CardTitle>{goal.title}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <CalendarClock className="h-4 w-4 mr-1" />
                            Failed on {new Date(goal.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Progress</span>
                              <span className="text-sm font-medium">{goal.progress}%</span>
                            </div>
                            <Progress value={goal.progress} className="h-2" />
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {goal.description}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <div className="text-sm font-medium">
                            Staked: {goal.stakingAmount} SOL
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}