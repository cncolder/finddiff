# FindDiff


### Play audio on android stock browser.

Android stock browser not support web audio api. The html audio tag is not work on cordova. We need [crosswalk][crosswalk] chromium webview.

### Crosswalk WebGL is not enabled in some old device.

Some old device GPU is in chromium [blacklist][blacklist] because it cannot full support WebGL. We can disable this blacklist in file `platforms/android/assets/xwalk-command-line`
```
xwalk --ignore-gpu-blacklist
```

If a device has a blacklisted GPU, canvas elements are not hardware accelerated.

### App name locale.

For iOS:

For android: Copy `platforms/android/res/values` to `values-zh-rcn`. Then modify `strings.xml`.


[crosswalk]: https://crosswalk-project.org/documentation/cordova/crosswalk_with_cordova4.html
[blacklist]: https://crosswalk-project.org/documentation/about/faq.html#Canvas-and-WebGL-support
