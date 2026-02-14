import { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const lightPalette = [
  { name: "Background", hex: "#FAF9F7", hsl: "40, 20%, 98%" },
  { name: "Foreground", hex: "#2B2723", hsl: "30, 10%, 15%" },
  { name: "Card", hex: "#F6F4F1", hsl: "40, 15%, 96%" },
  { name: "Secondary", hex: "#EDECEA", hsl: "40, 10%, 92%" },
  { name: "Muted", hex: "#E8E7E4", hsl: "40, 10%, 90%" },
  { name: "Muted Foreground", hex: "#7E756B", hsl: "30, 10%, 45%" },
  { name: "Accent (Teal)", hex: "#428C87", hsl: "175, 35%, 40%" },
  { name: "Border", hex: "#DBD9D6", hsl: "40, 10%, 85%" },
  { name: "Destructive", hex: "#CE3131", hsl: "0, 62%, 50%" },
];

const darkPalette = [
  { name: "Background", hex: "#141414", hsl: "0, 0%, 8%" },
  { name: "Foreground", hex: "#EDE8E1", hsl: "35, 20%, 92%" },
  { name: "Card", hex: "#1C1C1C", hsl: "0, 0%, 11%" },
  { name: "Secondary", hex: "#242424", hsl: "0, 0%, 14%" },
  { name: "Muted", hex: "#2E2E2E", hsl: "0, 0%, 18%" },
  { name: "Muted Foreground", hex: "#B0A595", hsl: "35, 12%, 65%" },
  { name: "Accent (Teal)", hex: "#508F8A", hsl: "175, 30%, 45%" },
  { name: "Border", hex: "#333333", hsl: "0, 0%, 20%" },
];

const SWATCH_SIZE = 120;
const PADDING = 60;
const GAP = 20;
const COLS = 5;
const FONT = "Outfit, sans-serif";

function drawPalette(
  ctx: CanvasRenderingContext2D,
  title: string,
  colors: typeof lightPalette,
  startY: number,
  canvasWidth: number
) {
  ctx.fillStyle = "#2B2723";
  ctx.font = `600 28px ${FONT}`;
  ctx.fillText(title, PADDING, startY);

  const rows = Math.ceil(colors.length / COLS);
  const totalSwatchWidth = (canvasWidth - PADDING * 2 - GAP * (COLS - 1)) / COLS;
  const swatchSize = Math.min(SWATCH_SIZE, totalSwatchWidth);

  colors.forEach((color, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = PADDING + col * (swatchSize + GAP);
    const y = startY + 20 + row * (swatchSize + 60);

    // Swatch
    ctx.fillStyle = color.hex;
    ctx.strokeStyle = "#DBD9D6";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, swatchSize, swatchSize, 6);
    ctx.fill();
    ctx.stroke();

    // Name
    ctx.fillStyle = "#2B2723";
    ctx.font = `500 13px ${FONT}`;
    ctx.fillText(color.name, x, y + swatchSize + 18);

    // Hex
    ctx.fillStyle = "#7E756B";
    ctx.font = `400 12px ${FONT}`;
    ctx.fillText(color.hex, x, y + swatchSize + 34);

    // HSL
    ctx.fillText(`hsl(${color.hsl})`, x, y + swatchSize + 48);
  });

  const totalRows = rows;
  return startY + 20 + totalRows * (swatchSize + 60) + 30;
}

export default function BrandPalette() {
  const downloadPNG = useCallback(() => {
    const canvas = document.createElement("canvas");
    const width = 860;
    const height = 900;
    canvas.width = width * 2;
    canvas.height = height * 2;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(2, 2);

    // White background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = "#2B2723";
    ctx.font = `700 36px ${FONT}`;
    ctx.fillText("Adrian Watkins — Colour Palette", PADDING, 55);

    // Font info
    ctx.fillStyle = "#7E756B";
    ctx.font = `400 14px ${FONT}`;
    ctx.fillText("Typeface: Outfit (300–700)  •  adrianwatkins.com", PADDING, 80);

    // Light palette
    const nextY = drawPalette(ctx, "Light Mode", lightPalette, 120, width);

    // Dark palette
    drawPalette(ctx, "Dark Mode", darkPalette, nextY + 10, width);

    // Download
    const link = document.createElement("a");
    link.download = "adrian-watkins-colour-palette.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <div className="container-narrow section-spacing pt-28 md:pt-32">
        <div className="space-y-2 mb-10">
          <h1 className="text-3xl font-semibold">Colour Palette</h1>
          <p className="text-muted-foreground">Brand colours for Adrian Watkins. Download as a PNG swatch sheet.</p>
        </div>

        <Button onClick={downloadPNG} variant="default" size="lg" className="mb-12">
          <Download className="h-4 w-4 mr-2" />
          Download PNG Swatch Sheet
        </Button>

        {/* Preview */}
        <section className="space-y-8">
          <div>
            <h2 className="text-xl font-medium mb-4">Light Mode</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {lightPalette.map((c) => (
                <div key={c.hex} className="space-y-1.5">
                  <div
                    className="w-full aspect-square rounded-sm border border-border"
                    style={{ backgroundColor: c.hex }}
                  />
                  <p className="text-xs font-medium text-foreground !max-w-none">{c.name}</p>
                  <p className="text-xs text-muted-foreground !max-w-none">{c.hex}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-medium mb-4">Dark Mode</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {darkPalette.map((c) => (
                <div key={c.hex} className="space-y-1.5">
                  <div
                    className="w-full aspect-square rounded-sm border border-border"
                    style={{ backgroundColor: c.hex }}
                  />
                  <p className="text-xs font-medium text-foreground !max-w-none">{c.name}</p>
                  <p className="text-xs text-muted-foreground !max-w-none">{c.hex}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
