# Changelog

## `[Unreleased]`

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
- Label and button visibilty changes when the edit timestamp panel is shown (#74)

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
