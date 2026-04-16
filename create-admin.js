/**
 * Script pour créer le compte admin
 * Utilisation : node create-admin.js
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// ⚙️ Modifiez ces valeurs avant d'exécuter le script
const ADMIN_EMAIL = "admin@mdm-asso.fr";
const ADMIN_PASSWORD = "password123"; // ← Changez ce mot de passe !
const ADMIN_NAME = "Admin MDM";

async function main() {
  console.log("🔐 Création du compte admin...");

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  // Créer ou mettre à jour l'admin
  const user = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      password: hashedPassword,
      name: ADMIN_NAME,
    },
    create: {
      email: ADMIN_EMAIL,
      password: hashedPassword,
      name: ADMIN_NAME,
    },
  });

  console.log("✅ Compte admin créé/mis à jour :");
  console.log(`   Email    : ${user.email}`);
  console.log(`   Nom      : ${user.name}`);
  console.log(`   ID       : ${user.id}`);
  console.log("\n🚀 Connectez-vous sur /admin/login avec ces identifiants.");
}

main()
  .catch((e) => {
    console.error("❌ Erreur :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
