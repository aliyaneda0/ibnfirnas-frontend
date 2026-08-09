const { AndroidConfig, withAndroidStyles } = require('expo/config-plugins');

// expo-splash-screen hardcodes android:windowSplashScreenBehavior to
// "icon_preferred", which makes Android hold the splash for an icon
// animation beat before dismissing — even though our splash has no visible
// icon. Mod execution order is the reverse of plugin registration order
// (last-registered mod runs first), so this must be listed BEFORE
// expo-splash-screen in app.json for this overwrite to run after its
// styles.xml write, not before it.
const withSplashScreenIconBehavior = (config) => {
  return withAndroidStyles(config, (config) => {
    config.modResults = AndroidConfig.Styles.setStylesItem({
      xml: config.modResults,
      parent: { name: 'Theme.App.SplashScreen', parent: 'Theme.SplashScreen' },
      item: {
        $: { name: 'android:windowSplashScreenBehavior' },
        _: 'default',
      },
    });
    return config;
  });
};

module.exports = withSplashScreenIconBehavior;
