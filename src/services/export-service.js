import { saveAs } from "file-saver";
import jsPDF from "jspdf";

export function exportAsJson(canvas, fileName = "FileName") {
  if (!canvas) return;

  try {
    const canvasData = canvas.toJSON(["id", "filters"]);

    const jsonString = JSON.stringify(canvasData, null, 2);

    const canvasJsonBlob = new Blob([jsonString], { type: "application/json" });
    saveAs(canvasJsonBlob, `${fileName}.json`);
  } catch (e) {
    return false;
  }
}

export function exportAsPng(canvas, fileName = "PNG FileName", options = {}) {
  if (!canvas) return;

  try {
    const defaultOptions = {
      format: "png",
      quality: 1,
      multiplier: 1,
      enableRetinaScaling: true,
      ...options,
    };

    // Store original background color
    const originalBgColor = canvas.backgroundColor;
    
    // If includeBackground is false, temporarily set transparent background
    if (options.includeBackground === false) {
      canvas.backgroundColor = null;
    }

    const dataURL = canvas.toDataURL(defaultOptions);

    // Restore original background
    if (options.includeBackground === false) {
      canvas.backgroundColor = originalBgColor;
      canvas.renderAll();
    }

    saveAs(dataURL, `${fileName}.png`);
    return true;
  } catch (e) {
    console.error("PNG export error:", e);
    return false;
  }
}

export function exportAsSVG(canvas, fileName = "SVG Design", options = {}) {
  if (!canvas) return;

  try {
    // Store original background color
    const originalBgColor = canvas.backgroundColor;
    
    // If includeBackground is false, temporarily set transparent background
    if (options.includeBackground === false) {
      canvas.backgroundColor = null;
    }

    const svgData = canvas.toSVG();

    // Restore original background
    if (options.includeBackground === false) {
      canvas.backgroundColor = originalBgColor;
      canvas.renderAll();
    }

    const blob = new Blob([svgData], { type: "image/svg+xml" });
    saveAs(blob, `${fileName}.svg`);

    return true;
  } catch (e) {
    console.error("SVG export error:", e);
    return false;
  }
}

export function exportAsPDF(canvas, fileName = "PDF Design", options = {}) {
  if (!canvas) return;

  try {
    const defaultOptions = {
      format: "a4",
      orientation: "landscape",
      unit: "mm",
      ...options,
    };

    const pdf = new jsPDF(
      defaultOptions.orientation,
      defaultOptions.unit,
      defaultOptions.format
    );

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const scale =
      Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight) * 0.9; //90% available space

    const x = (pdfWidth - canvasWidth * scale) / 2;
    const y = (pdfHeight - canvasHeight * scale) / 2;

    // Store original background color
    const originalBgColor = canvas.backgroundColor;
    
    // If includeBackground is false, temporarily set transparent background
    if (options.includeBackground === false) {
      canvas.backgroundColor = null;
    }

    const imgData = canvas.toDataURL("image/png", 1.0);

    // Restore original background
    if (options.includeBackground === false) {
      canvas.backgroundColor = originalBgColor;
      canvas.renderAll();
    }

    pdf.addImage(
      imgData,
      "PNG",
      x,
      y,
      canvasWidth * scale,
      canvasHeight * scale
    );

    pdf.save(`${fileName}.pdf`);

    return true;
  } catch (e) {
    console.error("PDF export error:", e);
    return false;
  }
}
