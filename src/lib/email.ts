import nodemailer from 'nodemailer';
import { jsPDF } from 'jspdf';

interface DonationEmailPayload {
  prenom: string;
  nom: string;
  email: string;
  montant: number;
  dateDon?: string;
  stripeId?: string;
}

export function buildEmailHTML(data: DonationEmailPayload): string {
  const { prenom, nom, montant, dateDon } = data;
  const date = dateDon ?? new Date().toLocaleDateString('fr-FR');
  const annee = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <style>
    body { margin:0; padding:0; background:#f4f4f4; font-family:Helvetica, Arial, sans-serif; }
    .wrapper { max-width:620px; margin:40px auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 16px rgba(0,0,0,.08); }
    .header { background:#006233; padding:36px 40px 28px; text-align:center; }
    .header h1 { color:#fff; font-size:22px; margin:12px 0 4px; font-weight:bold; }
    .header p { color:rgba(255,255,255,.7); font-size:13px; margin:0; font-style:italic; }
    .body { padding:40px 44px; color:#2d2d2d; }
    .salutation { font-size:17px; color:#006233; font-weight:bold; margin-bottom:18px; }
    p { font-size:15px; line-height:1.8; margin:0 0 14px; color:#444; }
    .don-box { background:#f9f9f4; border-left:4px solid #C8102E; border-radius:4px; padding:16px 20px; margin:22px 0; }
    .don-box .label { font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#999; margin-bottom:4px; }
    .don-box .amount { font-size:30px; color:#C8102E; font-weight:bold; }
    .don-box .date { font-size:13px; color:#aaa; margin-top:4px; }
    .cta { text-align:center; margin:26px 0; }
    .cta a { background:#C8102E; color:#fff; text-decoration:none; padding:13px 32px; border-radius:4px; font-size:14px; display:inline-block; }
    .notice { background:#fffbe6; border:1px solid #ffe58f; border-radius:4px; padding:12px 16px; font-size:12px; color:#7a6700; margin-top:18px; line-height:1.6; }
    .signature { margin-top:30px; padding-top:22px; border-top:1px solid #eee; font-size:14px; color:#555; }
    .signature strong { color:#006233; display:block; margin-bottom:2px; font-size:15px; }
    .footer { background:#f0f0f0; padding:20px 40px; text-align:center; font-size:12px; color:#999; line-height:1.6; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>Marocains en France</h1>
    <p>Main dans la main — l'accompagnement par les étudiants, pour les étudiants</p>
  </div>
  <div class="body">
    <div class="salutation">Cher(e) ${prenom} ${nom},</div>
    <p>Au nom de toute l'équipe de <strong>Marocains en France</strong>, nous tenons à vous adresser nos plus sincères remerciements pour votre généreux don.</p>
    <div class="don-box">
      <div class="label">Votre contribution</div>
      <div class="amount">${montant} €</div>
      <div class="date">Reçu le ${date}</div>
    </div>
    <p>Votre soutien est essentiel pour nous permettre de continuer notre mission.</p>
    <div class="notice">📎 <strong>Reçu de don joint</strong> — Vous trouverez en pièce jointe votre reçu officiel.</div>
    <div class="signature">
      <strong>Le Bureau — Association Marocains en France</strong>
      📧 contact@marocainsenfrance.fr
    </div>
  </div>
</div>
</body>
</html>`;
}

export function generateReceiptPDF(data: DonationEmailPayload): Buffer {
  const doc = new jsPDF();
  const date = data.dateDon ?? new Date().toLocaleDateString('fr-FR');

  // Header
  doc.setTextColor(0, 98, 51); // #006233
  doc.setFontSize(22);
  doc.text('MAROCAINS EN FRANCE', 105, 30, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Association loi 1901', 105, 38, { align: 'center' });

  // Title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.text('REÇU DE DON', 105, 60, { align: 'center' });
  doc.line(80, 62, 130, 62);

  // Content
  doc.setFontSize(12);
  doc.text(`L'association Marocains en France certifie avoir reçu le ${date}`, 20, 80);
  doc.text('la somme de :', 20, 88);

  doc.setTextColor(200, 16, 46); // #C8102E
  doc.setFontSize(24);
  doc.text(`${data.montant} Euros`, 105, 105, { align: 'center' });

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text(`De la part de : ${data.prenom} ${data.nom}`, 20, 125);
  doc.text(`Email : ${data.email}`, 20, 133);
  if (data.stripeId) doc.text(`Référence : ${data.stripeId}`, 20, 141);

  doc.setFontSize(12);
  doc.text('Fait à Créteil, le ' + new Date().toLocaleDateString('fr-FR'), 20, 190);
  doc.text('Le Bureau', 150, 205);

  return Buffer.from(doc.output('arraybuffer'));
}

export function createTransporter() {
  const provider = process.env.EMAIL_PROVIDER ?? 'gmail';

  const configs: Record<string, any> = {
    gmail: {
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      tls: { rejectUnauthorized: false },
    },
    outlook: {
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      tls: { rejectUnauthorized: false },
    },
    ovh: {
      host: process.env.SMTP_HOST ?? 'ssl0.ovh.net',
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: true,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      tls: { rejectUnauthorized: false },
    },
    hostinger: {
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      tls: { rejectUnauthorized: false },
    },
  };

  return nodemailer.createTransport(configs[provider] ?? configs.gmail);
}

export async function sendDonationEmail(data: DonationEmailPayload) {
  const transporter = createTransporter();
  const pdfBuffer = generateReceiptPDF(data);

  return transporter.sendMail({
    from: `"Marocains en France" <${process.env.EMAIL_USER}>`,
    to: data.email,
    subject: `Merci pour votre don de ${data.montant} € – Marocains en France`,
    html: buildEmailHTML(data),
    attachments: [
      {
        filename: `Recu_Don_MDM_${data.prenom}_${data.nom}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
}
