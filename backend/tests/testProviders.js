#!/usr/bin/env node
/**
 * AI Provider Test Suite
 * Tests connectivity, rate limits, and functionality for all configured providers
 *
 * Usage: node backend/tests/testProviders.js [--provider=<name>] [--verbose]
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from project root
dotenv.config({ path: path.join(__dirname, "../../.env") });

import { aiManager } from "../services/aiProviders.js";

// Parse command line arguments
const args = process.argv.slice(2);
const targetProvider = args
  .find((a) => a.startsWith("--provider="))
  ?.split("=")[1];
const verbose = args.includes("--verbose") || args.includes("-v");

// Test configuration
const TEST_CONFIG = {
  timeout: 60000, // 60 second timeout per test
  retryAttempts: 2,
  retryDelay: 2000,
  testMessage: [
    {
      role: "user",
      content:
        'Respond with exactly: "Provider test successful." Nothing else.',
    },
  ],
};

// Color output helpers
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  verbose: (msg) =>
    verbose && console.log(`${colors.dim}  ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.cyan}═══ ${msg} ═══${colors.reset}`),
};

/**
 * Test a single provider with a specific model
 */
async function testProviderModel(providerName, model, options = {}) {
  const startTime = Date.now();

  try {
    const result = await aiManager.createCompletion(
      providerName,
      model,
      TEST_CONFIG.testMessage,
      {
        temperature: 0.1,
        maxTokens: 50,
        ...options,
      },
    );

    const duration = Date.now() - startTime;

    return {
      success: true,
      model,
      provider: providerName,
      duration,
      response: result.content?.substring(0, 100),
      usage: result.usage,
    };
  } catch (error) {
    const duration = Date.now() - startTime;

    return {
      success: false,
      model,
      provider: providerName,
      duration,
      error: error.message,
      errorType: categorizeError(error),
    };
  }
}

/**
 * Categorize errors for better reporting
 */
function categorizeError(error) {
  const msg = error.message.toLowerCase();

  if (
    msg.includes("rate limit") ||
    msg.includes("429") ||
    msg.includes("too many requests")
  ) {
    return "RATE_LIMIT";
  }
  if (
    msg.includes("api key") ||
    msg.includes("unauthorized") ||
    msg.includes("401")
  ) {
    return "AUTH_ERROR";
  }
  if (
    msg.includes("not found") ||
    msg.includes("404") ||
    msg.includes("model")
  ) {
    return "MODEL_NOT_FOUND";
  }
  if (
    msg.includes("timeout") ||
    msg.includes("econnrefused") ||
    msg.includes("network")
  ) {
    return "NETWORK_ERROR";
  }
  if (msg.includes("quota") || msg.includes("insufficient")) {
    return "QUOTA_EXCEEDED";
  }
  return "UNKNOWN";
}

/**
 * Test all models for a provider
 */
async function testProvider(providerName, providerConfig) {
  log.header(`Testing ${providerName.toUpperCase()}`);

  const results = {
    provider: providerName,
    models: [],
    summary: { passed: 0, failed: 0, rateLimited: 0 },
  };

  for (const model of providerConfig.models) {
    log.info(`Testing model: ${model}`);

    let result = await testProviderModel(providerName, model);

    // Retry on rate limit
    if (!result.success && result.errorType === "RATE_LIMIT") {
      log.warn(
        `Rate limited, waiting ${TEST_CONFIG.retryDelay}ms before retry...`,
      );
      await sleep(TEST_CONFIG.retryDelay);
      result = await testProviderModel(providerName, model);
    }

    if (result.success) {
      log.success(`${model} - ${result.duration}ms`);
      log.verbose(`Response: ${result.response}`);
      if (result.usage) {
        log.verbose(`Tokens: ${result.usage.total_tokens || "N/A"}`);
      }
      results.summary.passed++;
    } else {
      if (result.errorType === "RATE_LIMIT") {
        log.warn(`${model} - Rate Limited`);
        results.summary.rateLimited++;
      } else {
        log.error(`${model} - ${result.error}`);
      }
      results.summary.failed++;
    }

    results.models.push(result);

    // Small delay between tests to avoid rate limits
    await sleep(500);
  }

  return results;
}

/**
 * Test rate limit handling
 */
async function testRateLimitHandling(providerName, model) {
  log.header(`Rate Limit Test: ${providerName}`);

  const requests = [];
  const concurrency = 5;

  log.info(`Sending ${concurrency} concurrent requests...`);

  for (let i = 0; i < concurrency; i++) {
    requests.push(testProviderModel(providerName, model));
  }

  const results = await Promise.all(requests);

  const successful = results.filter((r) => r.success).length;
  const rateLimited = results.filter(
    (r) => r.errorType === "RATE_LIMIT",
  ).length;

  log.info(
    `Results: ${successful}/${concurrency} successful, ${rateLimited} rate limited`,
  );

  return {
    total: concurrency,
    successful,
    rateLimited,
    failed: concurrency - successful - rateLimited,
  };
}

/**
 * Test fallback mechanism
 */
async function testFallback() {
  log.header("Fallback Mechanism Test");

  try {
    const startTime = Date.now();

    const result = await aiManager.createCompletionWithFallback(
      "groq", // Start with groq
      "llama-3.3-70b-versatile",
      TEST_CONFIG.testMessage,
      { temperature: 0.1, maxTokens: 50 },
    );

    const duration = Date.now() - startTime;

    log.success(`Fallback succeeded using: ${result.provider} (${duration}ms)`);
    return { success: true, provider: result.provider, duration };
  } catch (error) {
    log.error(`Fallback failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Generate test report
 */
function generateReport(allResults) {
  console.log("\n");
  log.header("TEST SUMMARY REPORT");
  console.log("");

  let totalPassed = 0;
  let totalFailed = 0;
  let totalRateLimited = 0;

  console.log("Provider Results:");
  console.log("─".repeat(60));

  for (const result of allResults) {
    const { provider, summary } = result;
    totalPassed += summary.passed;
    totalFailed += summary.failed;
    totalRateLimited += summary.rateLimited;

    const status = summary.failed === 0 ? colors.green + "✓" : colors.red + "✗";
    console.log(
      `${status}${colors.reset} ${provider.padEnd(15)} | ` +
        `Passed: ${String(summary.passed).padStart(2)} | ` +
        `Failed: ${String(summary.failed).padStart(2)} | ` +
        `Rate Limited: ${summary.rateLimited}`,
    );
  }

  console.log("─".repeat(60));
  console.log(
    `${"TOTAL".padEnd(17)} | ` +
      `Passed: ${String(totalPassed).padStart(2)} | ` +
      `Failed: ${String(totalFailed).padStart(2)} | ` +
      `Rate Limited: ${totalRateLimited}`,
  );
  console.log("");

  // Recommendations
  if (totalRateLimited > 0) {
    log.warn("Rate limits detected. Recommendations:");
    console.log("  • Wait between API calls (built into fallback system)");
    console.log("  • Use multiple providers for redundancy");
    console.log("  • Consider upgrading API tier for higher limits");
    console.log("");
  }

  if (totalFailed > 0) {
    log.warn("Some tests failed. Check:");
    console.log("  • API keys are valid and have credits");
    console.log("  • Models names are correct for each provider");
    console.log("  • Network connectivity to API endpoints");
    console.log("");
  }

  return {
    totalPassed,
    totalFailed,
    totalRateLimited,
    success: totalFailed === 0,
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Main test runner
 */
async function runTests() {
  console.log("\n🧪 AI Provider Test Suite");
  console.log("═".repeat(60));
  console.log(`Started: ${new Date().toISOString()}`);

  // Check available providers
  const availableProviders = aiManager.getAvailableProviders();
  const providerNames = Object.keys(availableProviders);

  log.info(`Configured providers: ${providerNames.join(", ") || "None"}`);

  if (providerNames.length === 0) {
    log.error("No AI providers configured! Add API keys to .env file.");
    process.exit(1);
  }

  const allResults = [];

  // Test specific provider or all
  const providersToTest = targetProvider
    ? { [targetProvider]: availableProviders[targetProvider] }
    : availableProviders;

  for (const [name, config] of Object.entries(providersToTest)) {
    if (!config) {
      log.warn(`Provider "${name}" not configured, skipping...`);
      continue;
    }

    const result = await testProvider(name, config);
    allResults.push(result);

    // Delay between providers
    await sleep(1000);
  }

  // Test fallback mechanism
  if (!targetProvider) {
    await testFallback();
  }

  // Generate report
  const report = generateReport(allResults);

  console.log(`\nCompleted: ${new Date().toISOString()}`);
  console.log("═".repeat(60));

  // Exit with appropriate code
  process.exit(report.success ? 0 : 1);
}

// Run tests
runTests().catch((error) => {
  console.error("Test suite crashed:", error);
  process.exit(1);
});
