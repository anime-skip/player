# Changelog

## `v1.2.2`

### Fixes

- Not showing timestamps when there is a capitalization difference between show names (2a9a2de6027bb9ff4516cf05abbd98b5bbbe1b5b)

## `v1.2.1`

### Fixes

- Disable screenshots in chrome because of the browser's security issues (11603ac87d2deecd994d5d1f32ea07400e1868d0)

## `v1.2.0`

### Enhancements

- Templates! Reduce the amount of repetitive timestamps by sharing them between episodes (b6faede280f96659206ab5350343ea46ab3c7c36)
- Screenshot keyboard shortcut (d98db5eeab9c65c3ffa7f655cba9e89896aef6e8)
- More visual changes to the view/edit timestamps panel (ee3d08a21c6c0d178bddd74fd8b34516ef2da078, 25bc434ac745ad09bcc172827fbc05e98a632794)

### Fixes

- Player occasionally hung while saving timestamps, fixed! (17e0387b89676675e23cb15485c5572d1af10962)
- Odd coloring of keyboard shortcut button (79e7ff51d50af8fdbf2e2182196cf3884f68d199)

## `v1.1.5`

### Fixes

- Allow showing popup on Crunchyroll Beta in Chrome (4206c65e7f7e05e8ea3b6d64928ec085f736dd5c)

## `v1.1.4`

### Fixes

- Support Crunchyroll's new beta website (57cf10177142bed03be4b7285857907ff9d5f248)
- Better line wrapping for the show and service header (17a121ecce0c10ff3331864aed26dfd8ce1416c1)

### Changes

- Added logo to top left of player (700c91ba1b5056a95329f2fb73ef96adc388f6a0)

## `v1.1.3`

### Fixes

- Lookup funimation details on both their new and old pages (da3033c5f9887c0008625710aa790cdf7aff22d6)

## `v1.1.2`

### Fixes

- Hotfix after Funimation's website update (3c20b40b27a41aaa813c558316e2926c637c2f91)
- Better logic for showing and hiding the "Connect to Anime Skip" button (003ad9627fc20be72a79562a981c6e2b16f8bdf8)

## `v1.1.1`

### Fixes

- Popup and options page were not restoring your logged in state when re-opened (816938b196697147ee6eafc71b24e0042a08d12c)
- Volume icon clipping (8a3097678937b6ea355a1fb1aaaf65eaf9f5fa14)
- Chrome popup is small
- Login button in extension options works
- "Player Settings" integration on the website's account page fixed
- Clear account data when logging out
- Fix text sizes for chrome
- Fix login full screen size and fit for chrome

## `v1.1.0`

### Enhancements

- Visual overhaul
- Vue 3 migration, better performance under the hood
- Basic Crunchyroll support added
- Improved volume controls (restore volume on un-mute, selecting a volume un-mutes)
- Minor UI tweaks to the timeline
- Added keyboard shortcuts (Toggle fullscreen: `G`, Volume up: `↑`, Volume down: `↓`, Save timestamps: `ctrl+ENTER`, Discard timestamps: `` ctrl+` ``)
- Changed keyboard shortcut defaults (next timestamp: `E` -> `ctrl+E`, prev timestamp: `C` -> `ctrl+C`)

### Fixes

- Funimation randomly started muting videos
- Sometimes the login loading indicator would never go away
- Timestamps don't show as edited (purple) if they are saved but not changed

## `v1.0.23`

### Enhancements

- Vue Object Syntax refactor
- Show episode info during initial buffer/loading

### Fixes

- VRV Episode info sometimes didn't update when going to the next episode

## `v1.0.22`

### Enhancements

- Updated color on keyboard shortcut page
- Close the tab after logging in from get started
- Fix bug where timestamps where created with unknown type
- Add timeout to timestamp hover

## `v1.0.21-beta5`

### Enhancements

- Improvements to timestamps and editing
  - icon colors for different states (not editing, editing, edited)
  - Offset active one above the timeline
- Hovering over a timestamp in the sidebar will raise it's icon on the timeline up

## `v1.0.20-beta4`

### Breaking Changes

- None

### Enhancements

- Added "Version" player option for funimation

### Fixes

- Added missing language icon
- Remove horizontal scroll from scroll-able player options
- Fixed Funimation player options after they updated their player

## `1.0.19-beta3`

Full support for multiple services

### Breaking Changes

- Reworked the "Edit Episode" dialog. Now labeled "Connect to Anime Skip". It should be easier and less buggy to setup

### Enhancements

- **Different services timestamp offsetting** - Full support for multiple services is complete! When the same episode has different durations, the timestamps will be offset by the difference in durations, putting them where they should go on each service

### Fixes

- Hide toolbar when duration is 0 so timestamps aren't in weird places while loading the video
- Prompt for a login when logged out and you press "Connect to Anime Skip"

## `1.0.18-beta2`

`v1.0.16` and `v1.0.17` were blown through working on CI/CD.

### Changelog

- Fix missing icon
- Fixed bug where the wrong timestamps would be shown
- Improved timestamps suggestions

### Breaking Changes

- Renamed manifest name to be "Anime Skip Player"

### Enhancements

- None

### Fixes

- Resolve missing icon
- Infer based on show name and episode name when looking for timestamps

## `1.0.15-beta1`

First beta releases! Blew through a few version numbers trying to get it published publicly, but it's available!

- [Chrome](https://chrome.google.com/webstore/detail/anime-skip/mgmdkjcljneegjfajchedjpdhbadklcf)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/anime-skip/)

### Breaking Changes

- None

### Enhancements

- None

### Fixes

- Bug fixes related to new editing UI

## `1.0.13-alpha8`

This release is the second candidate for a public beta.

### Breaking Changes

- None

### Enhancements

- None

### Fixes

- #105 - Bug fixes from alpha 7

## `1.0.10-alpha7`

This release is the first candidate for a public beta.

### Breaking Changes

- None

### Enhancements

- New edit UI

### Fixes

- Lots of bug fixes

## `1.0.6-alpha6`

### Breaking Changes

- None

### Enhancements

- None

### Fixes

- Chrome support added back though browser actions

## `1.0.8-alpha5`

### Breaking Changes

- None

### Enhancements

- BetterVRV Integration (#78)
- Funimation integration! (#69, #86)
- Get episode data from the page so you don't have to type it in (#78)
- Select player options (#89)
- Display the service name instead of "Anime Skip" in the top (#75)
- Various improvements to the editing process (#74, #76)

### Fixes

- Properly escape string params for queries and mutations (#79)

## `v1.0.7-alpha4`

### Breaking Changes

- Allow Episode numbers to be strings (#77)

### Enhancements

- Improved UX of auto complete inputs (#73)
- Improved UX of filtering timestamp types (#73)
- Show service name instead of "Anime Skip" above episode info (#75)
- "K" will enter edit mode (#76)
- Label and button visibility changes when the edit timestamp panel is shown (#74)

### Fixes

- Fix bug with when save episode info button was disabled (#73)

## `1.0.5-alpha3`

### Breaking Changes

- None

### Enhancements

- Upgraded autocomplete and timestamp type filtering (#71 and #72)

### Fixes

- Dialog sizing is correct now (was tiny when linking a URL to an episode)

## `1.0.4-alpha2`

### Breaking Changes

- None

### Enhancements

- Integration with new getting started page (#65)
- Basic Funimation injection (#69)
- Switch to Page Action (#69)
- Better scrolling for small screens (#70)

### Fixes

- None

## `1.0.3-alpha1`

Chrome and Firefox are lookin good, `Tower of God` and `No Game, No Life` have timestamps. Once the web has published it's create account flow, we're gonna share this build.

## `1.0.2-internal3`

Fix `translationY` for VRV.

## `1.0.1-internal2`

Fixed all the bugs from #45 except for the tabs change listener bug.

## `1.0.0-internal1`

After going through `No Game, No Life`, the bugs found are listed under issue #45.
