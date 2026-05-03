const { app } = require('@azure/functions');
const { EmailClient } = require("@azure/communication-email");
const crypto = require('crypto');

// Ensure global.crypto is available for Azure SDKs
if (typeof global.crypto === 'undefined') {
    global.crypto = {
        randomUUID: () => crypto.randomUUID()
    };
}

app.http('SendContactEmail', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Processing contact form submission...`);

        try {
            const body = await request.json();
            const { name, email, phone, message } = body;

            context.log(`Form data received: ${JSON.stringify({ name, email, phone })}`);

            const connectionString = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING;
            const senderAddress = process.env.SENDER_EMAIL_ADDRESS;

            if (!connectionString || !senderAddress) {
                const missing = [];
                if (!connectionString) missing.push("CONNECTION_STRING");
                if (!senderAddress) missing.push("SENDER_ADDRESS");
                context.error(`Missing configuration: ${missing.join(", ")}`);
                return { status: 500, jsonBody: { success: false, message: `Server configuration error: Missing ${missing.join(", ")}` } };
            }
            
            const emailClient = new EmailClient(connectionString);

            const emailMessage = {
                senderAddress: senderAddress,
                content: {
                    subject: `New Lead: ${name} (AEIS Website)`,
                    plainText: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                            <h2 style="color: #0056B3;">New Website Inquiry</h2>
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Phone:</strong> ${phone}</p>
                            <hr>
                            <p><strong>Message:</strong></p>
                            <p>${message ? message.replace(/\n/g, '<br>') : 'No message provided.'}</p>
                        </div>
                    `
                },
                recipients: {
                    to: [{ address: "aeis_india@yahoo.co.in" }]
                }
            };

            context.log(`Sending email from ${senderAddress} to aeis_india@yahoo.co.in...`);
            const poller = await emailClient.beginSend(emailMessage);
            const result = await poller.pollUntilDone();

            if (result.status === "Succeeded") {
                context.log(`Email sent successfully! ID: ${result.id}`);
                return { status: 200, jsonBody: { success: true, message: "Email sent successfully" } };
            } else {
                context.error(`Email sending failed with status: ${result.status}`);
                return { status: 500, jsonBody: { success: false, message: `Failed to send email. Status: ${result.status}` } };
            }
            
        } catch (error) {
            context.error(`Exception caught: ${error.message}`);
            return { status: 500, jsonBody: { success: false, message: error.message, detail: error.stack } };
        }
    }
});
