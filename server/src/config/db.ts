import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

/**
 * Connect to MongoDB with connection reuse and environment optimization.
 * In production, reuses existing connections and requires MONGODB_URI.
 * In development, falls back to embedded MongoMemoryServer if local MongoDB is unavailable.
 */
export const connectDB = async (): Promise<void> => {
  // 1. Connection reuse check: if already connected, return immediately
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // If currently in the process of connecting, await ready state
  if (mongoose.connection.readyState === 2) {
    console.log('MongoDB connection currently establishing, awaiting ready state...');
    await new Promise((resolve) => {
      mongoose.connection.once('connected', resolve);
    });
    return;
  }

  const isProduction = process.env.NODE_ENV === 'production';
  let uri = process.env.MONGODB_URI?.trim();

  // 2. Primary connection attempt via MONGODB_URI
  if (uri && uri.length > 0) {
    try {
      const sanitizedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
      console.log(`Connecting to MongoDB at: ${sanitizedUri} (db: medicore)...`);

      await mongoose.connect(uri, {
        dbName: 'medicore',
        serverSelectionTimeoutMS: 8000,
        maxPoolSize: 10,
      });

      console.log('MongoDB connected successfully via MONGODB_URI.');
      return;
    } catch (primaryErr: any) {
      console.warn('Initial connection attempt failed:', primaryErr?.message || primaryErr);

      // Retry with IPv4 if localhost failed on Windows during development
      if (uri.includes('localhost') && !isProduction) {
        const ipv4Uri = uri.replace('localhost', '127.0.0.1');
        try {
          console.log(`Retrying connection with IPv4 (${ipv4Uri})...`);
          await mongoose.connect(ipv4Uri, {
            dbName: 'medicore',
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
          });
          console.log('MongoDB connected successfully via IPv4 127.0.0.1.');
          return;
        } catch (ipv4Err: any) {
          console.error('IPv4 connection also failed:', ipv4Err?.message || ipv4Err);
        }
      }

      // If running in production, do NOT attempt to spawn MongoMemoryServer
      if (isProduction) {
        throw new Error(
          `[MongoDB Atlas Error] Could not connect to MongoDB Atlas at the configured URI. ` +
          `Please check: ` +
          `1) MONGODB_URI is configured correctly in server environment variables. ` +
          `2) MongoDB Atlas Network Access whitelist permits incoming connections. ` +
          `3) Database user credentials and cluster status are active. ` +
          `Details: ${primaryErr?.message || primaryErr}`
        );
      }
    }
  } else if (isProduction) {
    throw new Error(
      `[Configuration Error] MONGODB_URI environment variable is missing in production environment. ` +
      `Please configure MONGODB_URI in your server environment variables.`
    );
  }

  // 3. Fallback for zero-config local development ONLY
  try {
    console.log('Initializing embedded MongoDB engine (MongoMemoryServer) for local dev...');
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
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
      mongoMemoryServer = null;
    }
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error);
  }
};
