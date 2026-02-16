import mongoose from 'mongoose';

import { config } from '@/config';
import { CreditPackage } from '@/models/CreditPackage.model';



const packages = [
  { name: 'Starter', credits: 10, price: 9.99, description: 'Perfect for trying out AI headshots',features: [
        "5 headshots per month",
        "Basic AI processing",
        "HD quality downloads",
        "3 style options",
        "Email support",
        "24-hour processing"
      ], bonus: 0, popular: false },
  { name: 'Popular', credits: 25, price: 19.99, description: 'Most popular choice',features: [
        "25 headshots per month",
        "Advanced AI processing",
        "4K quality downloads",
        "10 style options",
        "Priority email support",
        "2-hour processing",
        "Background removal",
        "Batch processing"
      ], bonus: 5, popular: true },
  { name: 'Professional', credits: 50, price: 34.99, description: 'Best value for professionals',features: [
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
      ], bonus: 15, popular: false },
  { name: 'Enterprise', credits: 100, price: 59.99, description: 'Ideal for teams', bonus: 30, popular: false },
];

async function seed() {
  try {

    await mongoose.connect(config.database);
    
    await CreditPackage.deleteMany({});
    const result = await CreditPackage.insertMany(packages.map(p => ({ ...p, isActive: true })));
    
    console.log(`✅ Seeded ${result.length} credit packages`);
    result.forEach(p => console.log(`  ${p.name}: ${p.credits}${p.bonus ? `+${p.bonus}` : ''} credits - $${p.price}`));
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
}

seed();