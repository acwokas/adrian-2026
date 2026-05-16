# Photo slots

The `<PhotoSlot>` component (`src/components/PhotoSlot.astro`) renders a named
photo if a JPG with the expected filename exists in this directory at build time,
or a hatched SVG placeholder if not. Dropping a correctly-named JPG here and
running `npm run build` is the only action needed to fill a slot.

## Slots

| Filename                  | Used on        | Brief                                                                 |
|---------------------------|----------------|-----------------------------------------------------------------------|
| `hero-portrait.jpg`       | `/` hero       | Editorial B&W portrait, Singapore 2025. Currently populated.          |
| `speaking-government.jpg` | `/` speaking   | Wide proof shot. Adrian on stage, presenting to a government audience. |
| `speaking-industry.jpg`   | `/speaking`    | Industry conference. Wide stage shot.                                  |
| `speaking-fireside.jpg`   | `/speaking`    | Fireside or panel format. Mid-shot, two or more seated speakers.       |
| `about-working.jpg`       | `/about`       | Working portrait. Desk, notebook, or in-the-room. Editorial register.  |
| `edge-workshop.jpg`       | `/edge`        | Adrian in a workshop session. Whiteboard, sticky notes, small group.   |

## Conventions

- JPG format. 1600px on the long edge is plenty for hero crops.
- Black and white preferred for the hero. Colour for in-the-room frames is fine.
- Don't bake captions into the image. Captions live in the markup.
- Don't include text overlays or logos in the photo itself.

## Adding a new slot

1. Add the filename to the table above.
2. Drop a `<PhotoSlot src="filename.jpg" alt="..." description="..." />` in the relevant page.
3. Build. The placeholder renders until a JPG with that filename arrives.
