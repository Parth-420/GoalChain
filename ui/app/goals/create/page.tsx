"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { goalService, stakingService } from '@/lib/api-service';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Clock, Loader2 } from 'lucide-react';
import { format, set } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectWalletButton } from '@/components/ui/connect-wallet-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreateGoal() {
  const router = useRouter();
  const { toast } = useToast();
  const { connected, publicKey } = useWallet();
  
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedHour, setSelectedHour] = useState<string>('12');
  const [selectedMinute, setSelectedMinute] = useState<string>('00');
  const [selectedAmPm, setSelectedAmPm] = useState<string>('PM');
  const [stakingAmount, setStakingAmount] = useState('');

  // Generate hours for the dropdown (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 1;
    return { value: hour.toString(), label: hour.toString().padStart(2, '0') };
  });

  // Generate minutes for the dropdown (00, 15, 30, 45)
  const minutes = ['00', '15', '30', '45'].map(minute => ({
    value: minute,
    label: minute
  }));

  // Get the complete deadline with date and time
  const getDeadlineWithTime = (): Date | null => {
    if (!selectedDate) return null;
    
    let hour = parseInt(selectedHour, 10);
    const minute = parseInt(selectedMinute, 10);
    
    // Convert to 24-hour format
    if (selectedAmPm === 'PM' && hour < 12) {
      hour += 12;
    } else if (selectedAmPm === 'AM' && hour === 12) {
      hour = 0;
    }
    
    return set(selectedDate, { hours: hour, minutes: minute, seconds: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a goal.",
        variant: "destructive",
      });
      return;
    }
    
    const deadline = getDeadlineWithTime();
    
    if (!title || !description || !deadline || !stakingAmount) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to create your goal.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      const walletAddress = publicKey.toString();
      
      // Create the goal
      const newGoal = await goalService.createGoal({
        title,
        description,
        deadline: deadline.toISOString(),
        stakingAmount: parseFloat(stakingAmount),
        walletAddress,
      });
      
      // Stake funds for the goal
      await stakingService.stakeForGoal({
        goalId: newGoal.id,
        amount: parseFloat(stakingAmount),
        walletAddress,
      });
      
      toast({
        title: "Goal created successfully!",
        description: "Your goal has been created and funds have been staked.",
      });
      
      // Redirect to the dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error creating goal",
        description: "There was a problem creating your goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
                Please connect your Solana wallet to create a goal.
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-8">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                ← Back to Dashboard
              </Link>
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold mb-8 text-center">Create a New Goal</h1>
          
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Goal Details</CardTitle>
                <CardDescription>
                  Set a meaningful goal and stake SOL to stay accountable.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Learn Solana Development"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your goal in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Deadline</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deadline-date" className="text-sm text-muted-foreground mb-1 block">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="deadline-date"
                            type="button"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Select a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label htmlFor="deadline-time" className="text-sm text-muted-foreground mb-1 block">Time</Label>
                      <div className="flex items-center space-x-2">
                        <Select value={selectedHour} onValueChange={setSelectedHour}>
                          <SelectTrigger className="w-[70px]">
                            <SelectValue placeholder="Hour" />
                          </SelectTrigger>
                          <SelectContent>
                            {hours.map((hour) => (
                              <SelectItem key={hour.value} value={hour.value}>
                                {hour.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <span className="text-center">:</span>
                        
                        <Select value={selectedMinute} onValueChange={setSelectedMinute}>
                          <SelectTrigger className="w-[70px]">
                            <SelectValue placeholder="Min" />
                          </SelectTrigger>
                          <SelectContent>
                            {minutes.map((minute) => (
                              <SelectItem key={minute.value} value={minute.value}>
                                {minute.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Select value={selectedAmPm} onValueChange={setSelectedAmPm}>
                          <SelectTrigger className="w-[70px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AM">AM</SelectItem>
                            <SelectItem value="PM">PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  {selectedDate && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Deadline set for: {selectedDate && getDeadlineWithTime() ? 
                        format(getDeadlineWithTime()!, "PPP 'at' h:mm a") : 
                        "Please select both date and time"}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stakingAmount">Staking Amount (SOL)</Label>
                  <Input
                    id="stakingAmount"
                    type="number"
                    placeholder="0.1"
                    min="0.01"
                    step="0.01"
                    value={stakingAmount}
                    onChange={(e) => setStakingAmount(e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    This amount will be staked as an incentive to complete your goal.
                  </p>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Goal...
                    </>
                  ) : (
                    "Create Goal & Stake SOL"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}