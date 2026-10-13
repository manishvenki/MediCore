import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  let uri = process.env.MONGODB_URI?.trim();

  if (uri && uri.length > 0) {
    try {
      console.log(`Connecting to MongoDB at: ${uri} (db: medicore)...`);
      await mongoose.connect(uri, { dbName: 'medicore' });
      console.log('MongoDB connected successfully via configured MONGODB_URI.');
      return;
    } catch (primaryErr) {
      console.warn(`Initial connection attempt to ${uri} failed:`, primaryErr);

      // If localhost failed due to IPv6 resolution on Windows, retry with 127.0.0.1
      if (uri.includes('localhost')) {
        const ipv4Uri = uri.replace('localhost', '127.0.0.1');
        try {
          console.log(`Retrying connection with IPv4 (${ipv4Uri})...`);
          await mongoose.connect(ipv4Uri, { dbName: 'medicore' });
          console.log('MongoDB connected successfully via IPv4 127.0.0.1.');
          return;
        } catch (ipv4Err) {
          console.error('IPv4 connection also failed:', ipv4Err);
        }
      }
    }
  }

  // Fallback if no MONGODB_URI or if local MongoDB is unreachable
  try {
    console.log('Initializing embedded MongoDB engine (MongoMemoryServer)...');
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    await mongoose.connect(memoryUri, { dbName: 'medicore' });
    console.log(`Connected to embedded MongoDB database: ${memoryUri}`);
  } catch (fallbackError) {
    console.error('Critical: Failed to connect to any MongoDB instance:', fallbackError);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error);
  }
};
