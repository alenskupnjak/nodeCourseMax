const fs = require('fs');

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    try {
      console.log('prosao');
      
    } catch (error) {
      console.log(error);
      
    }
  });
};

exports.deleteFile = deleteFile;
