import nodemailer from 'nodemailer';

export const sendWelcomeEmail = async (userEmail: string, username: string): Promise<any> => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"TaskFlow Support" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: 'Welcome to TaskFlow!',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #6366f1; margin: 0;">Welcome to TaskFlow, ${username}!</h1>
                    </div>
                    <div style="color: #333; line-height: 1.6;">
                        <p>Hi ${username},</p>
                        <p>We're thrilled to have you join TaskFlow! Our mission is to help you organize your work and life, just like Notion, but focused on your specific project needs.</p>
                        <p>Here's how you can get started with TaskFlow:</p>
                        <ul style="padding-left: 20px;">
                            <li>Create your first project workspace</li>
                            <li>Add tasks and set deadlines</li>
                            <li>Collaborate with your team in real-time</li>
                        </ul>
                        <div style="text-align: center; margin-top: 30px; margin-bottom: 30px;">
                            <a href="#" style="background-color: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Start Organizing</a>
                        </div>
                        <p>If you have any questions, feel free to reply to this email. We're here to help you stay productive.</p>
                        <p>Cheers,<br>The TaskFlow Team</p>
                    </div>
                    <div style="margin-top: 40px; text-align: center; border-top: 1px solid #eeeeee; padding-top: 20px; color: #888; font-size: 0.9em;">
                        &copy; 2026 TaskFlow Inc. All rights reserved.
                    </div>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};
