const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read the current version from package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
let [major, minor, patch] = packageJson.version.split('.').map(Number);

// Increment patch version
patch++;

// Construct new version string
const newVersion = `${major}.${minor}.${patch}`;

console.log(`Current version: ${packageJson.version}`);
console.log(`New version: ${newVersion}`);

// Update package.json with new version
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('Creating new release...');

try {
  // Create a new commit with version bump
  execSync('git add package.json');
  execSync(`git commit -m "Bump version to ${newVersion}"`);

  // Create a new tag
  execSync(`git tag v${newVersion}`);

  // Push changes and tag to remote
  execSync('git push origin main');
  execSync(`git push origin v${newVersion}`);

  console.log(`Successfully created new release v${newVersion}`);
} catch (error) {
  console.error('Error creating release:', error.message);
  process.exit(1);
}
