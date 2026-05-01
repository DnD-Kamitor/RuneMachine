# RuneMachine

RuneMachine is a small browser-based DnD table prop for a rune-operated vault door.

It was built for the vault entrance in **Session 0.5: The Bell Beneath the Dawnhall**. The players cast Elder Futhark runes into a ritual machine. Wrong runes are rejected. The correct sequence opens the sealed door.

## Puzzle sequence

The correct sequence is:

```text
ᚺ → ᚾ → ᚲ → ᛊ
Hagalaz → Nauthiz → Kenaz → Sowilo
Failure → Need → Bound Flame → Withheld Sun
```

## Run locally

Open `index.html` in a browser.

Or, from the repository folder:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## GitHub Pages setup

In GitHub:

1. Go to **Settings**
2. Go to **Pages**
3. Under **Build and deployment**, choose **Deploy from a branch**
4. Set branch to **main**
5. Set folder to **/ root**
6. Click **Save**

After a short moment the app should become available at:

```text
https://dnd-kamitor.github.io/RuneMachine/
```

## Controls

```text
H = reveal hint
R = reset machine
F = fullscreen
```

## GM warning inscription

> This door was sealed against ambition.
>
> Open it only against catastrophe.
>
> If the Anchor wakes, feed the failure into the machine in the order it unfolded.
>
> Not to continue the work. To end it.

## Design goal

This should feel less like a password screen and more like a strange emergency mechanism. The makers did not want the vault opened again, but they left a way in case the Anchor woke and someone had to stop it.
