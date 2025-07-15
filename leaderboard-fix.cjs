const fs = require('fs');
const path = require('path');

console.log('🎯 LEADERBOARD INTERSECTION OBSERVER FIX');

function analyzeLeaderBoard() {
  const leaderBoardPath = './src/components/LeaderBoard.jsx';
  
  if (!fs.existsSync(leaderBoardPath)) {
    console.log('❌ LeaderBoard.jsx not found!');
    return false;
  }
  
  const content = fs.readFileSync(leaderBoardPath, 'utf8');
  const lines = content.split('\n');
  
  console.log(`📋 File: ${content.length} chars, ${lines.length} lines`);
  console.log('\n�� First 10 lines:');
  lines.slice(0, 10).forEach((line, index) => {
    const lineNum = index + 1;
    const hasWrongImport = line.includes('useIntersectionObserver');
    const marker = hasWrongImport ? ' ⚠️  WRONG IMPORT!' : '';
    console.log(`   ${lineNum}: ${line}${marker}`);
  });
  
  return !content.includes('useIntersectionObserver');
}

function fixLeaderBoard() {
  const leaderBoardPath = './src/components/LeaderBoard.jsx';
  
  console.log('\n🔧 Fixing LeaderBoard.jsx...');
  
  let content = fs.readFileSync(leaderBoardPath, 'utf8');
  fs.writeFileSync(leaderBoardPath + '.backup', content);
  
  // Apply ALL fixes
  const fixes = [
    { from: /import { useIntersectionObserver }/g, to: 'import { useInView }' },
    { from: /useIntersectionObserver/g, to: 'useInView' },
    { from: /const \[ref, inView\] = useInView\(/g, to: 'const { ref, inView } = useInView(' }
  ];
  
  fixes.forEach(fix => {
    const before = content.match(fix.from);
    content = content.replace(fix.from, fix.to);
    if (before) {
      console.log(`   ✅ Fixed: ${before.length} replacement(s)`);
    }
  });
  
  fs.writeFileSync(leaderBoardPath, content);
  console.log('✅ LeaderBoard.jsx fixed');
  
  return true;
}

function searchAllFiles() {
  const results = [];
  function searchDir(dir) {
    try {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory() && !['node_modules', '.git', 'dist'].includes(file)) {
          searchDir(filePath);
        } else if (stat.isFile() && /\.(js|jsx)$/.test(file)) {
          const content = fs.readFileSync(filePath, 'utf8');
          if (content.includes('useIntersectionObserver')) {
            const lines = content.split('\n');
            lines.forEach((line, index) => {
              if (line.includes('useIntersectionObserver')) {
                results.push({ file: filePath, line: index + 1, content: line.trim() });
              }
            });
          }
        }
      });
    } catch (error) {}
  }
  searchDir('./src');
  return results;
}

function nuclearCacheClean() {
  console.log('\n💥 Nuclear cache cleaning...');
  ['node_modules/.vite', 'dist', '.vite', 'node_modules/.cache'].forEach(cache => {
    if (fs.existsSync(cache)) {
      console.log(`💥 Destroying ${cache}...`);
      fs.rmSync(cache, { recursive: true, force: true });
    }
  });
}

try {
  console.log('🔍 Analyzing LeaderBoard.jsx...');
  const isClean = analyzeLeaderBoard();
  
  if (!isClean) {
    fixLeaderBoard();
  }
  
  console.log('\n🔍 Checking ALL files...');
  const problems = searchAllFiles();
  
  if (problems.length > 0) {
    console.log('🚨 Found problems in:');
    problems.forEach(p => console.log(`   ${p.file}:${p.line}`));
    
    // Fix each file
    const uniqueFiles = [...new Set(problems.map(p => p.file))];
    uniqueFiles.forEach(file => {
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace(/import { useIntersectionObserver }/g, 'import { useInView }');
      content = content.replace(/useIntersectionObserver/g, 'useInView');
      content = content.replace(/const \[ref, inView\] = useInView\(/g, 'const { ref, inView } = useInView(');
      fs.writeFileSync(file, content);
      console.log(`✅ Fixed ${file}`);
    });
  }
  
  nuclearCacheClean();
  
  console.log('\n🎉 LEADERBOARD FIX COMPLETE!');
  console.log('📋 Next: npm run dev');
  
} catch (error) {
  console.error('💥 Error:', error.message);
}
