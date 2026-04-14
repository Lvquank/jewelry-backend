#!/usr/bin/env node
/**
 * Test Backend API - Quick Health Check
 */

const http = require('http');
const https = require('https');

const domains = [
    'jewelry-backend-k3nmsvth0-quankle2004-2971s-projects.vercel.app',
    'jewelry-backend-pink.vercel.app'
];

const tests = [
    '/api/product/get-all?limit=1',
    '/api/product/get-all-type',
    '/api/product/get-all-category'
];

function makeRequest(domain, path) {
    return new Promise((resolve) => {
        const url = `https://${domain}${path}`;
        
        https.get(url, { timeout: 10000 }, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    body: body.substring(0, 200),
                    ok: res.statusCode === 200
                });
            });
        }).on('error', (err) => {
            resolve({ status: 'ERROR', body: err.message, ok: false });
        }).on('timeout', () => {
            resolve({ status: 'TIMEOUT', body: 'Request timeout', ok: false });
        });
    });
}

async function run() {
    console.log('\n📡 Backend Health Check\n');
    console.log('=' .repeat(70));
    
    for (const domain of domains) {
        console.log(`\n🌐 Domain: ${domain}`);
        console.log('-'.repeat(70));
        
        let passCount = 0;
        
        for (const path of tests) {
            process.stdout.write(`  Testing ${path}... `);
            const result = await makeRequest(domain, path);
            
            if (result.ok) {
                console.log('✅ OK');
                passCount++;
            } else {
                console.log(`❌ ${result.status}`);
            }
        }
        
        console.log(`\n  Result: ${passCount}/${tests.length} endpoints working`);
        
        if (passCount === tests.length) {
            console.log(`  🎉 Domain ${domain} is ACTIVE and WORKING!\n`);
            process.exit(0);
        }
    }
    
    console.log('\n⚠️  Neither domain is responding.');
    console.log('Next steps:');
    console.log('  1. Check Vercel Logs for errors');
    console.log('  2. Verify Environment Variables are set');
    console.log('  3. Check MongoDB connection\n');
    process.exit(1);
}

run();
