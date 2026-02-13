import cloudinary from '../config/cloudinary.config.js';
import fs from 'fs';

const uploadOnCloudinary = async (localFilePath, folderName) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: `eduhelp/${folderName}`,
      resource_type: 'auto',
    });

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return {
      url: response.secure_url,
      public_id: response.public_id,
      resource_type: response.resource_type,
    };
  } catch (error) {
    console.log('❌ Upload error:', error.message);

    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    if (!publicId) return null;

    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return response;
  } catch (error) {
    console.log('❌ Delete error:', error.message);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
