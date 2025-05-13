const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../SupabaseClient');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const validateMetadata = (metadata) => {
  const requiredFields = ['folder', 'description', 'owned_by', 'maintained_by', 'start_date', 'expiration_date'];
  const missingFields = [];

  requiredFields.forEach(field => {
    if (!metadata[field] || metadata[field].trim() === '') {
      missingFields.push(field);
    }
  });

  return {
    valid: missingFields.length === 0,
    missingFields
  };
};



router.post('/', upload.array('files'), async (req, res) => {
  const files = req.files;
  const metadataList = JSON.parse(req.body.metadata || '[]');
  const uploadedMetadata = [];

  try {
    
    for (let i = 0; i < metadataList.length; i++) {
      const validation = validateMetadata(metadataList[i]);
      if (!validation.valid) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: `Missing required fields for file ${i + 1}: ${validation.missingFields.join(', ')}` 
        });
      }
    }

    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const metadata = metadataList[i] || {};

      const { originalname, buffer, mimetype, size } = file;
      const timestamp = Date.now();
      const filePath = `uploads/${timestamp}-${originalname}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, buffer, {
          contentType: mimetype,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase
        .storage
        .from('documents')
        .getPublicUrl(filePath);

      const url = publicUrlData?.publicUrl || null;

     
      const start_date = metadata.start_date;
      const expiration_date = metadata.expiration_date;

      
      const uploaded_date = new Date().toISOString();

      const { data: inserted, error: dbError } = await supabase
        .from('file_uploads')
        .insert([
          {
            filename: originalname,
            filepath: filePath,
            mimetype,
            size,
            url,
            folder: metadata.folder,
            description: metadata.description,
            owned_by: metadata.owned_by,
            maintained_by: metadata.maintained_by,
            start_date: start_date,
            expiration_date: expiration_date,
            uploaded_date: uploaded_date,
          },
        ])
        .select();

      if (dbError) throw dbError;

      uploadedMetadata.push(inserted[0]);
    }

    res.status(200).json({
      message: 'Files uploaded with metadata',
      files: uploadedMetadata,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Upload or DB insert failed', details: error.message });
  }
});

// Add to upload.js
router.put('/archive/:id', async (req, res) => {
  const { id } = req.params;
  const { archived } = req.body;

  try {
    const { data, error } = await supabase
      .from('file_uploads')
      .update({
        archived: archived,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.status(200).json(data[0]);
  } catch (error) {
    console.error('Archive Error:', error);
    res.status(500).json({ error: 'Failed to update archive status', details: error.message });
  }
});

router.get('/files', async (req, res) => {
  try {
    const { archived } = req.query;
    let query = supabase.from('file_uploads').select('*');

     if (archived !== undefined) {
      query = query.eq('archived', archived === 'true');
    }
    const { data, error } = await query.order('uploaded_date', { ascending: false });


    if (error) throw error;

    const files = data.map((file) => ({
      id: file.id,
      filename: file.filename,
      filepath: file.filepath,
      url: file.url,
      mimetype: file.mimetype,
      size: file.size,
      folder: file.folder,
      description: file.description,
      owned_by: file.owned_by,
      maintained_by: file.maintained_by,
      start_date: file.start_date,
      expiration_date: file.expiration_date,
      uploaded_date: file.uploaded_date,
      archived: file.archived || false
    }));

    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { metadata } = req.body;

  if (!metadata) {
    return res.status(400).json({ error: 'Metadata is required' });
  }

  try {
    // Validate metadata
    const validation = validateMetadata(metadata);
    if (!validation.valid) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: `Missing required fields: ${validation.missingFields.join(', ')}` 
      });
    }

    
    const {
      folder,
      description,
      owned_by,
      maintained_by,
      start_date,
      expiration_date
    } = metadata;

   
    const { data, error } = await supabase
      .from('file_uploads')
      .update({
        folder,
        description,
        owned_by,
        maintained_by,
        start_date,
        expiration_date,
        updated_at: new Date().toISOString(), // Add an updated_at timestamp
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    if (data.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Return the updated document
    res.status(200).json(data[0]);
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ error: 'Failed to update document', details: error.message });
  }
});

module.exports = router;