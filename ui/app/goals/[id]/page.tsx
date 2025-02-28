"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { goalService, stakingService, Goal, ProgressUpdate } from '@/lib/api-service';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { format, formatDistanceToNow } from 'date-fns';
import { CalendarClock, CheckCircle, Clock, Loader2, Target, TrendingUp, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectWalletButton } from '@/components/ui/connect-wallet-button';

export default function GoalDetails() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { connected, publicKey } = useWallet();
  
  const [goal, setGoal] = useState<Goal | null>(null);
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [progressDescription, setProgressDescription] = useState('');
  const [progressPercentage, setProgressPercentage] = useState('');
  
  const goalId = params.id as string;

  useEffect(() => {
    async function fetchGoalData() {
      if (goalId && connected && publicKey) {
        try {
          setLoading(true);
          const fetchedGoal = await goalService.getGoalById(goalId);
          setGoal(fetchedGoal);
          
          const updates = await goalService.getProgressUpdates(goalId);
          setProgressUpdates(updates);
        } catch (error) {
          console.error('Error fetching goal data:', error);
          toast({
            title: "Error loading goal",
            description: "There was a problem loading the goal details. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      } else if (!connected) {
        setLoading(false);
      }
    }

    fetchGoalData();
  }, [goalId, toast, connected, publicKey]);

  const handleLogProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goal || !connected || !publicKey) {
      toast({
        title: "Not connected",
        description: "Please connect your wallet to log progress.",
        variant: "destructive",
      });
      return;
    }
    
    if (!progressDescription || !progressPercentage) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to log your progress.",
        variant: "destructive",
      });
      return;
    }
    
    const percentage = parseInt(progressPercentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      toast({
        title: "Invalid percentage",
        description: "Progress percentage must be between 0 and 100.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Log the progress update
      const newUpdate = await goalService.logProgress(goalId, {
        description: progressDescription,
        progressPercentage: percentage,
      });
      
      // Update the goal's progress
      const updatedGoal = await goalService.updateGoal(goalId, {
        progress: percentage,
      });
      
      setGoal(updatedGoal);
      setProgressUpdates([newUpdate, ...progressUpdates]);
      
      // Reset form
      setProgressDescription('');
      setProgressPercentage('');
      
      toast({
        title: "Progress logged successfully!",
        description: "Your progress has been updated.",
      });
    } catch (error) {
      console.error('Error logging progress:', error);
      toast({
        title: "Error logging progress",
        description: "There was a problem updating your progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteGoal = async () => {
    if (!goal || !connected || !publicKey) {
      toast({
        title: "Not connected",
        description: "Please connect your wallet to complete this goal.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      const walletAddress = publicKey.toString();
      
      // Mark the goal as complete
      await stakingService.completeGoal(goalId, walletAddress);
      
      // Update the goal status
      const updatedGoal = await goalService.updateGoal(goalId, {
        status: 'completed',
        progress: 100,
      });
      
      setGoal(updatedGoal);
      
      toast({
        title: "Goal completed!",
        description: "Congratulations! Your goal has been marked as complete.",
      });
    } catch (error) {
      console.error('Error completing goal:', error);
      toast({
        title: "Error completing goal",
        description: "There was a problem completing your goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!goal || !connected || !publicKey) {
      toast({
        title: "Not connected",
        description: "Please connect your wallet to claim rewards.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      const walletAddress = publicKey.toString();
      
      // Claim the rewards
      await stakingService.claimRewards(goalId, walletAddress);
      
      toast({
        title: "Rewards claimed!",
        description: "Your staked funds and rewards have been sent to your wallet.",
      });
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error claiming rewards:', error);
      toast({
        title: "Error claiming rewards",
        description: "There was a problem claiming your rewards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>
                Please connect your Solana wallet to view goal details.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <ConnectWalletButton />
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">Back to Home</Link>
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading goal details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Goal Not Found</CardTitle>
              <CardDescription>
                The goal you're looking for doesn't exist or you don't have access to it.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    );
  }

  // Format the deadline to show both date and time
  const formattedDeadline = format(new Date(goal.deadline), "PPP 'at' h:mm a");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                ← Back to Dashboard
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Goal Details */}
            <div className="md:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-2xl">{goal.title}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(goal.deadline) > new Date() 
                      ? `Deadline: ${formattedDeadline}`
                      : `Deadline passed: ${formattedDeadline}`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Progress</span>
                      <span className="text-sm font-medium">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{goal.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Staked Amount</div>
                      <div className="font-semibold flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1 text-chart-1" />
                        {goal.stakingAmount} SOL
                      </div>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Status</div>
                      <div className="font-semibold flex items-center">
                        {goal.status === 'active' && (
                          <>
                            <Target className="h-4 w-4 mr-1 text-chart-2" />
                            Active
                          </>
                        )}
                        {goal.status === 'completed' && (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1 text-chart-2" />
                            Completed
                          </>
                        )}
                        {goal.status === 'failed' && (
                          <>
                            <XCircle className="h-4 w-4 mr-1 text-destructive" />
                            Failed
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                {goal.status === 'active' && (
                  <CardFooter className="flex flex-col sm:flex-row gap-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="default" className="w-full sm:w-auto">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Complete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Complete this goal?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you've completed this goal? This action will mark your goal as complete and allow you to claim your staked funds.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleCompleteGoal} disabled={submitting}>
                            {submitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              "Yes, Complete Goal"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                )}
                
                {goal.status === 'completed' && (
                  <CardFooter>
                    <Button 
                      variant="default" 
                      className="w-full"
                      onClick={handleClaimRewards}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Claim Rewards
                        </>
                      )}
                    </Button>
                  </CardFooter>
                )}
              </Card>
              
              {/* Progress Updates */}
              <Card>
                <CardHeader>
                  <CardTitle>Progress Updates</CardTitle>
                  <CardDescription>
                    Track your journey towards completing this goal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {progressUpdates.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No progress updates yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {progressUpdates.map((update) => (
                        <div key={update.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">{update.progressPercentage}% Complete</span>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(update.date), 'PPP')}
                            </span>
                          </div>
                          <p className="text-muted-foreground">{update.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Log Progress Form */}
            {goal.status === 'active' && (
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Log Progress</CardTitle>
                    <CardDescription>
                      Update your progress towards this goal
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogProgress} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="progressPercentage">Progress Percentage</Label>
                        <Input
                          id="progressPercentage"
                          type="number"
                          placeholder="e.g., 75"
                          min="0"
                          max="100"
                          value={progressPercentage}
                          onChange={(e) => setProgressPercentage(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="progressDescription">Description</Label>
                        <Textarea
                          id="progressDescription"
                          placeholder="Describe your progress..."
                          value={progressDescription}
                          onChange={(e) => setProgressDescription(e.target.value)}
                          required
                          rows={4}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Log Progress"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}