const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/mern-starter',
  port: process.env.PORT || 8000,
  secure_port: process.env.SECURE_PORT || 8443,
};

export default config;
