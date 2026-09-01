---
name: Third Hour Cafe Website
description: An editorial, lingering café landing page in espresso, cream, and muted gold.
colors:
  ink: "#0f0d0c"
  raised: "#171411"
  cream: "#f5efe3"
  muted: "#b9b0a2"
  gold: "#c9a159"
  line: "rgba(245, 239, 227, 0.16)"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(4.2rem, 8.2vw, 8.5rem)"
    fontWeight: 600
    lineHeight: 0.76
    letterSpacing: "-0.055em"
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(3.8rem, 6.2vw, 6.6rem)"
    fontWeight: 600
    lineHeight: 0.82
    letterSpacing: "-0.055em"
  body:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "0.94rem"
    fontWeight: 400
    lineHeight: 1.9
  label:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 600
    letterSpacing: "0.16em"
spacing:
  compact: "12px"
  control: "24px"
  section-mobile: "95px"
components:
  button-gold:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    typography: "Cormorant Garamond, Georgia, serif; 600 1.06rem/1"
    padding: "15px 17px"
  button-cream:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    typography: "Cormorant Garamond, Georgia, serif; 600 1.06rem/1"
    padding: "15px 17px"
  nav-loyalty:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    typography: "Cormorant Garamond, Georgia, serif; 600 0.98rem/1"
    padding: "13px 16px"
---

# Design System: Third Hour Cafe Website

## Overview

**Creative North Star: "The Third-Hour Pause"**

The landing page treats a café visit as a quiet pocket of time rather than a transaction. It is deliberately editorial and atmospheric: dark espresso surfaces, warm paper texture, cropped food photography, tall serif statements, and small gold cues give the page an unhurried, intimate character.

The direction follows the approved Figma style-guide world: **dark espresso, cream, muted gold, Cormorant Garamond, and Inter are intentional brand choices.** Do not replace this with a bright, generic coffee-shop palette, rounded SaaS patterns, or a different type pairing during routine implementation work.

**Implementation source of truth:** [`website/app/globals.css`](../website/app/globals.css) and [`website/components/landing-experience.tsx`](../website/components/landing-experience.tsx). This document records the shipped landing-page system; it does not define the loyalty-card interface.

**Asset provenance:** public landing-page imagery and the paper texture are documented in [`website/public/images/third-hour/SOURCES.md`](../website/public/images/third-hour/SOURCES.md). Keep the listed Facebook photographs within Third Hour use, and retain the provenance note if assets move or are replaced.

**Key Characteristics:**

- Editorial restraint over busy café branding.
- Warm, low-light material depth instead of glossy gradients.
- Serif-led emotional messaging paired with compact sans-serif utility text.
- Gold is a navigational and ritual accent, not a dominant fill.
- Motion gives the page a gentle reveal and scroll rhythm, never spectacle.

## Colors

The palette is a small, low-light material system: espresso establishes the room, cream carries reading contrast, muted taupe recedes, and antique gold marks the moments worth noticing.

### Primary

- **Muted Gold:** the sole expressive accent. Use for eyebrow labels, fine rules, stamp states, primary calls to action, key icons, and the selected visual rhythm. It stays sparse enough to feel like a warm glint rather than a competing surface.

### Neutral

- **Espresso Ink:** the default page ground, deep text on light controls, and the dark overlay for imagery.
- **Raised Espresso:** the only alternate major surface, used to make the story, loyalty, address, and footer areas feel spatially distinct without leaving the dark world.
- **Warm Cream:** the high-contrast reading color and light call-to-action surface.
- **Muted Taupe:** supporting copy, quiet navigation, and metadata; it must not carry essential information alone.
- **Cream Hairline:** the low-contrast divider treatment for dark-on-dark separation.

**The Gold-Glint Rule.** Gold communicates emphasis and warmth. It may fill a purposeful action or stamp state, but it should not become the default background for large sections.

## Typography

**Display Font:** Cormorant Garamond with Georgia fallback.

**Body Font:** Inter with Arial fallback.

**Character:** Cormorant Garamond supplies the page's romantic, pause-worthy voice; Inter keeps navigation, descriptions, address details, and labels crisp. The contrast is deliberate: expressive headlines must not be made with Inter, and operational labels must not be made decorative with the serif.

### Hierarchy

- **Display:** a compact, large Cormorant Garamond statement for the hero. It uses tight tracking and a deliberately compressed line-height to form a poster-like block.
- **Headline:** Cormorant Garamond for section declarations. Preserve the multi-line composition and occasional italic emphasis; it is part of the page's cadence.
- **Title:** Cormorant Garamond for menu names, address-card headings, links, and button labels. Use the weight and negative tracking already established in the implementation.
- **Body:** Inter for explanatory copy. The landing page uses generous leading and constrained measures so the dark field remains calm and readable.
- **Label:** uppercase Inter with wide tracking for eyebrows, navigation, and card metadata. Use it as a quiet annotation layer, not for paragraph content.

**The Two-Voice Rule.** Let the serif carry emotion and the sans-serif carry orientation. Avoid adding a third display or UI font.

## Layout

The page alternates expansive dark editorial bands with raised-espresso pauses. Desktop sections use two-column grids, substantial horizontal gutters, and vertical spacing that ranges from roughly 105px to 190px; the hero gives copy and a three-image mosaic equal visual importance.

The gallery is a 12-column irregular mosaic rather than a uniform card grid. Food and drink imagery should remain edge-to-edge within its framed crops, with mixed tall, wide, and square modules. The hero repeats this collage grammar at a more sculptural scale.

At 900px and below, navigation becomes a menu toggle and the major grids stack into a single reading path. Side gutters become 24px, section rhythm becomes 95px, image modules remain proportioned rather than flattened, and the footer moves from three columns to two, then one column at 520px. The hero title scales fluidly; below 520px, actions stack and stamps reduce from 32px to 28px to protect the card's breathing room.

**The Room-to-Linger Rule.** Do not compress this page into conventional dense marketing blocks. Preserve generous breathing room around headings, image fields, and the loyalty card at every breakpoint.

## Elevation & Depth

Depth is primarily tonal, not shadow-driven. The fixed, near-imperceptible walnut-paper texture and alternating ink/raised surfaces make the page feel tactile; fine translucent borders give images and cards their edges. The only substantive shadow belongs to the loyalty card, which is intentionally presented as a physical keepsake lifted from the page.

### Shadow Vocabulary

- **Loyalty-card lift** (`18px 22px 56px rgba(0, 0, 0, 0.28)`): reserve for the loyalty card; it signals the product artifact, not a generic card component.

**The Tonal-First Rule.** Build separation with material, surface shift, and hairlines before considering shadows. Do not introduce default floating-card shadows across the site.

## Shapes

The form language is mostly square and editorial. Buttons, image frames, panels, and the loyalty card have crisp corners; a thin gold or cream line often provides the contour. Circles are reserved for ritual motifs: the hero orbit, panel line art, and loyalty stamps. Cropped rectangles and circles should feel intentional and spare rather than playful.

## Components

### Buttons

The primary action is a compact cream or muted-gold rectangle with dark serif text and a small directional arrow.

- **Shape:** square-cornered with no radius.
- **Primary:** gold fill for the hero action; cream fill for the loyalty action. Both use the documented control padding and dark text.
- **Hover / Focus:** links and buttons lift by 2px over 180ms; fill and text-color changes are equally quick. Keyboard focus is a 2px gold outline offset by 4px.
- **Text links:** cream serif text with a restrained bottom rule. On hover, both type and rule become gold while retaining the same 2px lift.

### Navigation

Desktop navigation is compact uppercase Inter on the muted layer, paired with a serif cream loyalty invitation. It sits in a 92px header with a low-opacity espresso backing and a cream hairline beneath. At 900px and below, the menu button becomes visible and the expanded navigation occupies a fixed panel below the 76px header; links close the panel after selection.

### Image Frames and Gallery

Photography lives in square-edged, overflow-hidden frames with fine borders. Images use slightly reduced saturation and increased contrast to sit inside the espresso world. Gallery images can scale to 1.05 on hover over 600ms; do not apply generic rounded-image treatments.

### Loyalty Card

The loyalty card is the signature product object: a raised espresso rectangle, gold border, quiet gold circle, and ten circular stamps in a five-column grid. Filled stamps use muted gold. Its messaging treats completed cards as personal mementos, consistent with the product's permanent completed-card collection.

### Location Panel

The address panel combines a framed raised-espresso surface, muted copy, a gold map pin, and partial circular line work. It should feel like a calm invitation to arrive, not an app-style information card.

### Motion

Motion is enabled only when `prefers-reduced-motion` permits it. The opening sequence reveals the wordmark, hero copy, mosaic frame, then imagery with a soft `power4.out` cadence. Scroll sections reveal upward once they enter the lower viewport; the hero orbit and loyalty card receive restrained scrubbed drift. Image hover scale and action lifts provide the remaining tactile feedback.

For reduced motion, disable the smooth page scroll and decorative orbit movement, and do not add new automatic motion that ignores the preference. Any new animation should remain short, compositional, and optional—never a requirement for understanding, navigation, or access to a call to action.

## Do's and Don'ts

### Do:

- **Do** preserve the intentional Figma direction: espresso ground, cream contrast, muted-gold accent, Cormorant Garamond display type, and Inter utility type.
- **Do** use portrait and food photography in editorial crops with modest saturation and contrast treatment.
- **Do** maintain generous, breathing editorial spacing and a strong sequence of copy, imagery, loyalty, and visit information.
- **Do** treat gold borders, labels, and circles as measured craft details.
- **Do** respect reduced-motion preferences and keep the motion system calm and scroll-aware.

### Don't:

- **Don't** substitute bright white surfaces, saturated brand colors, generic café illustrations, or bubbly rounded UI patterns.
- **Don't** use gold as a broad decorative background or add shadows to every container.
- **Don't** turn serif display type into dense utility text, or use Inter as the hero voice.
- **Don't** flatten the image mosaics into uniform cards at smaller sizes; retain their purposeful variation.
- **Don't** repurpose the documented public-source imagery outside Third Hour or remove its provenance record.
