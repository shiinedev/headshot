import { config } from "@/config";
import { ExternalServiceError } from "@/utils/errors";
import { logger } from "@/utils/logger";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";
import { renderTemplate } from "@/utils/templateEngine";


export class EmailService {
    
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    if (config.email.user && config.email.password) {
      this.transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.isSecure,
        auth: {
          user: config.email.user,
          pass: config.email.password,
        },
      });
    } else {
      logger.warn(
        "Email credentials are not set. Email service will not work properly.",
        {
          hasUser: !!config.email.user,
          hasPassword: !!config.email.password,
        }
      );
    }
  }

  //ensure this transporter is initialized
  private ensureTransporter(): void {
    if (!this.transporter) {
      logger.error("Email transporter is not initialized.");
      throw new ExternalServiceError(
        "Email service is not configured properly."
      );
    }
  }

  //wrap the layout around the content
  private async wrapLayout(content: string): Promise<string> {
    const layoutPath = path.join(
      process.cwd(),
      "src/templates/emails/layout/base.html"
    );
    const layout = await fs.readFile(layoutPath, "utf-8");
    return layout.replace("{{content}}", content);
  }

  //send template email

  async sendTemplateEmail(
    to: string,
    subject: string,
    templateName: string,
    data: Record<string, any>
  ): Promise<void> {
    this.ensureTransporter();

    const htmlContent = await renderTemplate(templateName, data, ".html");
    const html = await this.wrapLayout(htmlContent);
    const text = await renderTemplate(templateName, data, ".txt");

    logger.info(`Sending email to ${to}`, { to, subject, html, text });

    const mailOptions = {
      from:`"headShot pro" <${config.email.from}>`,
      to,
      subject,
      html,
      text,
    };

    logger.info("Email options prepared", mailOptions);

    try {
      const result = await this.transporter!.sendMail(mailOptions);
      logger.info("Email sent successfully", result);

      if (result.rejected && result.rejected.length > 0) {
        logger.error("Email delivery failed", {
            to,
          rejected: result.rejected,
          response: result.response,
        });
       
      }
    } catch (error:any) {
        logger.error("Error sending email", { 
            error: error.message,
            stack: error.stack,
            response: error.response,
            responseCode: error.responseCode,
            command: error.command,
            code: error.code,
            to,
            subject,
           templateName
         });
    }
  }

  async sendVerificationEmail(name:string,email:string,verificationTokenUrl:string):Promise<void>{
    
    const verificationUrl = `${config.frontend}/verify-email?token=${verificationTokenUrl}`;

    await this.sendTemplateEmail(
        email,
        "Verify your email address",
        "verification",
        {
            name,
            verificationUrl
        }
    )

  }

  async sendCreditAdditionEmail(name:string,email:string,creditsAdded:number,newBalance:number,amount:number, orderId:string):Promise<void>{

    const dashboardUrl = `${config.frontend}/dashboard/credits`;
    
    await this.sendTemplateEmail(
        email,
        "Credits added to your account",
        "payment-success",
        {
            name,
            creditsAdded,
            newBalance,
            amount,
            orderId,
            dashboardUrl
        }
    )
}

}


export const emailService = new EmailService();
