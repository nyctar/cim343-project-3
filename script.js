const fs = require('fs');
const path = require('path');
const dataDir = 'data-analysis';

// Create structure
const allData = { goals: {} };

// Get list of all geojson files
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.geojson'));

files.forEach(file => {
  // Parse filename to get goal number and year (e.g., sdg-goal1-2015.geojson)
  const match = file.match(/sdg-goal(\d+)-(\d+)\.geojson/);
  if (!match) return;
  
  const goalNumber = match[1];
  const year = match[2];
  
  // Initialize goal object if needed
  if (!allData.goals[goalNumber]) {
    allData.goals[goalNumber] = {};
  }
  
  // Read and parse the geojson file
  const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
  const geojson = JSON.parse(content);
  
  // Store just the features array
  allData.goals[goalNumber][year] = geojson.features;
});

// Write combined data to file
fs.writeFileSync(
  path.join(dataDir, 'all-sdg-data.json'), 
  JSON.stringify(allData, null, 2)
)