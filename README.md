# Anime Skip - Web Extension

Inject a custom player over the top of the certain web players (`VRV`, `Funimation`).

## Development

```bash
yarn install
yarn watch:dev
```

This will install and open firefox. To open another browser, more changes will have to be made.

## TODO

#### Necessary

- Edit Mode
- Create Episode (& show) dialog

#### Optinoal

- Error on timeline drag

## Keyboard shortcut plans

```
w  e  r           i  o
 s  d  f        j  k  l     ⏎
  x  c  v        m  ,
```

#### Forwards Navigation

`E` - next timestamp/end<br />
`R` - Large step forward<br />
`F` - medium step forward<br />
`V` - small step forward<br />

#### Backwards Navigation

`C` - previous timestamp<br />
`W` - large step backward<br />
`S` - Medium step backward<br />
`X` - small step backward<br />

#### Editing Tools

`J` - go back 1 frame<br />
`K` - Stop and place timestamp<br />
`L` - go forward 1 frame<br />
`I` - Cycle through timestamp types<br />
`O` - Cycle through timestamp types<br />
`M` - Switch timestamp being edited to the previous one<br />
`,` - Switch timestamp being edited to the next one<br />
`⏎` - Stop editing current timestamp and resume the video<br />
