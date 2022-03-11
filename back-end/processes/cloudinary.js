const cloudinary = require('cloudinary').v2;

cloudinary.config({
  api_key: "536288237287264",
  api_secret: "UX1CLDDG4YGDpBpyv0j23tTiqIg",
  cloud_name: "cod-erp",
});

const uploadDocument = async (filePath, filename) => {
    console.log(filename);
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: 'documents',
            resource_type: 'raw',
            public_id: `${filename}`
        });
        return uploadResult;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {uploadDocument};