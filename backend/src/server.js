import env from './config/env.js';
import app from './app.js';
import { connectwithdb } from './config/database.js';
const PORT = env.PORT || 3000;

app.listen(PORT, async () => {
     await connectwithdb();
    console.log(`Server is running on port ${PORT}`);
   
});