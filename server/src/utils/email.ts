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
        return info;
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};

export const sendTaskAssignmentEmail = async (
    userEmail: string,
    username: string,
    taskTitle: string,
    projectTitle: string
): Promise<any> => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"TaskFlow Notifications" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `New Task Assigned: ${taskTitle}`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #6366f1; margin: 0;">You've been assigned a new task!</h1>
                    </div>
                    <div style="color: #333; line-height: 1.6;">
                        <p>Hi ${username},</p>
                        <p>You have been assigned a new task in the project <strong>${projectTitle}</strong>.</p>
                        <div style="background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 16px; margin: 20px 0; border-radius: 4px;">
                            <h2 style="margin-top: 0; color: #1e293b; font-size: 1.2em;">${taskTitle}</h2>
                            <p style="margin-bottom: 0; color: #475569;">Project: ${projectTitle}</p>
                        </div>
                        <p>Click the button below to view the task details and get started.</p>
                        <div style="text-align: center; margin-top: 30px; margin-bottom: 30px;">
                            <a href="#" style="background-color: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">View Task</a>
                        </div>
                        <p>Stay productive!<br>The TaskFlow Team</p>
                    </div>
                    <div style="margin-top: 40px; text-align: center; border-top: 1px solid #eeeeee; padding-top: 20px; color: #888; font-size: 0.9em;">
                        &copy; 2026 TaskFlow Inc. All rights reserved.
                    </div>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error('Error sending assignment email:', error);
    }
};

export const sendInviteEmail = async (
    recipientEmail: string,
    inviterName: string,
    role: string
): Promise<any> => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"TaskFlow Invitations" <${process.env.EMAIL_USER}>`,
            to: recipientEmail,
            subject: `${inviterName} invited you to join TaskFlow`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #6366f1; margin: 0;">You've been invited!</h1>
                    </div>
                    <div style="color: #333; line-height: 1.6;">
                        <p>Hello,</p>
                        <p><strong>${inviterName}</strong> has invited you to join their workspace on <strong>TaskFlow</strong> as a <strong>${role}</strong>.</p>
                        <p>TaskFlow is a workspace where team members collaborate on projects, track tasks, and stay productive together.</p>
                        <div style="text-align: center; margin-top: 30px; margin-bottom: 30px;">
                            <a href="#" style="background-color: #6366f1; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Accept Invitation</a>
                        </div>
                        <p>If you don't have an account yet, you'll be asked to create one after clicking the button.</p>
                        <p>Cheers,<br>The TaskFlow Team</p>
                    </div>
                    <div style="margin-top: 40px; text-align: center; border-top: 1px solid #eeeeee; padding-top: 20px; color: #888; font-size: 0.9em;">
                        &copy; 2026 TaskFlow Inc. All rights reserved.<br>
                        This invitation was sent by ${inviterName}.
                    </div>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error('Error sending invite email:', error);
    }
};
