#!/usr/bin/env node

/**
 * Quick API connectivity test
 * Run with: node test-api.mjs
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
config({ path: join(__dirname, '.env.local') });

const BASE_URL = process.env.NUNOMIX_BASE_URL || 'https://nunodrama.my.id/api/nunomix';
const TOKEN = process.env.NUNOMIX_TOKEN || '';

console.log('🔍 Testing NunoMix API connectivity...\n');
console.log('Base URL:', BASE_URL);
console.log('Token:', TOKEN ? `${TOKEN.substring(0, 10)}...` : '⚠️  NOT SET');
console.log('');

if (!TOKEN) {
  console.error('❌ ERROR: NUNOMIX_TOKEN is not set in .env.local');
  process.exit(1);
}

async function testEndpoint(name, path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('token', TOKEN);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  
  const start = Date.now();
  console.log(`Testing ${name}...`);
  console.log(`  URL: ${path}`);
  
  try {
    const res = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(15000),
    });
    
    const elapsed = Date.now() - start;
    const text = await res.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error(`  ❌ FAILED: Invalid JSON response`);
      console.error(`  Response: ${text.substring(0, 200)}`);
      return false;
    }
    
    if (!res.ok) {
      console.error(`  ❌ FAILED: HTTP ${res.status}`);
      console.error(`  Response:`, data);
      return false;
    }
    
    // Check envelope
    const code = data.code;
    const errMsg = data.error_msg || '';
    
    if (code === 10000 || code === 200) {
      const itemCount = Array.isArray(data.result) 
        ? data.result.length 
        : (data.result?.vod_list?.length || 0);
      console.log(`  ✅ SUCCESS (${elapsed}ms)`);
      console.log(`     Code: ${code}`);
      console.log(`     Items: ${itemCount}`);
      return true;
    } else {
      console.error(`  ❌ FAILED: Error code ${code}`);
      console.error(`     Message: ${errMsg || data.message}`);
      return false;
    }
    
  } catch (err) {
    const elapsed = Date.now() - start;
    console.error(`  ❌ FAILED (${elapsed}ms): ${err.message}`);
    return false;
  }
}

async function runTests() {
  const results = [];
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  results.push(await testEndpoint('All Drama (page 1)', '/all_drama', { page: 1, type_id: 0 }));
  console.log('');
  
  results.push(await testEndpoint('Recommend (page 1)', '/recommend', { page: 1, vod_type: 0 }));
  console.log('');
  
  results.push(await testEndpoint('Search (keyword: love)', '/search', { keyword: 'love', page: 1 }));
  console.log('');
  
  results.push(await testEndpoint('Detail (vod_id: 409376)', '/detail', { vod_id: '409376' }));
  console.log('');
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const passed = results.filter(Boolean).length;
  const total = results.length;
  
  if (passed === total) {
    console.log(`✅ All tests passed (${passed}/${total})`);
    console.log('\n🎉 API is working correctly!\n');
    process.exit(0);
  } else {
    console.error(`❌ Some tests failed (${passed}/${total})`);
    console.error('\n⚠️  Check your NUNOMIX_TOKEN or API connectivity\n');
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('\n❌ Test runner failed:', err);
  process.exit(1);
});
