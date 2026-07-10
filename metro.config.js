const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname)

// Use Watchman (native, more reliable on Windows for large node_modules
// trees) instead of Metro's default Node-based crawler/watcher, which has
// a known crash/omission bug on Windows for this project.
// NOTE: intentionally `1`, not `true` - @expo/metro-config's loadUserConfig
// converts an exact `true` into `null` (meant to also skip a slower "native
// find" codepath), but @expo/metro-file-map's constructor then nullish-
// coalesces that `null` back to `false`, silently disabling Watchman
// entirely. A truthy-but-not-`true` value skips that lossy round-trip while
// still satisfying every other (non-strict) truthiness check in the chain.
config.resolver.useWatchman = 1

module.exports = withNativeWind(config, { input: './global.css' })