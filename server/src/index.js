import dotenv from 'dotenv';
import { createApp } from './app.js';
import { connectDb } from './config/db.js';

dotenv.config();

const port = process.env.PORT || 5000;

await connectDb(process.env.MONGODB_URI);

createApp().listen(port, () => {
  console.log(`Workflow API listening on http://localhost:${port}`);
});
