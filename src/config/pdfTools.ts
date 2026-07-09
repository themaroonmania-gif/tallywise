export type PdfToolGroup = 'organize' | 'optimize' | 'convert' | 'edit' | 'security';

export interface PdfToolDef {
  slug: string;
  name: string;
  group: PdfToolGroup;
  iconName: string; // lucide-react icon name
  seoTitle: string;
  seoDescription: string;
  h1: string;
  /** Short one-liner shown on cards + under the H1 */
  tagline: string;
  explainerHtml: string;
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
  /** 'live' tools are implemented; 'soon' render a coming-soon panel */
  status: 'live' | 'soon';
}

export const PDF_GROUPS: Record<PdfToolGroup, { name: string; description: string; color: string }> = {
  organize: {
    name: 'Organize',
    description: 'Merge, split, rotate, and rearrange the pages of your PDF documents.',
    color: 'indigo',
  },
  optimize: {
    name: 'Optimize',
    description: 'Shrink file size so your PDFs are faster to share and easier to upload.',
    color: 'emerald',
  },
  convert: {
    name: 'Convert',
    description: 'Turn PDFs into images, and images into PDFs, right in your browser.',
    color: 'amber',
  },
  edit: {
    name: 'Edit & Sign',
    description: 'Add text, images, watermarks, page numbers, and signatures to any PDF.',
    color: 'rose',
  },
  security: {
    name: 'Security',
    description: 'Add or remove password protection on your PDF files.',
    color: 'teal',
  },
};

const PRIVACY_NOTE =
  '<p><strong>100% private:</strong> This tool runs entirely inside your web browser. Your files are never uploaded to a server &mdash; they never leave your device. That makes it faster, and it means your documents stay completely confidential.</p>';

export const pdfTools: PdfToolDef[] = [
  // ---------- ORGANIZE ----------
  {
    slug: 'merge-pdf',
    name: 'Merge PDF',
    group: 'organize',
    iconName: 'Combine',
    seoTitle: 'Merge PDF Files Online Free - Combine PDFs in Your Browser',
    seoDescription: 'Combine multiple PDF files into one document for free. Drag to reorder, then merge instantly. 100% private &mdash; files never leave your browser.',
    h1: 'Merge PDF Files',
    tagline: 'Combine several PDFs into a single document, in the order you choose.',
    explainerHtml: `
      ${PRIVACY_NOTE}
      <h3>How to merge PDF files</h3>
      <p>Select two or more PDF files, drag them into the order you want, and click Merge. Tallywise stitches every page together into one clean PDF that you can download immediately.</p>
      <h3>Why merge PDFs?</h3>
      <p>Combining files is handy for assembling reports from multiple sources, joining scanned pages, or bundling invoices and receipts into a single document for sharing or archiving.</p>
    `,
    faqs: [
      { question: 'Is there a limit on how many PDFs I can merge?', answer: 'There is no fixed limit. Because the merge happens on your own device, the practical limit is your device\'s available memory. Dozens of typical documents merge without issue.' },
      { question: 'Are my files uploaded to a server?', answer: 'No. The entire merge runs in your browser using JavaScript. Your files never leave your computer, which keeps them private and makes the tool fast.' },
      { question: 'Can I change the order of the files?', answer: 'Yes. After adding your files you can drag them up or down to set the exact order the pages should appear in the merged document.' },
    ],
    relatedSlugs: ['split-pdf', 'rotate-pdf', 'compress-pdf'],
    status: 'live',
  },
  {
    slug: 'split-pdf',
    name: 'Split PDF',
    group: 'organize',
    iconName: 'Scissors',
    seoTitle: 'Split PDF Online Free - Extract Pages From a PDF in Your Browser',
    seoDescription: 'Split a PDF into separate files or extract specific page ranges for free. Runs entirely in your browser &mdash; your files stay private.',
    h1: 'Split PDF',
    tagline: 'Break a PDF into separate files or pull out the exact pages you need.',
    explainerHtml: `
      ${PRIVACY_NOTE}
      <h3>How to split a PDF</h3>
      <p>Upload your PDF, choose whether to split every page into its own file or extract a custom range (for example, pages 3&ndash;7), and download the result.</p>
    `,
    faqs: [
      { question: 'Can I extract just one page?', answer: 'Yes. Enter a single page number as your range (e.g. 5 to 5) to pull out exactly one page as its own PDF.' },
      { question: 'Does splitting reduce quality?', answer: 'No. Splitting copies the original pages exactly, so text stays sharp and selectable and images keep their original resolution.' },
      { question: 'Is it private?', answer: 'Yes, completely. The split runs in your browser and your file is never uploaded anywhere.' },
    ],
    relatedSlugs: ['merge-pdf', 'extract-pages', 'remove-pages'],
    status: 'live',
  },
  {
    slug: 'rotate-pdf',
    name: 'Rotate PDF',
    group: 'organize',
    iconName: 'RotateCw',
    seoTitle: 'Rotate PDF Online Free - Fix Sideways or Upside-Down Pages',
    seoDescription: 'Rotate PDF pages 90, 180, or 270 degrees and save the corrected file. Free, private, and entirely in-browser.',
    h1: 'Rotate PDF',
    tagline: 'Turn sideways or upside-down pages the right way up and save permanently.',
    explainerHtml: `
      ${PRIVACY_NOTE}
      <h3>How to rotate a PDF</h3>
      <p>Upload your PDF, rotate all pages or select individual pages, choose the rotation direction, and download the corrected document with the new orientation baked in.</p>
    `,
    faqs: [
      { question: 'Will the rotation be saved permanently?', answer: 'Yes. Unlike simply viewing a rotated page, this tool writes the new orientation into the file so it opens correctly everywhere.' },
      { question: 'Can I rotate only some pages?', answer: 'Yes. You can apply rotation to every page at once or target specific pages individually.' },
    ],
    relatedSlugs: ['merge-pdf', 'split-pdf', 'organize-pdf'],
    status: 'live',
  },
  {
    slug: 'organize-pdf',
    name: 'Organize / Reorder Pages',
    group: 'organize',
    iconName: 'LayoutGrid',
    seoTitle: 'Organize PDF Pages Online Free - Reorder & Delete Pages',
    seoDescription: 'Rearrange, reorder, and delete PDF pages with a visual drag-and-drop editor. Free and 100% in-browser.',
    h1: 'Organize PDF Pages',
    tagline: 'Visually reorder or delete pages with drag-and-drop thumbnails.',
    explainerHtml: `
      ${PRIVACY_NOTE}
      <h3>How to reorganize your PDF</h3>
      <p>Upload your PDF to see a thumbnail of every page. Drag pages into a new order or remove the ones you don\'t need, then download your reorganized document.</p>
    `,
    faqs: [
      { question: 'Can I delete pages here too?', answer: 'Yes. This tool lets you both reorder and remove pages in one place using page thumbnails.' },
    ],
    relatedSlugs: ['merge-pdf', 'remove-pages', 'rotate-pdf'],
    status: 'soon',
  },
  {
    slug: 'remove-pages',
    name: 'Delete PDF Pages',
    group: 'organize',
    iconName: 'FileMinus',
    seoTitle: 'Delete Pages From PDF Online Free - Remove Unwanted Pages',
    seoDescription: 'Remove specific pages from a PDF and download the trimmed file. Free, fast, and private &mdash; runs in your browser.',
    h1: 'Delete Pages From a PDF',
    tagline: 'Remove the pages you don\'t need and keep the rest.',
    explainerHtml: `
      ${PRIVACY_NOTE}
      <h3>How to delete PDF pages</h3>
      <p>Upload your PDF, mark the pages to remove, and download a new file containing only the pages you kept.</p>
    `,
    faqs: [
      { question: 'Does deleting pages change the others?', answer: 'No. The remaining pages are preserved exactly as they were, just without the pages you removed.' },
    ],
    relatedSlugs: ['organize-pdf', 'extract-pages', 'split-pdf'],
    status: 'live',
  },
  {
    slug: 'extract-pages',
    name: 'Extract PDF Pages',
    group: 'organize',
    iconName: 'FilePlus',
    seoTitle: 'Extract Pages From PDF Online Free - Save Selected Pages',
    seoDescription: 'Pull specific pages out of a PDF into a new file for free. Private, in-browser, no upload required.',
    h1: 'Extract Pages From a PDF',
    tagline: 'Save a selection of pages as a brand-new PDF.',
    explainerHtml: `
      ${PRIVACY_NOTE}
      <h3>How to extract PDF pages</h3>
      <p>Upload your PDF and choose the pages you want to keep. Tallywise builds a new PDF from just those pages for you to download.</p>
    `,
    faqs: [
      { question: 'What is the difference between extract and split?', answer: 'Extract pulls a chosen set of pages into one new file, while split can break a document into many separate files. Both keep your pages at full quality.' },
    ],
    relatedSlugs: ['split-pdf', 'remove-pages', 'merge-pdf'],
    status: 'live',
  },

  // ---------- OPTIMIZE ----------
  {
    slug: 'compress-pdf',
    name: 'Compress PDF',
    group: 'optimize',
    iconName: 'Minimize2',
    seoTitle: 'Compress PDF Online Free - Reduce PDF File Size in Your Browser',
    seoDescription: 'Shrink PDF file size for free so it is easier to email and upload. Private, in-browser compression &mdash; no file upload.',
    h1: 'Compress PDF',
    tagline: 'Reduce PDF file size while keeping your document readable.',
    explainerHtml: `
      ${PRIVACY_NOTE}
      <h3>How compression works</h3>
      <p>Tallywise reduces file size primarily by re-encoding embedded images at a lower resolution and quality level that you control, then rebuilding the PDF. Text-heavy documents also benefit from stream optimization.</p>
      <h3>When to compress</h3>
      <p>Compress when a PDF is too large to email (many inboxes cap attachments around 20&ndash;25&nbsp;MB) or when a website form rejects your upload for being too big.</p>
    `,
    faqs: [
      { question: 'Will compression blur my text?', answer: 'No. Text and vector graphics stay crisp. Size savings come mainly from images, so scanned or image-heavy PDFs shrink the most.' },
      { question: 'How much smaller will my file get?', answer: 'It depends on the content. Image-heavy or scanned PDFs can shrink dramatically, while documents that are already mostly text may only reduce a little.' },
    ],
    relatedSlugs: ['merge-pdf', 'pdf-to-jpg', 'split-pdf'],
    status: 'live',
  },

  // ---------- CONVERT ----------
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    group: 'convert',
    iconName: 'Image',
    seoTitle: 'PDF to JPG Online Free - Convert PDF Pages to Images',
    seoDescription: 'Convert each page of a PDF into a high-quality JPG image for free. Runs in your browser &mdash; files stay private.',
    h1: 'Convert PDF to JPG',
    tagline: 'Turn every page of your PDF into a downloadable JPG image.',
    explainerHtml: `
      ${PRIVACY_NOTE}
      <h3>How to convert PDF to JPG</h3>
      <p>Upload your PDF and Tallywise renders each page to a crisp JPG image. Download images individually or as a single ZIP archive.</p>
    `,
    faqs: [
      { question: 'What resolution are the images?', answer: 'Pages are rendered at a high resolution suitable for viewing and printing. You can pick the quality level before converting.' },
      { question: 'Can I convert to PNG instead?', answer: 'Yes &mdash; use our PDF to PNG option for lossless images with transparency support.' },
    ],
    relatedSlugs: ['jpg-to-pdf', 'compress-pdf', 'pdf-to-png'],
    status: 'live',
  },
  {
    slug: 'pdf-to-png',
    name: 'PDF to PNG',
    group: 'convert',
    iconName: 'Image',
    seoTitle: 'PDF to PNG Online Free - Convert PDF Pages to PNG Images',
    seoDescription: 'Convert PDF pages into lossless PNG images for free, right in your browser. No uploads, fully private.',
    h1: 'Convert PDF to PNG',
    tagline: 'Render each PDF page as a lossless, high-quality PNG image.',
    explainerHtml: `
      ${PRIVACY_NOTE}
      <h3>PNG vs JPG</h3>
      <p>PNG is lossless and supports transparency, making it ideal for documents with sharp text and line art. JPG produces smaller files and is better for photos.</p>
    `,
    faqs: [
      { question: 'Why choose PNG over JPG?', answer: 'PNG keeps edges perfectly sharp and supports transparency, which is great for text, diagrams, and logos. It produces larger files than JPG.' },
    ],
    relatedSlugs: ['pdf-to-jpg', 'jpg-to-pdf', 'compress-pdf'],
    status: 'live',
  },
  {
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    group: 'convert',
    iconName: 'FileImage',
    seoTitle: 'JPG to PDF Online Free - Convert Images to a PDF Document',
    seoDescription: 'Combine JPG or PNG images into a single PDF for free. Drag to reorder pages. 100% private, in-browser conversion.',
    h1: 'Convert JPG to PDF',
    tagline: 'Combine your images into one tidy PDF, in the order you choose.',
    explainerHtml: `
      ${PRIVACY_NOTE}
      <h3>How to convert images to PDF</h3>
      <p>Upload one or more JPG or PNG images, drag them into order, choose page size and orientation, and download a single combined PDF.</p>
    `,
    faqs: [
      { question: 'Can I mix JPG and PNG images?', answer: 'Yes. You can add a mix of JPG and PNG files and they will all be placed into the same PDF.' },
      { question: 'Can I control the page size?', answer: 'Yes. Choose a standard page size like A4 or US Letter, or fit each page to the image dimensions.' },
    ],
    relatedSlugs: ['pdf-to-jpg', 'merge-pdf', 'compress-pdf'],
    status: 'live',
  },

  // ---------- EDIT & SIGN ----------
  {
    slug: 'edit-pdf',
    name: 'Edit PDF',
    group: 'edit',
    iconName: 'PenLine',
    seoTitle: 'Edit PDF Online Free - Add Text, Images & Shapes in Your Browser',
    seoDescription: 'A free online PDF editor. Add text, images, shapes, highlights, and freehand drawing to any PDF, then download. Private and in-browser.',
    h1: 'Edit PDF',
    tagline: 'Add text, images, shapes, highlights, and drawings directly onto your PDF.',
    explainerHtml: `
      ${PRIVACY_NOTE}
      <h3>What you can do</h3>
      <p>Open any PDF and add new text boxes, insert images, draw freehand, add rectangles and highlights, and place your content anywhere on the page. When you are done, download a new PDF with your edits merged in.</p>
      <h3>A note on editing existing text</h3>
      <p>Like most browser-based editors, this tool adds a new layer on top of your PDF rather than re-flowing the original typeset text. That means you can cover, annotate, and add to a document freely &mdash; ideal for filling forms, marking up contracts, and adding notes.</p>
    `,
    faqs: [
      { question: 'Can I edit the existing text in the PDF?', answer: 'You can add new text and cover existing text with boxes or highlights. Directly re-flowing the original typeset text is not possible in any purely in-browser editor, because PDFs store text as fixed positioned glyphs rather than editable paragraphs.' },
      { question: 'Are my edits saved to a server?', answer: 'No. All editing happens in your browser and the finished PDF is generated locally on your device.' },
      { question: 'Can I add my signature?', answer: 'Yes. Use the drawing tool to sign by hand, or use the dedicated Sign PDF tool to draw, type, or upload a signature.' },
    ],
    relatedSlugs: ['sign-pdf', 'watermark-pdf', 'page-numbers'],
    status: 'soon',
  },
  {
    slug: 'sign-pdf',
    name: 'Sign PDF',
    group: 'edit',
    iconName: 'Signature',
    seoTitle: 'Sign PDF Online Free - Add Your Signature to a PDF',
    seoDescription: 'Sign PDF documents for free. Draw, type, or upload your signature and place it anywhere on the page. Private and in-browser.',
    h1: 'Sign a PDF',
    tagline: 'Draw, type, or upload a signature and drop it onto your document.',
    explainerHtml: `
      ${PRIVACY_NOTE}
      <h3>How to sign a PDF</h3>
      <p>Upload your document, create a signature by drawing with your mouse or finger, typing your name, or uploading an image, then place it on the page and download the signed PDF.</p>
    `,
    faqs: [
      { question: 'Is an electronic signature legally valid?', answer: 'In many countries, simple electronic signatures are legally recognized for a wide range of agreements. For high-stakes documents, check the requirements that apply to you.' },
      { question: 'Is my signature stored anywhere?', answer: 'No. Your signature and document stay in your browser and are never uploaded.' },
    ],
    relatedSlugs: ['edit-pdf', 'watermark-pdf', 'page-numbers'],
    status: 'soon',
  },
  {
    slug: 'watermark-pdf',
    name: 'Watermark PDF',
    group: 'edit',
    iconName: 'Stamp',
    seoTitle: 'Add Watermark to PDF Online Free - Text or Image Watermarks',
    seoDescription: 'Stamp a text or image watermark across every page of a PDF for free. Adjust opacity, size, and angle. Private, in-browser.',
    h1: 'Add a Watermark to a PDF',
    tagline: 'Stamp text like "CONFIDENTIAL" or a logo across your pages.',
    explainerHtml: `
      ${PRIVACY_NOTE}
      <h3>How to watermark a PDF</h3>
      <p>Upload your PDF, type your watermark text (or upload a logo), then adjust its size, angle, opacity, and position before downloading the watermarked file.</p>
    `,
    faqs: [
      { question: 'Can I use a semi-transparent watermark?', answer: 'Yes. You control the opacity so your watermark can sit lightly behind the content or stand out boldly.' },
    ],
    relatedSlugs: ['page-numbers', 'edit-pdf', 'sign-pdf'],
    status: 'live',
  },
  {
    slug: 'page-numbers',
    name: 'Add Page Numbers',
    group: 'edit',
    iconName: 'Hash',
    seoTitle: 'Add Page Numbers to PDF Online Free - Number Your Pages',
    seoDescription: 'Add page numbers to a PDF for free with control over position, format, and starting number. Private, in-browser.',
    h1: 'Add Page Numbers to a PDF',
    tagline: 'Number your pages with control over position and format.',
    explainerHtml: `
      ${PRIVACY_NOTE}
      <h3>How to add page numbers</h3>
      <p>Upload your PDF, pick where the numbers should appear and how they should be formatted (for example "Page 1 of 10"), then download the numbered document.</p>
    `,
    faqs: [
      { question: 'Can I start numbering from a specific page?', answer: 'Yes. You can choose the starting number and which page the numbering begins on.' },
    ],
    relatedSlugs: ['watermark-pdf', 'edit-pdf', 'merge-pdf'],
    status: 'live',
  },

  // ---------- SECURITY ----------
  {
    slug: 'protect-pdf',
    name: 'Protect PDF',
    group: 'security',
    iconName: 'Lock',
    seoTitle: 'Password Protect PDF Online Free - Encrypt Your PDF',
    seoDescription: 'Add a password to a PDF so only people with the password can open it. Free and private &mdash; encryption happens in your browser.',
    h1: 'Password Protect a PDF',
    tagline: 'Encrypt your PDF so only people with the password can open it.',
    explainerHtml: `
      ${PRIVACY_NOTE}
      <h3>How to protect a PDF</h3>
      <p>Upload your PDF, set a password, and download an encrypted copy that requires that password to open.</p>
    `,
    faqs: [
      { question: 'What if I forget the password?', answer: 'There is no recovery. Store your password somewhere safe, because an encrypted PDF cannot be opened without it.' },
    ],
    relatedSlugs: ['unlock-pdf', 'merge-pdf', 'compress-pdf'],
    status: 'soon',
  },
  {
    slug: 'unlock-pdf',
    name: 'Unlock PDF',
    group: 'security',
    iconName: 'LockOpen',
    seoTitle: 'Unlock PDF Online Free - Remove PDF Password',
    seoDescription: 'Remove the password from a PDF you own for free. Enter the current password and download an unlocked copy. Private, in-browser.',
    h1: 'Unlock a PDF',
    tagline: 'Remove the password from a PDF you have the rights to open.',
    explainerHtml: `
      ${PRIVACY_NOTE}
      <h3>How to unlock a PDF</h3>
      <p>Upload your protected PDF, enter its current password, and download an unlocked copy with the password removed.</p>
      <p><strong>Please note:</strong> only remove passwords from documents you own or are authorized to modify.</p>
    `,
    faqs: [
      { question: 'Can this crack a password I don\'t know?', answer: 'No. You must provide the correct current password. This tool removes protection from documents you are authorized to open, it does not bypass unknown passwords.' },
    ],
    relatedSlugs: ['protect-pdf', 'merge-pdf', 'compress-pdf'],
    status: 'soon',
  },
];

export function getPdfTool(slug: string): PdfToolDef | undefined {
  return pdfTools.find((t) => t.slug === slug);
}
