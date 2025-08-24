if (process.env.NODE_ENV !== 'production') require('dotenv').config();

export default {
  DASHBOARD_DOMAIN: process.env.DASHBOARD_DOMAIN || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_TOKEN: process.env.SUPABASE_TOKEN || '',
  MASTER_SECRET: process.env.MASTER_SECRET || '',
  PORT: process.env.PORT || 3000,
};
