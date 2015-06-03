# Some notes must be wrote down.


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

### Version number.

iOS: version is 1.1, and build is 1.1.2.

Android: version name is 1.1, version code is 2. so version is 1.1.2.

```xml
<widget version="1.1" android-versionCode="2" ios-CFBundleVersion="1.1.2">
```

### Push notification.

iOS: Apple reject app that include push function code but not config in iTunes Connect. For cordova 5.0.0, these code is in `platforms/ios/FindDiff/Classes/AppDelegate.m`.

```objc platforms/ios/FindDiff/Classes/AppDelegate.m
    # ifndef DISABLE_PUSH_NOTIFICATIONS

        - (void)                                 application:(UIApplication*)application
            didRegisterForRemoteNotificationsWithDeviceToken:(NSData*)deviceToken
        {
            // re-post ( broadcast )
            NSString* token = [[[[deviceToken description]
                stringByReplacingOccurrencesOfString:@"<" withString:@""]
                stringByReplacingOccurrencesOfString:@">" withString:@""]
                stringByReplacingOccurrencesOfString:@" " withString:@""];

            [[NSNotificationCenter defaultCenter] postNotificationName:CDVRemoteNotification object:token];
        }

        - (void)                                 application:(UIApplication*)application
            didFailToRegisterForRemoteNotificationsWithError:(NSError*)error
        {
            // re-post ( broadcast )
            [[NSNotificationCenter defaultCenter] postNotificationName:CDVRemoteNotificationError object:error];
        }
    #endif
```

### Media plugin on iOS.

On iOS 8. Media plugin will crash when the first sound stop. `AVAudioSession.mm:646: -[AVAudioSession setActive:withOptions:error:]: Deactivating an audio session that has running I/O. All I/O should be stopped or paused prior to deactivating the audio session.` This [bug][mediabug] is came from a long time ago.

```objc platforms/ios/FindDiff/Plugins/cordova-plugin-media/CDVSound.m
    - (void)audioPlayerDidFinishPlaying:(AVAudioPlayer*)player successfully:(BOOL)flag
    {
        if (self.avSession) {
            // [self.avSession setActive:NO error:nil]; // comment this line.
        }
    }
```


[crosswalk]: https://crosswalk-project.org/documentation/cordova/crosswalk_with_cordova4.html
[blacklist]: https://crosswalk-project.org/documentation/about/faq.html#Canvas-and-WebGL-support
[mediabug]: https://issues.apache.org/jira/browse/CB-7599
