const multer = require('multer');

// 1️⃣ Memory Storage is required to send buffers to Supabase
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

/**
 * 2️⃣ Route Helper: uploadMarketplaceFiles
 * This allows the router to accept multiple specific fields (images, video, docs)
 */
const uploadMarketplaceFiles = (fields) => {
  return upload.fields(fields);
};

/**
 * 3️⃣ Controller Helper: uploadToSupabase
 * Use this inside your controller to actually move the file to the cloud
 */
const uploadToSupabase = async (file, bucket, folder = '') => {
  if (!file) return null;

  const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};

// 4️⃣ EXPORT EVERYTHING
module.exports = { 
  upload, 
  uploadMarketplaceFiles, // This fixes your current error
  uploadToSupabase 
};