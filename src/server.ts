// src/server.ts
import app from './index';
import prisma from './client';

const PORT = process.env.PORT || 3000;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Listen for termination signals
const shutdown = async () => {
  console.log('Termination signal received: closing Prisma Client');
  await prisma.$disconnect(); // Gracefully disconnect from the database
  server.close(() => {
    console.log('Server closed');
    process.exit(0); // Exit the process
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);