'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {  Check, Zap, Crown, Star } from 'lucide-react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <PricingSection />
      <ComparisonSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}



function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/20 py-20 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your needs. No hidden fees, no surprises. 
          All plans include our core AI-powered headshot generation.
        </p>
      </div>
    </section>
  );
}

function PricingSection() {
  const plans = [
    {
      name: "Starter",
      icon: <Star className="h-6 w-6" />,
      price: "9",
      period: "per month",
      description: "Perfect for individuals just getting started",
      features: [
        "5 headshots per month",
        "Basic AI processing",
        "HD quality downloads",
        "3 style options",
        "Email support",
        "24-hour processing"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      icon: <Zap className="h-6 w-6" />,
      price: "29",
      period: "per month",
      description: "Most popular for professionals and job seekers",
      features: [
        "25 headshots per month",
        "Advanced AI processing",
        "4K quality downloads",
        "10 style options",
        "Priority email support",
        "2-hour processing",
        "Background removal",
        "Batch processing"
      ],
      cta: "Get Started",
      popular: true
    },
    {
      name: "Enterprise",
      icon: <Crown className="h-6 w-6" />,
      price: "99",
      period: "per month",
      description: "For teams and organizations",
      features: [
        "Unlimited headshots",
        "Premium AI processing",
        "8K quality downloads",
        "Unlimited styles",
        "24/7 phone & email support",
        "Instant processing",
        "Advanced editing tools",
        "Team management",
        "Custom branding",
        "API access"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative border-border ${
                plan.popular ? 'border-primary border-2 shadow-xl scale-105' : ''
              } hover:shadow-lg transition-all`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-lg ${
                    plan.popular ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                  }`}>
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl text-foreground mb-2">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {plan.description}
                </CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-foreground">
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    /{plan.period.split(' ')[1]}
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Link href="/auth/register" className="w-full">
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  const features = [
    { name: "Headshots per month", starter: "5", pro: "25", enterprise: "Unlimited" },
    { name: "AI Processing", starter: "Basic", pro: "Advanced", enterprise: "Premium" },
    { name: "Image Quality", starter: "HD", pro: "4K", enterprise: "8K" },
    { name: "Style Options", starter: "3", pro: "10", enterprise: "Unlimited" },
    { name: "Processing Speed", starter: "24 hours", pro: "2 hours", enterprise: "Instant" },
    { name: "Background Removal", starter: "✗", pro: "✓", enterprise: "✓" },
    { name: "Batch Processing", starter: "✗", pro: "✓", enterprise: "✓" },
    { name: "Advanced Editing", starter: "✗", pro: "✗", enterprise: "✓" },
    { name: "Team Management", starter: "✗", pro: "✗", enterprise: "✓" },
    { name: "API Access", starter: "✗", pro: "✗", enterprise: "✓" },
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Feature Comparison
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what's included in each plan
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left p-4 font-semibold text-foreground">Feature</th>
                  <th className="text-center p-4 font-semibold text-foreground">Starter</th>
                  <th className="text-center p-4 font-semibold text-foreground bg-primary/5">Professional</th>
                  <th className="text-center p-4 font-semibold text-foreground">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-b border-border last:border-0">
                    <td className="p-4 text-muted-foreground">{feature.name}</td>
                    <td className="p-4 text-center text-muted-foreground">{feature.starter}</td>
                    <td className="p-4 text-center text-muted-foreground bg-primary/5">{feature.pro}</td>
                    <td className="p-4 text-center text-muted-foreground">{feature.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    {
      question: "Can I change plans later?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, we offer a 7-day free trial for the Professional plan. No credit card required."
    },
    {
      question: "What happens if I exceed my monthly limit?",
      answer: "You can purchase additional headshots à la carte, or upgrade to a higher tier plan."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Have questions? We've got answers.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <Card key={index} className="border-border">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join thousands of professionals using Headshot to create amazing profile pictures
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/register">
            <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
              Start Free Trial
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

