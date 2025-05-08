const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../SupabaseClient');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Validate metadata function
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
    // Additional validation check on the server side
    for (let i = 0; i < metadataList.length; i++) {
      const validation = validateMetadata(metadataList[i]);
      if (!validation.valid) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: `Missing required fields for file ${i + 1}: ${validation.missingFields.join(', ')}` 
        });
      }
    }

    // Process files and upload
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

      // Process dates - no need to convert empty strings to null as we've already validated
      const start_date = metadata.start_date;
      const expiration_date = metadata.expiration_date;

      // Current date for upload timestamp
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

router.get('/files', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('file_uploads')
      .select('*')
      .order('uploaded_date', { ascending: false });

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
    }));

    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

module.exports = router;