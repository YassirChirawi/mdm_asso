import { NextRequest, NextResponse } from 'next/server';
import { sendDonationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prenom, nom, email, montant, dateDon } = body;

    if (!prenom || !nom || !email || !montant) {
      return NextResponse.json(
        { success: false, error: 'Champs manquants : prenom, nom, email, montant requis.' },
        { status: 400 }
      );
    }

    await sendDonationEmail({ prenom, nom, email, montant, dateDon });

    return NextResponse.json({ success: true, message: `Email envoyé à ${email}` });
  } catch (err: any) {
    console.error('[send-donation-email]', err);
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'envoi de l'email.", details: err.message },
      { status: 500 }
    );
  }
}
