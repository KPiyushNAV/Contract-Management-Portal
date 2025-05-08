const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const uploadRoute = require('./routes/upload');


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/upload', uploadRoute);


const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.get('/download/:filename', async (req, res) => {
    const { filename } = req.params;
    const filePath = `uploads/${filename}`;
  
    const { data, error } = await supabase
      .storage
      .from('documents')
      .download(filePath);
  
    if (error) {
      console.error('Download error:', error.message);
      return res.status(500).json({ error: 'File download failed' });
    }
  
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', data.type);
    data.body.pipe(res);
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
