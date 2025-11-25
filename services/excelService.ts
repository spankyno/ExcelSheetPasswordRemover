import JSZip from 'jszip';
import { SheetInfo } from '../types';

/**
 * Loads an Excel file (zip), identifies worksheets, and checks for protection.
 */
export const analyzeExcelFile = async (file: File): Promise<SheetInfo[]> => {
  try {
    const zip = await JSZip.loadAsync(file);
    const sheets: SheetInfo[] = [];
    
    // We strictly look for files in xl/worksheets/ that end in .xml
    // This matches the prompt requirement: "Navegar a ruta xl/worksheets/" and "Listar archivos XML"
    const sheetFolder = zip.folder("xl/worksheets");
    
    if (!sheetFolder) {
      throw new Error("No se encontró la carpeta de hojas de trabajo (xl/worksheets) en el archivo.");
    }

    const filePromises: Promise<void>[] = [];

    sheetFolder.forEach((relativePath, zipEntry) => {
      if (!relativePath.endsWith('.xml')) return;

      const promise = (async () => {
        const content = await zipEntry.async("string");
        // Regex to check if the self-closing tag or open tag exists for sheetProtection
        const hasProtection = /<sheetProtection\s+[^>]*\/?>/.test(content);
        
        sheets.push({
          id: zipEntry.name, // Full path in zip
          name: relativePath, // Just the filename, e.g., "sheet1.xml"
          isProtected: hasProtection,
          selected: false // Default not selected
        });
      })();
      filePromises.push(promise);
    });

    await Promise.all(filePromises);

    // Sort naturally (sheet1, sheet2, sheet10...)
    return sheets.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  } catch (error) {
    console.error("Error analyzing Excel file:", error);
    throw new Error("El archivo no parece ser un Excel válido (.xlsx) o está dañado.");
  }
};

/**
 * Removes protection from selected sheets and generates a new .xlsx file.
 */
export const unlockExcelSheets = async (
  originalFile: File, 
  sheetsToUnlock: string[] // List of IDs (paths) to unlock
): Promise<Blob> => {
  try {
    const zip = await JSZip.loadAsync(originalFile);

    // Process each sheet selected for unlocking
    for (const sheetPath of sheetsToUnlock) {
      const file = zip.file(sheetPath);
      if (file) {
        let xmlContent = await file.async("string");
        
        // Remove the protection tag
        // Matches <sheetProtection ... /> or <sheetProtection ... ></sheetProtection>
        // The prompt specific example: return xmlContent.replace(/<sheetProtection[^>]*\/>/g, '');
        // We make it slightly more robust for spacing
        xmlContent = xmlContent.replace(/<sheetProtection[\s\S]*?\/>/g, '');
        xmlContent = xmlContent.replace(/<sheetProtection[\s\S]*?>[\s\S]*?<\/sheetProtection>/g, '');

        // Update the file in the zip object
        zip.file(sheetPath, xmlContent);
      }
    }

    // Generate the new binary
    // Prompt Step 5, 6: Re-comprimir... Cambiar extension a .xlsx
    const blob = await zip.generateAsync({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      compression: "DEFLATE"
    });

    return blob;

  } catch (error) {
    console.error("Error unlocking Excel file:", error);
    throw new Error("Hubo un error al procesar y reconstruir el archivo Excel.");
  }
};