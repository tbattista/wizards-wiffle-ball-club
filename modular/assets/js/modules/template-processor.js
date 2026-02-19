/**
 * Template Processor Module for Wizards Wiffle Ball Club
 * Handles processing HTML templates with placeholders
 */

/**
 * Process a template by replacing placeholders with actual content
 * @param {string} templateContent - The HTML template content with placeholders
 * @param {Object} replacements - An object with key-value pairs for replacements
 * @returns {string} - The processed HTML with replacements
 */
export function processTemplate(templateContent, replacements) {
  let processedContent = templateContent;
  
  // Replace each placeholder with its corresponding value
  for (const [placeholder, value] of Object.entries(replacements)) {
    const regex = new RegExp(`{{${placeholder}}}`, 'g');
    processedContent = processedContent.replace(regex, value || '');
  }
  
  return processedContent;
}

/**
 * Load a template file and process it with replacements
 * @param {string} templatePath - The path to the template file
 * @param {Object} replacements - An object with key-value pairs for replacements
 * @returns {Promise<string>} - A promise that resolves to the processed HTML
 */
export async function loadAndProcessTemplate(templatePath, replacements) {
  try {
    const response = await fetch(templatePath);
    if (!response.ok) {
      throw new Error(`Failed to load template: ${templatePath}`);
    }
    
    const templateContent = await response.text();
    return processTemplate(templateContent, replacements);
  } catch (error) {
    console.error(`Error processing template ${templatePath}:`, error);
    throw error;
  }
}

/**
 * Create a new page from a template and save it
 * This is a placeholder function that would typically be used in a build process
 * In a browser environment, this would need to be adapted
 */
export function createPageFromTemplate(templatePath, outputPath, replacements) {
  // This would be implemented in a build process or server-side
  console.log(`Creating page ${outputPath} from template ${templatePath}`);
  console.log('Replacements:', replacements);
  
  // In a real implementation, this would:
  // 1. Load the template
  // 2. Process it with replacements
  // 3. Write the result to outputPath
  
  return {
    templatePath,
    outputPath,
    replacements
  };
}
