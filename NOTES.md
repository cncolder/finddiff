# FindDiff


### Play audio on android stock browser.

Android stock browser is not support web audio api. The html audio tag is not work on cordova. We need [crosswalk][crosswalk] chromium webview.

### Crosswalk WebGL is not enabled in some old device.

Some old device GPU is in chromium [blacklist][blacklist] because it cannot full support WebGL. We can disable this blacklist in file `platforms/android/assets/xwalk-command-line`
```
xwalk --ignore-gpu-blacklist
```

If a device has a blacklisted GPU, canvas elements are not hardware accelerated.

### Localize app display name.

For iOS: edit `platforms/ios/FindDiff.xcodeproj/project.pbxproj`, search `knownRegions` then append `zh,` to it. Now create `Resources/InfoPlist.strings` in XCode. Localize it to Chinese. Add a line:
```
CFBundleDisplayName = "找不同";
```

For android: Copy `platforms/android/res/values` to `values-zh-rCN`. Then modify `strings.xml`.


[crosswalk]: https://crosswalk-project.org/documentation/cordova/crosswalk_with_cordova4.html
[blacklist]: https://crosswalk-project.org/documentation/about/faq.html#Canvas-and-WebGL-support
