const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

// Delete node_modules
rimraf.sync(path.join(__dirname, 'node_modules'));

// Delete package-lock.json if it exists
try {
  fs.unlinkSync(path.join(__dirname, 'package-lock.json'));
} catch (err) {
  // Ignore if file doesn't exist
}

console.log('Cleanup completed successfully!'); 