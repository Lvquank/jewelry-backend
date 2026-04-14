const https = require('https');

const domains = [
    'jewelry-backend-k3nmsvth0-quankle2004-2971s-projects.vercel.app',
    'jewelry-backend-pink.vercel.app'
];

async function testDomain(domain) {
    return new Promise((resolve) => {
        console.log(`\n🧪 Testing: https://${domain}`);
        console.log('─'.repeat(70));
        
        const url = `https://${domain}/api/product/get-all?limit=1`;
        
        const req = https.get(url, { timeout: 15000 }, (res) => {
            let data = '';
            
            res.on('data', chunk => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log(`✅ Status: ${res.statusCode}`);
                if (data.includes('status') || data.includes('OK')) {
                    console.log('✅ API Hoạt động!');
                    console.log(`Preview: ${data.substring(0, 150)}...`);
                } else {
                    console.log(`Response: ${data.substring(0, 200)}`);
                }
                resolve(true);
            });
        });
        
        req.on('error', (err) => {
            console.log(`❌ Error: ${err.message.substring(0, 120)}`);
            resolve(false);
        });
        
        req.on('timeout', () => {
            console.log('⏱️  Timeout (server không phản hồi)');
            req.destroy();
            resolve(false);
        });
    });
}

async function testAll() {
    console.log('\n🔍 Backend Domain Test\n');
    
    for (const domain of domains) {
        await testDomain(domain);
    }
    
    console.log('\n✅ Test completed');
    process.exit(0);
}

testAll();
