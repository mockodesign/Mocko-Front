// Template service for dynamic template loading
import { apiRequest } from './base-service';

/**
 * Fetch all available templates from the examples folder
 * This automatically includes any new JSON files added to /public/examples/
 */
export async function getAvailableTemplates() {
  try {
    const response = await fetch('/api/templates', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch templates: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to load templates');
    }

    return result;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
}

/**
 * Fetch a specific template by ID
 */
export async function getTemplateById(templateId) {
  try {
    const templates = await getAvailableTemplates();
    const template = templates.data.find(t => t.id === templateId);
    
    if (!template) {
      throw new Error(`Template with ID '${templateId}' not found`);
    }

    return template;
  } catch (error) {
    console.error(`Error fetching template ${templateId}:`, error);
    throw error;
  }
}

/**
 * Load template JSON data or create canvas data for image templates
 */
export async function loadTemplateData(fileName, template = null) {
  try {
    // If it's an image template, create a fabric.js canvas with the image
    if (template && template.isImage) {
      return createImageCanvasData(template);
    }
    
    // For regular JSON templates
    const response = await fetch(`/examples/${fileName}`);
    
    if (!response.ok) {
      throw new Error(`Failed to load template data: ${response.status} ${response.statusText}`);
    }

    const templateData = await response.json();
    return templateData;
  } catch (error) {
    console.error(`Error loading template data from ${fileName}:`, error);
    throw error;
  }
}

/**
 * Create fabric.js canvas data for image templates
 */
function createImageCanvasData(template) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = function() {
      const canvasData = {
        version: "5.3.0",
        isPremium: template.isPremium,
        templateInfo: {
          name: template.name,
          category: template.category,
          description: template.description
        },
        width: this.naturalWidth,
        height: this.naturalHeight,
        objects: [
          {
            type: "image",
            version: "5.3.0",
            originX: "left",
            originY: "top",
            left: 0,
            top: 0,
            width: this.naturalWidth,
            height: this.naturalHeight,
            fill: "rgb(0,0,0)",
            stroke: null,
            strokeWidth: 0,
            scaleX: 1,
            scaleY: 1,
            angle: 0,
            flipX: false,
            flipY: false,
            opacity: 1,
            visible: true,
            src: template.imagePath,
            crossOrigin: "anonymous",
            id: "background-image"
          }
        ]
      };
      
      resolve(canvasData);
    };
    
    img.onerror = function() {
      reject(new Error(`Failed to load image: ${template.imagePath}`));
    };
    
    img.src = template.imagePath;
  });
}

/**
 * Get templates by category
 */
export async function getTemplatesByCategory(category) {
  try {
    const templates = await getAvailableTemplates();
    return {
      ...templates,
      data: templates.data.filter(template => template.category === category)
    };
  } catch (error) {
    console.error(`Error fetching templates for category ${category}:`, error);
    throw error;
  }
}

/**
 * Get premium templates only
 */
export async function getPremiumTemplates() {
  try {
    const templates = await getAvailableTemplates();
    return {
      ...templates,
      data: templates.data.filter(template => template.isPremium)
    };
  } catch (error) {
    console.error('Error fetching premium templates:', error);
    throw error;
  }
}

/**
 * Get free templates only
 */
export async function getFreeTemplates() {
  try {
    const templates = await getAvailableTemplates();
    return {
      ...templates,
      data: templates.data.filter(template => !template.isPremium)
    };
  } catch (error) {
    console.error('Error fetching free templates:', error);
    throw error;
  }
}
