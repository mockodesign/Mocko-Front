import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const examplesPath = path.join(process.cwd(), 'public', 'examples');
    
    // Check if examples directory exists
    if (!fs.existsSync(examplesPath)) {
      return NextResponse.json({ error: 'Examples directory not found' }, { status: 404 });
    }

    // Read all files in examples directory
    const files = fs.readdirSync(examplesPath);
    
    // Filter only JSON files and exclude README.md
    const jsonFiles = files.filter(file => 
      file.endsWith('.json') && file !== 'README.md'
    );

    const templates = [];

    // Process each JSON file
    for (const fileName of jsonFiles) {
      try {
        const filePath = path.join(examplesPath, fileName);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const templateData = JSON.parse(fileContent);

        // Extract template ID from filename (remove .json extension)
        const id = fileName.replace('.json', '');
        
        // Get template info from the JSON file or use defaults
        const templateInfo = templateData.templateInfo || {};
        const name = templateInfo.name || id.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        const category = templateInfo.category || 'general';
        const description = templateInfo.description || `${name} template`;
        
        // Get dimensions from template data or use defaults
        const width = templateData.width || 800;
        const height = templateData.height || 600;
        
        // Get premium status from template data
        const isPremium = templateData.isPremium === true;

        // Check if thumbnail exists, otherwise use a default
        const thumbnailPath = path.join(process.cwd(), 'public', 'examples', `${id}-thumb.jpg`);
        const thumbnail = fs.existsSync(thumbnailPath) 
          ? `/examples/${id}-thumb.jpg`
          : '/placeholder-template.svg'; // Default placeholder image

        // Create template object
        const template = {
          id,
          name,
          fileName,
          thumbnail,
          category,
          description,
          width,
          height,
          isPremium,
          lastModified: fs.statSync(filePath).mtime.toISOString()
        };

        templates.push(template);
      } catch (error) {
        console.error(`Error processing template file ${fileName}:`, error);
        // Continue processing other files even if one fails
      }
    }

    // Sort templates by category and then by name
    templates.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.name.localeCompare(b.name);
    });

    // Process images from pro and normal folders
    const processImageFolder = (folderName, isPremium) => {
      const folderPath = path.join(examplesPath, folderName);
      
      if (fs.existsSync(folderPath)) {
        const imageFiles = fs.readdirSync(folderPath).filter(file => 
          /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
        );
        
        for (const fileName of imageFiles) {
          try {
            const filePath = path.join(folderPath, fileName);
            const stats = fs.statSync(filePath);
            
            // Extract template ID from filename (remove extension)
            const id = `${folderName}-${fileName.replace(/\.[^/.]+$/, '')}`;
            
            // Create a name from filename
            const name = fileName.replace(/\.[^/.]+$/, '').split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            
            const category = isPremium ? 'Premium Images' : 'Free Images';
            const description = `${name} - Click to use as design background`;
            
            // For images, we'll create a simple fabric.js canvas with the image as background
            const template = {
              id,
              name,
              fileName: null, // No JSON file for images
              imagePath: `/examples/${folderName}/${fileName}`,
              thumbnail: `/examples/${folderName}/${fileName}`,
              category,
              description,
              width: 800, // Default canvas size, will be adjusted when image loads
              height: 600,
              isPremium,
              isImage: true, // Flag to identify image templates
              lastModified: stats.mtime.toISOString()
            };

            templates.push(template);
          } catch (error) {
            console.error(`Error processing image file ${fileName}:`, error);
          }
        }
      }
    };

    // Process normal (free) images
    processImageFolder('normal', false);
    
    // Process pro (premium) images
    processImageFolder('pro', true);

    // Sort again after adding images
    templates.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({
      success: true,
      data: templates,
      count: templates.length
    });

  } catch (error) {
    console.error('Error loading templates:', error);
    return NextResponse.json(
      { error: 'Failed to load templates', details: error.message },
      { status: 500 }
    );
  }
}
