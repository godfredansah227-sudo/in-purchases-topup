const fs = require('fs');
const path = require('path');

const srcDirs = [
  'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\defb9861-1c9f-462b-88bc-b4212b74c98c',
  'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\a217631a-70ed-49a7-a567-c443a76fc8ec'
];
const destDir = path.join(__dirname, 'public', 'assets', 'images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

srcDirs.forEach(srcDir => {
  if (fs.existsSync(srcDir)) {
    const files = fs.readdirSync(srcDir);
    files.filter(f => f.endsWith('.png') || f.endsWith('.jpg')).forEach(file => {
      const srcPath = path.join(srcDir, file);
      if (file.includes('pubg_mobile_cover')) {
        fs.copyFileSync(srcPath, path.join(destDir, 'pubg_mobile_cover.png'));
        console.log('Copied pubg_mobile_cover.png');
      }
      if (file.includes('war_planet_online_cover')) {
        fs.copyFileSync(srcPath, path.join(destDir, 'war_planet_online_cover.png'));
        console.log('Copied war_planet_online_cover.png');
      }
      fs.copyFileSync(srcPath, path.join(destDir, file));
      console.log('Copied:', file);
    });
  }
});
