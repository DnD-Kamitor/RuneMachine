#!/usr/bin/env python3
"""
Rune Machine - Vault Door Prop for The Bell Beneath the Dawnhall

Run:
    python3 rune_machine.py

Fedora note:
    If Tkinter is missing, install it with:
    sudo dnf install python3-tkinter
"""

import math
import tkinter as tk
from tkinter import messagebox


APP_TITLE = "The Vault Door - Emergency Rune Machine"

ALL_RUNES = [
    "ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ",
    "ᚺ", "ᚾ", "ᛁ", "ᛃ", "ᛇ", "ᛈ", "ᛉ", "ᛊ",
    "ᛏ", "ᛒ", "ᛖ", "ᛗ", "ᛚ", "ᛜ", "ᛞ", "ᛟ",
]

RUNE_NAMES = {
    "ᚺ": "Hagalaz",
    "ᚾ": "Nauthiz",
    "ᚲ": "Kenaz",
    "ᛊ": "Sowilo",
}

RUNE_MEANINGS = {
    "ᚺ": "what broke the sky",
    "ᚾ": "what drove the hand",
    "ᚲ": "what caged the flame",
    "ᛊ": "what never came",
}

CORRECT_SEQUENCE = ["ᚺ", "ᚾ", "ᚲ", "ᛊ"]

WARNING_TEXT = (
    "THIS DOOR WAS SEALED AGAINST AMBITION.\n"
    "OPEN IT ONLY AGAINST CATASTROPHE.\n\n"
    "IF THE ANCHOR WAKES, FEED THE FAILURE INTO THE MACHINE\n"
    "IN THE ORDER IT UNFOLDED.\n\n"
    "NOT TO CONTINUE THE WORK.\n"
    "TO END IT."
)


class RuneMachineApp:
    def __init__(self, root):
        self.root = root
        self.root.title(APP_TITLE)
        self.root.geometry("1100x780")
        self.root.minsize(950, 680)

        self.accepted = []
        self.attempts = 0
        self.hints_shown = 0
        self.fullscreen = False

        self.bg = "#0f1115"
        self.panel = "#1b1f2a"
        self.stone = "#2f343d"
        self.stone_light = "#505967"
        self.amber = "#e0a642"
        self.pale = "#e8dcc0"
        self.grey = "#9aa0a6"
        self.danger = "#b55a5a"
        self.green = "#7aa874"

        self.root.configure(bg=self.bg)

        self.build_layout()
        self.draw_machine()
        self.update_status("The machine waits. Four raised rune-tokens can be removed from the ring.")

        self.root.bind("<F11>", self.toggle_fullscreen)
        self.root.bind("<Escape>", self.exit_fullscreen)
        self.root.bind("<r>", lambda event: self.reset())
        self.root.bind("<h>", lambda event: self.show_hint())
        self.root.bind("<Return>", lambda event: self.cast_selected())

    def build_layout(self):
        self.outer = tk.Frame(self.root, bg=self.bg)
        self.outer.pack(fill="both", expand=True, padx=18, pady=18)

        self.left = tk.Frame(self.outer, bg=self.bg)
        self.left.pack(side="left", fill="both", expand=True)

        self.right = tk.Frame(self.outer, bg=self.panel, width=340)
        self.right.pack(side="right", fill="y", padx=(18, 0))
        self.right.pack_propagate(False)

        title = tk.Label(
            self.left,
            text="THE EMERGENCY RUNE MACHINE",
            fg=self.pale,
            bg=self.bg,
            font=("DejaVu Sans", 22, "bold"),
        )
        title.pack(anchor="w", pady=(0, 8))

        subtitle = tk.Label(
            self.left,
            text="Feed the failure into the bowl in the order it unfolded.",
            fg=self.grey,
            bg=self.bg,
            font=("DejaVu Sans", 13),
        )
        subtitle.pack(anchor="w", pady=(0, 10))

        self.canvas = tk.Canvas(
            self.left,
            bg=self.bg,
            highlightthickness=0,
            width=720,
            height=590,
        )
        self.canvas.pack(fill="both", expand=True)

        self.status = tk.Label(
            self.left,
            text="",
            fg=self.pale,
            bg=self.panel,
            wraplength=720,
            justify="left",
            font=("DejaVu Sans", 13),
            padx=14,
            pady=12,
        )
        self.status.pack(fill="x", pady=(12, 0))

        self.warning = tk.Label(
            self.right,
            text=WARNING_TEXT,
            fg=self.pale,
            bg=self.panel,
            justify="left",
            wraplength=300,
            font=("DejaVu Sans Mono", 11),
        )
        self.warning.pack(anchor="n", fill="x", padx=18, pady=(18, 16))

        tk.Label(
            self.right,
            text="Raised rune-tokens",
            fg=self.amber,
            bg=self.panel,
            font=("DejaVu Sans", 13, "bold"),
        ).pack(anchor="w", padx=18, pady=(4, 8))

        self.token_frame = tk.Frame(self.right, bg=self.panel)
        self.token_frame.pack(anchor="w", padx=18)

        self.token_buttons = {}
        for rune in ["ᚺ", "ᚾ", "ᚲ", "ᛊ"]:
            btn = tk.Button(
                self.token_frame,
                text=f"{rune}\n{RUNE_NAMES[rune]}",
                font=("DejaVu Sans", 15, "bold"),
                width=8,
                height=2,
                bg=self.stone,
                fg=self.pale,
                activebackground=self.amber,
                activeforeground="#111111",
                relief="raised",
                bd=3,
                command=lambda r=rune: self.cast_rune(r),
            )
            btn.pack(side="left", padx=(0, 8), pady=(0, 8))
            self.token_buttons[rune] = btn

        self.sequence_label = tk.Label(
            self.right,
            text="Accepted sequence:\n[ empty ]",
            fg=self.pale,
            bg=self.panel,
            justify="left",
            font=("DejaVu Sans Mono", 12),
            wraplength=300,
        )
        self.sequence_label.pack(anchor="w", padx=18, pady=(14, 16))

        self.clue_label = tk.Label(
            self.right,
            text="Clue panel:\nNo additional clue revealed.",
            fg=self.grey,
            bg=self.panel,
            justify="left",
            font=("DejaVu Sans", 11),
            wraplength=300,
        )
        self.clue_label.pack(anchor="w", padx=18, pady=(0, 16))

        controls = tk.Frame(self.right, bg=self.panel)
        controls.pack(anchor="w", padx=18, pady=(8, 0), fill="x")

        tk.Button(
            controls,
            text="Hint",
            command=self.show_hint,
            bg=self.stone_light,
            fg=self.pale,
            font=("DejaVu Sans", 11, "bold"),
        ).pack(fill="x", pady=(0, 8))

        tk.Button(
            controls,
            text="Reset",
            command=self.reset,
            bg=self.stone_light,
            fg=self.pale,
            font=("DejaVu Sans", 11, "bold"),
        ).pack(fill="x", pady=(0, 8))

        tk.Button(
            controls,
            text="Fullscreen",
            command=self.toggle_fullscreen,
            bg=self.stone_light,
            fg=self.pale,
            font=("DejaVu Sans", 11, "bold"),
        ).pack(fill="x", pady=(0, 8))

        footer = (
            "Keyboard:\n"
            "F11 fullscreen\n"
            "Esc exit fullscreen\n"
            "H hint\n"
            "R reset"
        )
        tk.Label(
            self.right,
            text=footer,
            fg=self.grey,
            bg=self.panel,
            justify="left",
            font=("DejaVu Sans Mono", 10),
        ).pack(anchor="sw", padx=18, pady=(24, 0))

    def draw_machine(self):
        self.canvas.delete("all")
        w = max(self.canvas.winfo_width(), 720)
        h = max(self.canvas.winfo_height(), 590)
        cx = w // 2
        cy = h // 2 + 10
        radius = min(w, h) * 0.36

        self.canvas.create_oval(
            cx - radius - 28,
            cy - radius - 28,
            cx + radius + 28,
            cy + radius + 28,
            outline=self.stone_light,
            width=8,
        )
        self.canvas.create_oval(
            cx - radius,
            cy - radius,
            cx + radius,
            cy + radius,
            outline=self.stone,
            width=18,
        )

        for i, rune in enumerate(ALL_RUNES):
            angle = (2 * math.pi * i / len(ALL_RUNES)) - math.pi / 2
            x = cx + math.cos(angle) * radius
            y = cy + math.sin(angle) * radius

            active = rune in CORRECT_SEQUENCE
            fill = self.amber if active and rune not in self.accepted else self.grey
            font_size = 23 if active else 17
            tag = f"rune_{rune}"

            if active and rune not in self.accepted:
                self.canvas.create_oval(
                    x - 28,
                    y - 28,
                    x + 28,
                    y + 28,
                    fill=self.stone,
                    outline=self.amber,
                    width=3,
                    tags=(tag,),
                )
            else:
                self.canvas.create_oval(
                    x - 22,
                    y - 22,
                    x + 22,
                    y + 22,
                    fill=self.stone,
                    outline=self.stone_light,
                    width=1,
                    tags=(tag,),
                )

            self.canvas.create_text(
                x,
                y,
                text=rune,
                fill=fill,
                font=("DejaVu Sans", font_size, "bold"),
                tags=(tag,),
            )

            if active and rune not in self.accepted:
                self.canvas.tag_bind(tag, "<Button-1>", lambda event, r=rune: self.cast_rune(r))

        bowl_w = 230
        bowl_h = 135
        self.canvas.create_oval(
            cx - bowl_w // 2,
            cy - bowl_h // 2,
            cx + bowl_w // 2,
            cy + bowl_h // 2,
            fill="#08090b",
            outline=self.amber,
            width=4,
        )
        self.canvas.create_text(
            cx,
            cy - 8,
            text="RUNE BOWL",
            fill=self.grey,
            font=("DejaVu Sans Mono", 14, "bold"),
        )

        bowl_text = " ".join(self.accepted) if self.accepted else "empty"
        self.canvas.create_text(
            cx,
            cy + 24,
            text=bowl_text,
            fill=self.amber if self.accepted else self.grey,
            font=("DejaVu Sans", 28, "bold"),
        )

        slot_y = cy + bowl_h // 2 + 58
        start_x = cx - 150
        for index in range(4):
            x = start_x + index * 100
            filled = index < len(self.accepted)
            self.canvas.create_rectangle(
                x - 32,
                slot_y - 24,
                x + 32,
                slot_y + 24,
                fill=self.stone if not filled else "#2f2818",
                outline=self.amber if filled else self.stone_light,
                width=3 if filled else 1,
            )
            self.canvas.create_text(
                x,
                slot_y,
                text=self.accepted[index] if filled else "·",
                fill=self.amber if filled else self.grey,
                font=("DejaVu Sans", 24, "bold"),
            )

        if len(self.accepted) == 4:
            self.canvas.create_text(
                cx,
                cy - radius - 52,
                text="FAILURE NAMED. NEED WITNESSED. FIRE BOUND. DAWN WITHHELD.",
                fill=self.amber,
                font=("DejaVu Sans Mono", 14, "bold"),
            )
            self.canvas.create_text(
                cx,
                cy + radius + 52,
                text="THE DOOR RECEDES INTO ITSELF.",
                fill=self.pale,
                font=("DejaVu Sans", 18, "bold"),
            )

        self.canvas.bind("<Configure>", lambda event: self.draw_machine())

    def cast_rune(self, rune):
        if len(self.accepted) >= 4:
            return

        expected = CORRECT_SEQUENCE[len(self.accepted)]

        if rune == expected:
            self.accepted.append(rune)
            self.root.bell()
            self.token_buttons[rune].configure(state="disabled", bg="#252525", fg=self.grey)
            self.update_sequence_label()
            self.draw_machine()

            meaning = RUNE_MEANINGS[rune]
            if len(self.accepted) < 4:
                self.update_status(
                    f"The bowl turns. {rune} {RUNE_NAMES[rune]} is accepted: {meaning}. "
                    "A channel opens inside the door."
                )
            else:
                self.open_door()
        else:
            self.attempts += 1
            self.root.bell()
            self.update_status(
                f"The bowl turns once, then stops. {rune} {RUNE_NAMES[rune]} is rejected. "
                "Teeth fail to catch somewhere inside the stone."
            )
            self.flash_rejection()

    def open_door(self):
        self.update_status(
            "The fourth rune-token disappears into the final channel. "
            "The ring rotates once. Counterweights shift. "
            "The machine opens reluctantly."
        )
        messagebox.showinfo(
            "The door opens",
            "Failure named.\nNeed witnessed.\nFire bound.\nDawn withheld.\n\nThe vault door recedes into itself.",
        )

    def flash_rejection(self):
        original = self.status.cget("bg")
        self.status.configure(bg=self.danger)
        self.root.after(280, lambda: self.status.configure(bg=original))

    def update_sequence_label(self):
        if self.accepted:
            names = []
            for rune in self.accepted:
                names.append(f"{rune} {RUNE_NAMES[rune]}")
            text = "Accepted sequence:\n" + "\n".join(names)
        else:
            text = "Accepted sequence:\n[ empty ]"
        self.sequence_label.configure(text=text)

    def update_status(self, text):
        self.status.configure(text=text)

    def show_hint(self):
        hints = [
            "Clue 1:\nThe door does not ask for victory. It asks for the order of failure.",
            "Clue 2:\nFirst came the breaking. Then came the need. The sun comes last because it never came.",
            "Clue 3:\nThe missing middle is not the sun. It is controlled flame, craft, and dangerous method.",
            "Clue 4:\nCorrect sequence:\nᚺ Hagalaz\nᚾ Nauthiz\nᚲ Kenaz\nᛊ Sowilo",
        ]
        index = min(self.hints_shown, len(hints) - 1)
        self.clue_label.configure(text="Clue panel:\n" + hints[index])
        self.hints_shown += 1

    def reset(self):
        self.accepted = []
        self.attempts = 0
        self.hints_shown = 0
        for rune, btn in self.token_buttons.items():
            btn.configure(state="normal", bg=self.stone, fg=self.pale)
        self.clue_label.configure(text="Clue panel:\nNo additional clue revealed.")
        self.update_sequence_label()
        self.update_status("The machine resets. The raised rune-tokens return to the ring.")
        self.draw_machine()

    def toggle_fullscreen(self, event=None):
        self.fullscreen = not self.fullscreen
        self.root.attributes("-fullscreen", self.fullscreen)

    def exit_fullscreen(self, event=None):
        self.fullscreen = False
        self.root.attributes("-fullscreen", False)

    def cast_selected(self):
        return


def main():
    root = tk.Tk()
    app = RuneMachineApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
