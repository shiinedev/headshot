'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Users, Heart, Award, Zap } from 'lucide-react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <MissionSection />
      <ValuesSection />
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
          About Headshot
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          We're on a mission to make professional headshots accessible to everyone, 
          powered by cutting-edge AI technology and a passion for helping professionals succeed.
        </p>
      </div>
    </section>
  );
}

function MissionSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              We believe everyone deserves a professional headshot that represents 
              their best self. Traditional photography can be expensive, time-consuming, 
              and intimidating.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              That's why we created Headshot - to democratize access to professional 
              photography using AI technology. Our platform makes it easy, affordable, 
              and quick to get the perfect headshot for your career.
            </p>
            <p className="text-lg text-muted-foreground">
              Whether you're updating your LinkedIn profile, creating a resume, or 
              building your personal brand, we're here to help you make a great first impression.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-border flex items-center justify-center">
              <Target className="h-32 w-32 text-primary/50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const values = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Accessibility",
      description: "Making professional headshots available to everyone, regardless of budget or location"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Quality",
      description: "Never compromising on quality. Every headshot meets professional photography standards"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Innovation",
      description: "Constantly improving our AI technology to deliver better results faster"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community",
      description: "Building a community of professionals who support each other's growth"
    }
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Our Values
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These principles guide everything we do
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
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
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Join Us On Our Journey
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Be part of the revolution in professional photography
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started Today
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

