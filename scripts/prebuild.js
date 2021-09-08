const fs = require('fs/promises');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');

/**
 * Completely remove the dist directory prior to building
 */
async function cleanDistDir() {
  await fs.rm(distDir, { recursive: true, force: true });
}

cleanDistDir();
