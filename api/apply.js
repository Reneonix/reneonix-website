import { Resend } from 'resend';

export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } },
};

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, phone, department, position, resume, docs } = req.body;

  if (!firstName || !lastName || !email || !position) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const attachments = [];
  if (resume) {
    attachments.push({ filename: resume.name, content: resume.content });
  }
  if (Array.isArray(docs)) {
    docs.forEach((doc) => attachments.push({ filename: doc.name, content: doc.content }));
  }

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#07080A;padding:24px 32px;border-radius:12px 12px 0 0;">
        <h2 style="color:#B2DE3A;margin:0;font-size:22px;">New Job Application</h2>
        <p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:14px;">Submitted via reneonix.com</p>
      </div>
      <div style="background:#f9f9f9;padding:28px 32px;border-radius:0 0 12px 12px;border:1px solid #e5e5e5;border-top:none;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:10px 0;font-weight:600;color:#444;width:160px;border-bottom:1px solid #eee;">Full Name</td>
            <td style="padding:10px 0;color:#111;border-bottom:1px solid #eee;">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;font-weight:600;color:#444;border-bottom:1px solid #eee;">Email</td>
            <td style="padding:10px 0;color:#111;border-bottom:1px solid #eee;">${email}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;font-weight:600;color:#444;border-bottom:1px solid #eee;">Phone</td>
            <td style="padding:10px 0;color:#111;border-bottom:1px solid #eee;">${phone || '—'}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;font-weight:600;color:#444;border-bottom:1px solid #eee;">Department</td>
            <td style="padding:10px 0;color:#111;border-bottom:1px solid #eee;">${department || '—'}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;font-weight:600;color:#444;">Applied Position</td>
            <td style="padding:10px 0;color:#111;">${position}</td>
          </tr>
        </table>
        ${attachments.length > 0 ? `
        <div style="margin-top:20px;padding:14px 18px;background:#fff;border:1px solid #e5e5e5;border-radius:8px;">
          <p style="margin:0 0 8px;font-weight:600;color:#444;font-size:13px;">Attachments (${attachments.length})</p>
          ${attachments.map((a) => `<p style="margin:4px 0;font-size:13px;color:#555;">📎 ${a.filename}</p>`).join('')}
        </div>` : ''}
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'Reneonix Careers <careers@reneonix.com>',
      to: 'careers@reneonix.com',
      replyTo: email,
      subject: `Job Application | ${firstName} ${lastName} | Reneonix`,
      html,
      attachments,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send application. Please try again.' });
  }
}
