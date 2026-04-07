const { execSync } = require('child_process');
const path = require('path');

// Run the seed using npx
try {
  console.log('Starting database seed...');
  execSync('npx tsx prisma/seed.ts', {
    cwd: __dirname,
    stdio: 'inherit',
  });
  console.log('✅ Database seeded successfully!');
} catch (error) {
  console.error('❌ Failed to seed database:', error.message);
  process.exit(1);
}
