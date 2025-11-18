# MongoDB Atlas Setup 

This guide provides step-by-step instructions for setting up MongoDB Atlas and connecting it to your Express.js application.

## 📋 Table of Contents Guide
- [Create MongoDB Atlas Account](#create-mongodb-atlas-account)
- [Create a New Cluster](#create-a-new-cluster)
- [Configure Database Access](#configure-database-access)
- [Configure Network Access](#configure-network-access)
- [Get Connection String](#get-connection-string)
- [Connect to Express Application](#connect-to-express-application)
- [Troubleshooting](#troubleshooting)

## Create MongoDB Atlas Account

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" or "Sign Up"
3. You can sign up using:
    - Email and password
    - Google account
    - GitHub account

## Create a New Cluster

1. After logging in, click "Build a Database"
2. Choose your plan:
    - Select "FREE" tier for development
    - Choose "Shared" cluster type
3. Configure your cluster:
    - Choose cloud provider (AWS, Google Cloud, or Azure)
    - Select region (choose closest to your deployment)
4. Click "Create" and wait for the cluster to be created (usually 1-3 minutes)

## Configure Database Access

1. In the left sidebar, click "Database Access" under Security
2. Click "Add New Database User"
3. Choose Authentication Method:
   ```
   Username and Password
   - Username: <your_username>
   - Password: <your_secure_password>
   - Built-in Role: "Read and write to any database"
   ```
4. Click "Add User"

⚠️ **Important**: Save these credentials securely; you'll need them for your connection string.

## Configure Network Access

1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. For development:
    - Click "Allow Access from Anywhere" (0.0.0.0/0)
    - Or add your specific IP address
4. Click "Confirm"

⚠️ **Note**: For production, limit IP addresses to your server's IP only.

## Get Connection String

1. In the cluster view, click "Connect"
2. Choose "Connect your application"
3. Select:
    - Driver: "Node.js"
    - Version: Select the latest version
4. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database_name>?retryWrites=true&w=majority
   ```

## Connect to Express Application

1. Update your `.env` file:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database_name>?retryWrites=true&w=majority
   ```

2. Database connection setup in `src/config/db.js`:
   ```javascript
   /**
    * @fileoverview Database Configuration
    * @description MongoDB Atlas connection configuration
    */

   import mongoose from 'mongoose';
   import dotenv from 'dotenv';

   dotenv.config();

   export const connect = async () => {
     try {
       await mongoose.connect(process.env.MONGODB_URI, {
         // These options might not be needed for newer MongoDB versions
         // but are good to have for compatibility
         useNewUrlParser: true,
         useUnifiedTopology: true
       });
       console.log('🌿 MongoDB Atlas connected successfully');
     } catch (error) {
       console.error('❌ MongoDB connection error:', error.message);
       process.exit(1);
     }
   };

   // Handle connection events
   mongoose.connection.on('disconnected', () => {
     console.log('❌ MongoDB disconnected');
   });

   mongoose.connection.on('error', (err) => {
     console.error('MongoDB error:', err);
   });

   // Handle application termination
   process.on('SIGINT', async () => {
     await mongoose.connection.close();
     process.exit(0);
   });
   ```

## Troubleshooting

### Common Issues and Solutions

1. **Connection Failed**
    - Check if your IP address is whitelisted
    - Verify username and password
    - Ensure the connection string is properly formatted

2. **Authentication Failed**
    - Double-check your database user credentials
    - Ensure special characters in password are properly encoded in connection string

3. **Network Timeout**
    - Check your internet connection
    - Verify your IP whitelist in MongoDB Atlas
    - Check if your VPN (if using) is interfering

4. **Database User Issues**
    - Verify user has appropriate permissions
    - Check if user is configured for the correct database

### Connection String Format

Make sure your connection string follows this format:
```
mongodb+srv:// :  @cluster0.xxxxx. mongodb. net/<database_name>?retryWrites=true&w=majority
```

Replace:
- `<username>`: Your database user username
- `<password>`: Your database user password
- `<database_name>`: Your database name

### Testing the Connection

Add this code to test your connection:
```javascript
// Quick connection test
mongoose.connection.once('open', () => {
  console.log('MongoDB Atlas Test:');
  console.log('✅ Connection established');
  console.log(`📦 Connected to database: ${mongoose.connection.name}`);
});
```

## Additional Resources

If you’d like to learn more or need help working with MongoDB in this project, check out the following references:

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/) – Official guide for setting up and managing MongoDB Atlas clusters.
- [Mongoose Documentation](https://mongoosejs.com/docs/) – Comprehensive docs for Mongoose, the ODM library used with Node.js.
- [MongoDB Node.js Driver](https://docs.mongodb.com/drivers/node/) – Learn how to interact with MongoDB directly using the official Node.js driver.

## Security Best Practices

To keep your MongoDB database and application secure, follow these guidelines:

### 1. Environment Variables
- **Never** commit connection strings or secrets to version control.
- Store credentials in a local `.env` file during development.
- Use a secure environment variable manager (or secret manager) for production.

### 2. IP Whitelist
- Only whitelist the IP addresses you actually need.
- Remove unused IP addresses promptly.
- For production deployments, prefer **VPC peering** or private endpoints instead of broad IP access.

### 3. Database User
- Use **strong, unique passwords** for all database users.
- Apply the **principle of least privilege**: grant only the permissions a user needs.
- Rotate credentials on a regular schedule.

### 4. Monitoring
- Enable **Database Alerts** in MongoDB Atlas.
- Review connection and activity logs frequently.
- Configure performance alerts to detect slow queries or resource spikes early.

This guide provides:
- Detailed setup instructions
- Security best practices
- Connection code examples
- Troubleshooting section
- Additional resources

You can:
1. Add more details to any section
2. Include more specific examples
3. Add other sections you think might helpful
