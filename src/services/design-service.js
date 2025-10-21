import { fetchWithAuth } from "./base-service";

export async function getUserDesigns() {
  return fetchWithAuth("/v1/designs");
}

export async function getUserDesignByID(designId) {
  return fetchWithAuth(`/v1/designs/${designId}`);
}

export async function saveDesign(designData, designId = null) {
  return fetchWithAuth(`/v1/designs`, {
    method: "POST",
    body: {
      ...designData,
      designId,
    },
  });
}

export async function deleteDesign(designId) {
  return fetchWithAuth(`/v1/designs/${designId}`, {
    method: "DELETE",
  });
}

/**
 * Generate thumbnail from canvas for faster loading
 */
async function generateThumbnail(canvas) {
  try {
    // Generate a small thumbnail (300x300 max) for fast loading
    const thumbnailDataUrl = canvas.toDataURL({
      format: 'jpeg',
      quality: 0.7,
      multiplier: Math.min(300 / Math.max(canvas.width, canvas.height), 1)
    });
    return thumbnailDataUrl;
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    return null;
  }
}

export async function saveCanvasState(
  canvas,
  designId = null,
  title = "Untitled Design"
) {
  if (!canvas) return false;

  try {
    const canvasData = canvas.toJSON(["id", "filters"]);

    // PERFORMANCE FIX: Generate thumbnail for fast loading in design lists
    const thumbnail = await generateThumbnail(canvas);

    const designData = {
      name: title,
      canvasData: JSON.stringify(canvasData),
      width: canvas.width,
      height: canvas.height,
      thumbnail: thumbnail, // Add thumbnail
    };

    return saveDesign(designData, designId);
  } catch (error) {
    console.error("Error saving canvas state:", error);
    throw error;
  }
}
