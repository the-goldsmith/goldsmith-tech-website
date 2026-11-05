"""Generate the lightweight SVG telemetry overlay used in the homepage hero."""

from pathlib import Path
from xml.etree import ElementTree as ET


SVG = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG)


def element(parent, name, **attributes):
    return ET.SubElement(parent, f"{{{SVG}}}{name}", attributes)


def build_art():
    root = ET.Element(
        f"{{{SVG}}}svg",
        {
            "viewBox": "0 0 900 600",
            "preserveAspectRatio": "xMidYMid slice",
            "role": "img",
            "aria-labelledby": "title description",
        },
    )
    element(root, "title", id="title").text = "Goldsmith field robotics telemetry overlay"
    element(root, "desc", id="description").text = (
        "Decorative blueprint grid, orbit rings, calibration marks, and sensor points."
    )
    defs = element(root, "defs")
    gradient = element(defs, "linearGradient", id="trace", x1="0", x2="1", y1="0", y2="1")
    element(gradient, "stop", offset="0", **{"stop-color": "#bfd58a", "stop-opacity": ".04"})
    element(gradient, "stop", offset=".5", **{"stop-color": "#d9f4b0", "stop-opacity": ".72"})
    element(gradient, "stop", offset="1", **{"stop-color": "#8bb9a0", "stop-opacity": ".08"})
    glow = element(defs, "radialGradient", id="glow")
    element(glow, "stop", offset="0", **{"stop-color": "#d9f4b0", "stop-opacity": ".72"})
    element(glow, "stop", offset="1", **{"stop-color": "#d9f4b0", "stop-opacity": "0"})

    grid = element(root, "g", fill="none", stroke="#c7d6b1", **{"stroke-opacity": ".09", "stroke-width": "1"})
    for x in range(0, 901, 45):
        element(grid, "path", d=f"M{x} 0V600")
    for y in range(0, 601, 45):
        element(grid, "path", d=f"M0 {y}H900")

    orbit = element(root, "g", fill="none", stroke="url(#trace)", **{"stroke-width": "1.2"})
    element(orbit, "ellipse", cx="455", cy="304", rx="310", ry="172", transform="rotate(-18 455 304)")
    element(
        orbit,
        "ellipse",
        cx="455",
        cy="304",
        rx="238",
        ry="122",
        transform="rotate(29 455 304)",
        **{"stroke-dasharray": "3 9", "stroke-opacity": ".54"},
    )
    element(orbit, "path", d="M92 454 260 400l89 18 105-54 108 15 178-118", **{"stroke-dasharray": "2 8"})
    element(orbit, "path", d="M138 137h94l38 26h101m216 273h88l43-37", **{"stroke-opacity": ".4"})

    marks = element(root, "g", fill="none", stroke="#d7edb4", **{"stroke-opacity": ".52", "stroke-width": "1"})
    for x, y, direction_x, direction_y in (
        (34, 34, 1, 1), (866, 34, -1, 1), (34, 566, 1, -1), (866, 566, -1, -1)
    ):
        element(marks, "path", d=f"M{x} {y + direction_y * 30}V{y}H{x + direction_x * 30}")
    for x, y, radius in (
        (218, 164, 3), (350, 418, 3), (561, 211, 2.5), (741, 382, 3), (670, 138, 2)
    ):
        element(marks, "circle", cx=str(x), cy=str(y), r=str(radius), fill="url(#glow)", stroke="none")
        element(marks, "circle", cx=str(x), cy=str(y), r=str(radius + 2))
        element(marks, "path", d=f"M{x - 12} {y}h-5m{34} 0h-5m-12 {-12}v-5m0 34v-5")

    labels = element(root, "g", fill="#d5e4c4", **{"font-family": "monospace", "font-size": "9", "letter-spacing": "1.6", "fill-opacity": ".68"})
    for x, y, text in (
        (53, 78, "FIELD SYSTEMS / 01"),
        (53, 94, "GS-R01 · CONCEPT STUDY"),
        (666, 78, "SENSOR ARRAY"),
        (666, 94, "HUMAN-LED / TEST VIEW"),
        (53, 536, "GOLDSMITH / DESIGN LAB"),
        (667, 536, "LOCAL RENDER · 01"),
    ):
        element(labels, "text", x=str(x), y=str(y)).text = text
    element(labels, "path", d="M53 109h145M666 109h132M53 519h118M667 519h132", fill="none", stroke="#c7d6b1", **{"stroke-opacity": ".28"})
    return ET.ElementTree(root)


if __name__ == "__main__":
    destination = Path(__file__).resolve().parent / "assets" / "hero-telemetry.svg"
    destination.parent.mkdir(parents=True, exist_ok=True)
    build_art().write(destination, encoding="utf-8", xml_declaration=True)
    print(f"Generated {destination}")
