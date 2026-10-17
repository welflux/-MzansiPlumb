import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir:'./tests', fullyParallel:true, retries:0,
 use:{baseURL:'http://127.0.0.1:4173',headless:true,locale:'en-ZA',timezoneId:'Africa/Johannesburg',launchOptions:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{}},
 testMatch:'**/*.spec.ts',
 webServer:[{env:{AUTH_EMAIL_ENABLED:'false',REQUIRE_VERIFIED_EMAIL:'false',CLAMSCAN_PATH:'',BILLING_ENABLED:'false',BILLING_ACTIVATION_APPROVED:'false',PAYPAL_CLIENT_ID:'',PAYPAL_CLIENT_SECRET:'',PAYFAST_MERCHANT_ID:'',PAYFAST_MERCHANT_KEY:'',RESEND_API_KEY:'',NOTIFICATION_FROM:'',RESEND_WEBHOOK_SECRET:''},command:'APP_ORIGIN=http://127.0.0.1:4173 DATABASE_PATH=var/browser-tests.sqlite node server/index.mjs',url:'http://127.0.0.1:3001/api/health',reuseExistingServer:false},{command:'npm run dev -- --port 4173 --strictPort',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI}],
 projects:[{name:'desktop',use:{viewport:{width:1440,height:1000}}},{name:'mobile',use:{viewport:{width:390,height:844},isMobile:true,hasTouch:true}},{name:'small-mobile',use:{viewport:{width:320,height:740},isMobile:true,hasTouch:true}}]
});
