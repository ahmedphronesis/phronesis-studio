/**
 * DOCX primitives for Studio of Phronesis branded documents.
 *
 * Design language (Refined v2):
 *   - Display: Cambria (serif, universally available, refined feel)
 *   - Body: Calibri (clean sans-serif)
 *   - Mono: Consolas
 *   - Palette: teal #0F5C5E, gold #B48D3C, terracotta #B5462A, ink #1A1A1A, paper #F5EFE4
 *
 * All templates compose these primitives — no template writes raw docx XML.
 */
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  PageBreak,
  Header,
  Footer,
  PageNumber,
  TabStopType,
  TabStopPosition,
  type ISectionOptions,
  type ParagraphChild,
  type ITableRowOptions,
} from "docx";

// ─── Brand constants ────────────────────────────────────────────────────────

export const BRAND = {
  PHI: "Φ",
  STUDIO: "STUDIO OF PHRONESIS",
  TAGLINE: "Educator · Systems Architect · Leadership",
  DOMAIN: "phronesis-studio.com",
  LOCATION: "Al Ain · United Arab Emirates",
  SIGNATURE: "Studio of Practical Wisdom",
  EMAIL: "ahmed@phronesis-studio.com",
};

export const COLORS = {
  TEAL: "0F5C5E",
  TEAL_LIGHT: "E8F2F2",
  GOLD: "B48D3C",
  GOLD_LIGHT: "F7EFD9",
  TERRACOTTA: "B5462A",
  INK: "1A1A1A",
  INK_SOFT: "555555",
  INK_DIM: "999999",
  PAPER: "F5EFE4",
  PAPER_WARM: "EFE6D3",
  BORDER: "D8CFC0",
  WHITE: "FFFFFF",
};

const FONT_DISPLAY = "Cambria";
const FONT_BODY = "Calibri";
const FONT_MONO = "Consolas";

// ─── Helpers ────────────────────────────────────────────────────────────────

function noBorder() {
  return {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  };
}

function thinBorder(color = COLORS.BORDER) {
  return {
    top: { style: BorderStyle.SINGLE, size: 4, color },
    bottom: { style: BorderStyle.SINGLE, size: 4, color },
    left: { style: BorderStyle.SINGLE, size: 4, color },
    right: { style: BorderStyle.SINGLE, size: 4, color },
  };
}

function bottomOnlyBorder(color = COLORS.BORDER, size = 4) {
  return {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.SINGLE, size, color },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  };
}

// ─── Atomic paragraph builders ──────────────────────────────────────────────

export function phi(size = 48): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
    children: [
      new TextRun({
        text: BRAND.PHI,
        font: FONT_DISPLAY,
        size,
        color: COLORS.GOLD,
      }),
    ],
  });
}

export function studioName(): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 60 },
    children: [
      new TextRun({
        text: BRAND.STUDIO,
        font: FONT_DISPLAY,
        size: 22,
        characterSpacing: 60,
        color: COLORS.INK,
        bold: true,
      }),
    ],
  });
}

export function tagline(): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 240 },
    children: [
      new TextRun({
        text: BRAND.TAGLINE,
        font: FONT_BODY,
        size: 16,
        color: COLORS.INK_SOFT,
        italics: true,
      }),
    ],
  });
}

export function documentTitle(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 240 },
    children: [
      new TextRun({
        text,
        font: FONT_DISPLAY,
        size: 36,
        color: COLORS.INK,
      }),
    ],
  });
}

export function sectionHeading(text: string, color = COLORS.TEAL): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 160 },
    border: bottomOnlyBorder(color, 6),
    children: [
      new TextRun({
        text: text.toUpperCase(),
        font: FONT_DISPLAY,
        size: 22,
        characterSpacing: 40,
        color,
        bold: true,
      }),
    ],
  });
}

export function body(
  text: string,
  opts: { italic?: boolean; bold?: boolean; size?: number; color?: string } = {}
): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 0, after: 160, line: 312 },
    children: [
      new TextRun({
        text,
        font: FONT_BODY,
        size: opts.size ?? 22,
        color: opts.color ?? COLORS.INK,
        italics: opts.italic,
        bold: opts.bold,
      }),
    ],
  });
}

export function bullet(text: string, color = COLORS.TEAL): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 0, after: 80, line: 300 },
    indent: { left: 360, hanging: 200 },
    children: [
      new TextRun({
        text: "— ",
        font: FONT_BODY,
        size: 22,
        color,
      }),
      new TextRun({
        text,
        font: FONT_BODY,
        size: 22,
        color: COLORS.INK,
      }),
    ],
  });
}

export function spacer(after = 200): Paragraph {
  return new Paragraph({
    spacing: { before: 0, after },
    children: [new TextRun({ text: "" })],
  });
}

export function goldRule(): Paragraph {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: bottomOnlyBorder(COLORS.GOLD, 8),
    children: [new TextRun({ text: "" })],
  });
}

// ─── Composite blocks ───────────────────────────────────────────────────────

/**
 * Metadata table — two-column key/value pairs at the top of a document.
 * e.g. [{ label: "Prepared for", value: "Mohammed Ali" }, ...]
 */
export function metadataTable(rows: { label: string; value: string }[]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: thinBorder(COLORS.BORDER),
    rows: rows.map(
      (r) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.CLEAR, fill: COLORS.PAPER_WARM },
              margins: { top: 120, bottom: 120, left: 200, right: 200 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: r.label.toUpperCase(),
                      font: FONT_MONO,
                      size: 16,
                      characterSpacing: 40,
                      color: COLORS.TEAL,
                      bold: true,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              margins: { top: 120, bottom: 120, left: 200, right: 200 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: r.value,
                      font: FONT_BODY,
                      size: 22,
                      color: COLORS.INK,
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
    ),
  });
}

/**
 * Two-column label/value table — for price tables, timeline rows, etc.
 */
export function valueTable(
  rows: { label: string; value: string; valueColor?: string }[],
  opts: { firstColumnWidth?: number; zebra?: boolean } = {}
): Table {
  const fcw = opts.firstColumnWidth ?? 40;
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: thinBorder(COLORS.BORDER),
    rows: rows.map(
      (r, i) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: fcw, type: WidthType.PERCENTAGE },
              shading: r.valueColor
                ? undefined
                : opts.zebra && i % 2 === 1
                ? { type: ShadingType.CLEAR, fill: COLORS.PAPER }
                : undefined,
              margins: { top: 100, bottom: 100, left: 200, right: 200 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: r.label,
                      font: FONT_BODY,
                      size: 20,
                      color: COLORS.INK_SOFT,
                      bold: true,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 100 - fcw, type: WidthType.PERCENTAGE },
              shading: r.valueColor
                ? { type: ShadingType.CLEAR, fill: COLORS.TEAL_LIGHT }
                : opts.zebra && i % 2 === 1
                ? { type: ShadingType.CLEAR, fill: COLORS.PAPER }
                : undefined,
              margins: { top: 100, bottom: 100, left: 200, right: 200 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: r.value,
                      font: FONT_BODY,
                      size: 22,
                      color: r.valueColor ?? COLORS.INK,
                      bold: Boolean(r.valueColor),
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
    ),
  });
}

/**
 * Generic multi-column table with header row.
 * Used for price line items, timeline phases, stakeholder tables, etc.
 */
export function dataTable(
  headers: string[],
  rows: string[][],
  opts: { accentColor?: string; zebra?: boolean; columnWidths?: number[] } = {}
): Table {
  const accent = opts.accentColor ?? COLORS.TEAL;
  const totalCols = headers.length;
  const widths =
    opts.columnWidths ?? Array(totalCols).fill(Math.floor(100 / totalCols));

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: widths.map((w) => Math.round((w / 100) * 9000)),
    borders: thinBorder(COLORS.BORDER),
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map(
          (h, i) =>
            new TableCell({
              width: { size: widths[i], type: WidthType.PERCENTAGE },
              shading: { type: ShadingType.CLEAR, fill: accent },
              margins: { top: 120, bottom: 120, left: 160, right: 160 },
              children: [
                new Paragraph({
                  alignment: i === 0 ? AlignmentType.LEFT : AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: h.toUpperCase(),
                      font: FONT_MONO,
                      size: 16,
                      characterSpacing: 30,
                      color: COLORS.WHITE,
                      bold: true,
                    }),
                  ],
                }),
              ],
            })
        ),
      }),
      ...rows.map(
        (row, ri) =>
          new TableRow({
            cantSplit: true,
            children: row.map(
              (cell, ci) =>
                new TableCell({
                  width: { size: widths[ci], type: WidthType.PERCENTAGE },
                  shading:
                    opts.zebra && ri % 2 === 1
                      ? { type: ShadingType.CLEAR, fill: COLORS.PAPER }
                      : undefined,
                  margins: { top: 100, bottom: 100, left: 160, right: 160 },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: cell,
                          font: FONT_BODY,
                          size: 20,
                          color: COLORS.INK,
                        }),
                      ],
                    }),
                  ],
                })
            ),
          })
      ),
    ],
  });
}

/**
 * Emphasis callout box — used for deadlines, key terms, important notices.
 * variant: "gold" | "teal" | "terracotta"
 */
export function callout(
  title: string,
  paragraphs: string[],
  variant: "gold" | "teal" | "terracotta" = "gold"
): Table {
  const colorMap = {
    gold: { bg: COLORS.GOLD_LIGHT, accent: COLORS.GOLD },
    teal: { bg: COLORS.TEAL_LIGHT, accent: COLORS.TEAL },
    terracotta: { bg: "F8E4DC", accent: COLORS.TERRACOTTA },
  } as const;
  const { bg, accent } = colorMap[variant];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 24, color: accent },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: accent },
      left: { style: BorderStyle.SINGLE, size: 4, color: accent },
      right: { style: BorderStyle.SINGLE, size: 4, color: accent },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: bg },
            margins: { top: 240, bottom: 240, left: 320, right: 320 },
            children: [
              new Paragraph({
                spacing: { after: 120 },
                children: [
                  new TextRun({
                    text: title.toUpperCase(),
                    font: FONT_DISPLAY,
                    size: 22,
                    characterSpacing: 60,
                    color: accent,
                    bold: true,
                  }),
                ],
              }),
              ...paragraphs.map((p) =>
                new Paragraph({
                  spacing: { before: 0, after: 80, line: 300 },
                  children: [
                    new TextRun({
                      text: p,
                      font: FONT_BODY,
                      size: 22,
                      color: COLORS.INK,
                    }),
                  ],
                })
              ),
            ],
          }),
        ],
      }),
    ],
  });
}

/**
 * Brand header — Φ wordmark + STUDIO OF PHRONESIS + tagline.
 * Used at the top of every template.
 */
export function brandHeader(): (Paragraph | Table)[] {
  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: noBorder(),
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 15, type: WidthType.PERCENTAGE },
              verticalAlign: "center",
              margins: { top: 0, bottom: 0, left: 0, right: 0 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: BRAND.PHI,
                      font: FONT_DISPLAY,
                      size: 56,
                      color: COLORS.GOLD,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 85, type: WidthType.PERCENTAGE },
              verticalAlign: "center",
              margins: { top: 0, bottom: 0, left: 0, right: 0 },
              children: [
                new Paragraph({
                  spacing: { after: 40 },
                  children: [
                    new TextRun({
                      text: BRAND.STUDIO,
                      font: FONT_DISPLAY,
                      size: 20,
                      characterSpacing: 80,
                      color: COLORS.INK,
                      bold: true,
                    }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: BRAND.TAGLINE,
                      font: FONT_BODY,
                      size: 16,
                      color: COLORS.INK_SOFT,
                      italics: true,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 120, after: 240 },
      border: bottomOnlyBorder(COLORS.GOLD, 12),
      children: [new TextRun({ text: "" })],
    }),
  ];
}

/**
 * Brand footer — location, domain, tagline.
 */
export function brandFooter(): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 360, after: 60 },
      alignment: AlignmentType.CENTER,
      border: {
        top: { style: BorderStyle.SINGLE, size: 6, color: COLORS.GOLD },
        bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      },
      children: [
        new TextRun({
          text: `${BRAND.PHI}  ${BRAND.STUDIO}`,
          font: FONT_DISPLAY,
          size: 18,
          characterSpacing: 60,
          color: COLORS.INK,
          bold: true,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text: BRAND.LOCATION,
          font: FONT_BODY,
          size: 18,
          color: COLORS.INK_SOFT,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
      children: [
        new TextRun({
          text: `${BRAND.DOMAIN}  ·  ${BRAND.SIGNATURE}`,
          font: FONT_BODY,
          size: 18,
          color: COLORS.GOLD,
          italics: true,
        }),
      ],
    }),
  ];
}

/**
 * Build a complete branded document from a list of body elements.
 * Handles page setup, margins, headers/footers, and brand wrapping.
 */
export function buildDocument(
  bodyElements: (Paragraph | Table)[],
  opts: { documentTitle?: string } = {}
): Document {
  const section: ISectionOptions = {
    properties: {
      page: {
        margin: {
          top: 1080, // 0.75 inch
          right: 1080,
          bottom: 1080,
          left: 1080,
        },
      },
    },
    children: [
      ...brandHeader(),
      ...(opts.documentTitle ? [documentTitle(opts.documentTitle), spacer(120)] : []),
      ...bodyElements,
      ...brandFooter(),
    ],
  };

  return new Document({
    creator: BRAND.STUDIO,
    title: opts.documentTitle || "Studio of Phronesis Document",
    description: "Generated by the Studio of Phronesis admin portal",
    sections: [section],
  });
}

/**
 * Pack a Document to a Buffer (for streaming as a download).
 */
export async function packDocument(doc: Document): Promise<Buffer> {
  return Packer.toBuffer(doc);
}
