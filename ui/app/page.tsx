import Link from 'next/link';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, Shield, TrendingUp, Award, Mail, MessageSquare, HelpCircle, Github, Linkedin, Twitter, Users, CheckCircle2, UserPlus, Sparkles } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ConnectWalletButton } from '@/components/ui/connect-wallet-button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Achieve Your Goals <span className="text-primary">On-Chain</span>
                </h1>
                <p className="text-lg mb-8 text-muted-foreground">
                  Set goals, stake crypto, and stay accountable. GoalChain helps you track progress and rewards completion with blockchain-powered incentives.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <ConnectWalletButton />
                  <Button variant="outline" size="lg">
                    <Link href="#how-it-works">Learn More</Link>
                  </Button>
                </div>
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/dashboard">
                    Start Tracking Goals <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <div className="relative">
                <div className="w-full h-[400px] bg-gradient-to-br from-chart-1/30 to-chart-2/30 rounded-xl flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 bg-card rounded-lg shadow-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold">Goal Dashboard</h3>
                        <span className="text-sm text-muted-foreground">3 Active Goals</span>
                      </div>
                      
                      {/* Sample Goal Cards */}
                      <div className="space-y-4">
                        {[
                          { title: "Learn Solana Development", progress: 65, deadline: "14 days left" },
                          { title: "Complete DeFi Project", progress: 40, deadline: "30 days left" },
                          { title: "Daily Blockchain Study", progress: 80, deadline: "5 days left" }
                        ].map((goal, i) => (
                          <div key={i} className="p-4 bg-background rounded-md border border-border">
                            <div className="flex justify-between mb-2">
                              <span className="font-medium">{goal.title}</span>
                              <span className="text-sm text-muted-foreground">{goal.deadline}</span>
                            </div>
                            <div className="w-full bg-secondary h-2 rounded-full">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${goal.progress}%` }}
                              ></div>
                            </div>
                            <div className="mt-2 text-right text-sm">{goal.progress}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section id="how-it-works" className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How GoalChain Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform combines goal tracking with blockchain technology to create powerful incentives for achievement.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Target className="h-10 w-10 text-chart-1" />,
                  title: "Set Meaningful Goals",
                  description: "Create specific, measurable goals with deadlines and track your progress over time."
                },
                {
                  icon: <Shield className="h-10 w-10 text-chart-2" />,
                  title: "Stake Crypto Assets",
                  description: "Put your crypto at stake to create a powerful incentive for completing your goals."
                },
                {
                  icon: <TrendingUp className="h-10 w-10 text-chart-3" />,
                  title: "Track Your Progress",
                  description: "Log daily updates, visualize your progress, and stay motivated with real-time tracking."
                }
              ].map((item, i) => (
                <div key={i} className="bg-card rounded-lg p-6 border border-border">
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <div className="inline-flex items-center justify-center p-6 bg-card rounded-lg border border-border mb-8">
                <Award className="h-12 w-12 text-chart-4 mr-4" />
                <div className="text-left">
                  <h3 className="text-xl font-semibold">Claim Your Rewards</h3>
                  <p className="text-muted-foreground">Complete your goals and claim back your staked funds plus rewards.</p>
                </div>
              </div>
              
              
            </div>
          </div>
        </section>

        {/* Upcoming Features Section */}
        <section id="upcoming-features" className="py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Coming Soon</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're constantly improving GoalChain with new features to help you achieve more.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="bg-chart-1/10 p-3 rounded-lg">
                    <Users className="h-8 w-8 text-chart-1" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Community Challenges & Rewards</h3>
                    <p className="text-muted-foreground mb-4">
                      Join group challenges with other members, pool rewards, and celebrate achievements together. Community challenges increase motivation and create a supportive environment for goal completion.
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-primary">
                      <Sparkles className="h-4 w-4" />
                     
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="bg-chart-2/10 p-3 rounded-lg">
                    <CheckCircle2 className="h-8 w-8 text-chart-2" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Community-Based Verification</h3>
                    <p className="text-muted-foreground mb-4">
                      Leverage the power of community to verify goal completion. Trusted members can validate your progress, adding an extra layer of accountability and credibility to your achievements.
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-primary">
                      <Sparkles className="h-4 w-4" />
                      
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="bg-chart-3/10 p-3 rounded-lg">
                    <UserPlus className="h-8 w-8 text-chart-3" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Accountability Partners</h3>
                    <p className="text-muted-foreground mb-4">
                      Connect with accountability partners who share similar goals. Regular check-ins, shared progress tracking, and mutual encouragement significantly increase your chances of success.
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-primary">
                      <Sparkles className="h-4 w-4" />
                     
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="bg-chart-4/10 p-3 rounded-lg">
                    <Award className="h-8 w-8 text-chart-4" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Enhanced Reward System</h3>
                    <p className="text-muted-foreground mb-4">
                      Earn achievement badges, unlock special rewards, and gain reputation within the community. Our enhanced reward system will provide additional motivation beyond financial incentives.
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-primary">
                      <Sparkles className="h-4 w-4" />
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 px-4 bg-secondary/20">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get answers to common questions about GoalChain and how it works.
              </p>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left text-lg font-medium">
                  How does goal staking work?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  When you create a goal, you stake a certain amount of SOL as an incentive. This amount is locked in a smart contract until your goal is either completed or fails. If you complete your goal, you get your staked amount back plus any additional rewards. If you fail, the staked amount may be donated to charity or distributed according to your preferences.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left text-lg font-medium">
                  How is goal completion verified?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                GoalChain currently uses self-reporting for goal completion but we are working on adding community-based verification and accountability partners soon in the future. You can log your progress regularly. The blockchain ensures all progress data is transparent and immutable.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left text-lg font-medium">
                  What types of goals can I track?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  You can track virtually any type of goal on GoalChain, from fitness and learning objectives to career milestones and personal projects. The platform is flexible enough to accommodate different goal structures, timeframes, and measurement criteria.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left text-lg font-medium">
                  Is my staked crypto safe?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, all staked funds are secured by smart contracts on the Solana blockchain. These contracts are audited and designed to ensure that your funds can only be released according to the predefined conditions of your goal. You maintain full control over your funds throughout the process.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left text-lg font-medium">
                  Can I modify a goal after creating it?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  You can update certain aspects of your goal, such as the description or progress updates. However, core parameters like the deadline and staking amount cannot be modified after creation to maintain the integrity of the commitment mechanism.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left text-lg font-medium">
                  What happens if I miss my deadline?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                If you miss your deadline without completing the goal, it will be marked as failed but for now we will allow you to withdraw but in the future ,You can choose to have the funds redistributed to accountability partners,community projects or other options.                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
        
        {/* Contact Us Section */}
        <section id="contact" className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Have questions or feedback? We'd love to hear from you. Fill out the form and our team will get back to you as soon as possible.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-chart-1 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Email Us</h3>
                      <p className="text-muted-foreground">support@goalchain.io</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <MessageSquare className="h-6 w-6 text-chart-2 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Join Our Community</h3>
                      <p className="text-muted-foreground">Connect with us on Discord and Twitter for updates and support.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <HelpCircle className="h-6 w-6 text-chart-3 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">Support Center</h3>
                      <p className="text-muted-foreground">Visit our help center for tutorials and guides.</p>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
                    <div className="flex space-x-4">
                      <Link href="/" className="bg-card hover:bg-secondary transition-colors p-3 rounded-full">
                        <Github className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                      </Link>
                      <Link href="/" className="bg-card hover:bg-secondary transition-colors p-3 rounded-full">
                        <Linkedin className="h-5 w-5" />
                        <span className="sr-only">LinkedIn</span>
                      </Link>
                      <Link href="/" className="bg-card hover:bg-secondary transition-colors p-3 rounded-full">
                        <Twitter className="h-5 w-5" />
                        <span className="sr-only">Twitter</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-card rounded-lg border border-border p-8">
                  <h3 className="text-xl font-semibold mb-6">Send Us a Message</h3>
                  
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Input id="name" placeholder="Your name" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="Your email address" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <Input  id="subject" placeholder="What's this about?" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <Textarea 
                        id="message" 
                        placeholder="Your message..." 
                        rows={4}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Target className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold text-xl">GoalChain</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <span className="text-sm text-muted-foreground ml-2">
                © {new Date().getFullYear()} GoalChain. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}