import fs from "fs/promises";
import path from "path";
import { logger } from "./logger";

const templateDir = path.join(process.cwd(), "src/templates/emails");

const interpreter = (template: string, data: Record<string, any>): string => {
  return template.replace(/{{(.*?)}}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match;
  });
};


export const renderTemplate = async (templateName:string,data:Record<string,any>,fileType: ".html" | ".txt"):Promise<string>=>{

    const templatePath = path.join(templateDir, `${templateName}${fileType}`);
    const template = await fs.readFile(templatePath,"utf-8");
    
    const content = interpreter(template,data);
    logger.info(`Rendered template ${templateName} with data`, { templateName, data });
    return content;
}

