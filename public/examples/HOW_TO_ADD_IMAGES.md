# How to Add Images to Templates

When adding images to your template JSON files, follow these guidelines to ensure they display properly in the template preview:

## Image Object Structure

Images in templates must follow this structure:

```json
{
  "type": "image",
  "version": "5.3.0",
  "originX": "left",
  "originY": "top",
  "left": 100,
  "top": 100,
  "width": 200,
  "height": 150,
  "scaleX": 1,
  "scaleY": 1,
  "angle": 0,
  "flipX": false,
  "flipY": false,
  "opacity": 1,
  "visible": true,
  "src": "/path/to/your/image.jpg",
  "crossOrigin": "anonymous",
  "filters": []
}
```

## Important Image Properties

### Required Properties:
- `type`: Must be `"image"`
- `src`: The URL or path to the image file
  - Use absolute paths starting with `/` for images in your public folder
  - Example: `"/canzat/images/business-card.jpg"`
  - Or use full URLs: `"https://example.com/image.jpg"`
- `width` and `height`: Original dimensions of the image
- `left` and `top`: Position on the canvas

### Recommended Properties:
- `crossOrigin`: Set to `"anonymous"` to handle CORS issues
- `scaleX` and `scaleY`: Scale factors (1 = original size)

## Example Template with Image

Here's a complete example of a template with an image:

```json
{
  "version": "5.3.0",
  "isPremium": false,
  "templateInfo": {
    "name": "Card with Image",
    "category": "Card",
    "description": "Card template with background image"
  },
  "width": 800,
  "height": 600,
  "background": "#ffffff",
  "objects": [
    {
      "type": "image",
      "version": "5.3.0",
      "left": 0,
      "top": 0,
      "width": 800,
      "height": 600,
      "scaleX": 1,
      "scaleY": 1,
      "src": "/canzat/images/background.jpg",
      "crossOrigin": "anonymous",
      "opacity": 0.8,
      "id": "background-image"
    },
    {
      "type": "i-text",
      "left": 400,
      "top": 300,
      "fontSize": 48,
      "fontFamily": "Helvetica",
      "fill": "#ffffff",
      "text": "Your Text Here",
      "textAlign": "center",
      "originX": "center",
      "originY": "center",
      "id": "title-text"
    }
  ]
}
```

## Placing Images in the Project

### Option 1: Public Folder (Recommended)
Place your images in `/public/` folder or subfolders:
- `/public/images/` - General images
- `/public/canzat/images/` - Canzat template images
- `/public/examples/` - Example template images

Then reference them in templates:
```json
"src": "/images/my-image.jpg"
```

### Option 2: External URLs
Use full URLs for images hosted elsewhere:
```json
"src": "https://example.com/image.jpg"
```

**Note:** External images must support CORS or they won't load in the canvas.

## Troubleshooting

### Image Not Showing in Preview?

1. **Check the image path** - Make sure the `src` path is correct
2. **Check CORS** - Ensure `crossOrigin` is set to `"anonymous"`
3. **Check file exists** - Verify the image file exists in the specified location
4. **Check image format** - Use common formats: JPG, PNG, SVG, WebP
5. **Check console** - Open browser developer tools to see error messages

### CORS Errors?

If you see CORS errors in the console:
- For local images: Ensure they're in the `/public` folder
- For external images: The hosting server must allow cross-origin requests
- Always include `"crossOrigin": "anonymous"` in your image objects

## Best Practices

1. **Optimize images** - Compress images to reduce file size
2. **Use appropriate dimensions** - Match image size to display size
3. **Name images descriptively** - Use clear, meaningful filenames
4. **Test locally first** - Always test templates locally before deploying
5. **Use relative paths** - Prefer `/public` folder paths over external URLs

## Creating Templates from the Editor

The easiest way to create templates with images:

1. Open the editor
2. Upload your image using the Upload panel
3. Add text and other elements
4. Export as JSON
5. Add the `templateInfo` section at the top
6. Save to `/public/examples/`

The image URLs will be automatically included with proper CORS settings!
