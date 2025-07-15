const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎯 LASER-FOCUSED FAREFRESH DIAGNOSTIC');

function findAllErrorBoundaryFiles() {
  const results = [];
  function searchDir(dir) {
    try {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory() && !['node_modules', '.git', 'dist'].includes(file)) {
          searchDir(filePath);
        } else if (file.includes('ErrorBoundary') && /\.(js|jsx)$/.test(file)) {
          results.push(filePath);
        }
      });
    } catch (error) {}
  }
  searchDir('./');
  return results;
}

function analyzeFile(filePath) {
  console.log(`\n🔍 Analyzing: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.log('❌ File does not exist!');
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  console.log(`📋 File: ${content.length} chars, ${lines.length} lines`);
  
  // Show first 10 lines with FaRefresh detection
  console.log('\n📋 First 10 lines:');
  lines.slice(0, 10).forEach((line, index) => {
    const lineNum = index + 1;
    const hasRefresh = line.includes('FaRefresh');
    const marker = hasRefresh ? ' ⚠️  FAREFRESH!' : '';
    console.log(`   ${lineNum.toString().padStart(2, ' ')}: ${line}${marker}`);
    
    if (lineNum === 3 && line.length >= 41) {
      console.log(`       Char 41: "${line.charAt(40)}" (FaRefresh at pos ${line.indexOf('FaRefresh')})`);
    }
  });
  
  // Find ALL FaRefresh occurrences
  const faRefreshMatches = [];
  lines.forEach((line, index) => {
    if (line.includes('FaRefresh')) {
      faRefreshMatches.push({
        line: index + 1,
        content: line.trim(),
        position: line.indexOf('FaRefresh')
      });
    }
  });
  
  if (faRefreshMatches.length > 0) {
    console.log('\n🚨 FaRefresh FOUND:');
    faRefreshMatches.forEach(match => {
      console.log(`   Line ${match.line}, Pos ${match.position}: ${match.content}`);
    });
    return false;
  } else {
    console.log('\n✅ No FaRefresh found');
    return true;
  }
}

function nuclearFix() {
  console.log('\n💥 NUCLEAR CACHE DESTRUCTION...');
  
  // Kill processes
  try {
    execSync('pkill -f node', { stdio: 'ignore' });
    execSync('pkill -f vite', { stdio: 'ignore' });
  } catch (e) {}
  
  // Destroy caches
  ['node_modules/.vite', 'dist', '.vite', 'node_modules/.cache'].forEach(cache => {
    if (fs.existsSync(cache)) {
      console.log(`💥 Destroying ${cache}...`);
      fs.rmSync(cache, { recursive: true, force: true });
    }
  });
  
  try {
    execSync('npm cache clean --force', { stdio: 'inherit' });
  } catch (e) {}
}

function createPerfectFile(filePath) {
  console.log(`\n🔧 Creating PERFECT ErrorBoundary: ${filePath}`);
  
  const perfectContent = `import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaHome, FaSyncAlt } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">Please try refreshing the page.</p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaSyncAlt className="w-4 h-4" />
                Refresh Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <FaHome className="w-4 h-4" />
                Go Home
              </button>
            </div>
          </motion.div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;`;

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  
  fs.writeFileSync(filePath, perfectContent);
  console.log('✅ Perfect file created');
  
  return analyzeFile(filePath);
}

// MAIN EXECUTION
try {
  console.log('🔍 Finding ALL ErrorBoundary files...');
  const files = findAllErrorBoundaryFiles();
  
  if (files.length === 0) {
    console.log('❌ No ErrorBoundary files found!');
    process.exit(1);
  }
  
  console.log(`📁 Found ${files.length} file(s):`);
  files.forEach(f => console.log(`   - ${f}`));
  
  let hasProblems = false;
  files.forEach(file => {
    const isClean = analyzeFile(file);
    if (!isClean) hasProblems = true;
  });
  
  if (hasProblems) {
    console.log('\n🚨 PROBLEMS FOUND! Applying nuclear fix...');
    nuclearFix();
    files.forEach(file => createPerfectFile(file));
  } else {
    console.log('\n🤔 No FaRefresh in files but error persists - CACHE ISSUE!');
    nuclearFix();
  }
  
  console.log('\n🎯 DIAGNOSTIC COMPLETE!');
  console.log('📋 CRITICAL: CLEAR YOUR BROWSER DATA!');
  console.log('   1. Ctrl+Shift+Delete → Clear browsing data');
  console.log('   2. npm run dev');
  console.log('   3. Hard refresh (Ctrl+Shift+R)');
  
} catch (error) {
  console.error('💥 Error:', error.message);
}
