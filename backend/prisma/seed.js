const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Database Seeding...');

  // 1. إضافة فئات الأدوار الأساسية
  const categories = [
    { roleCategoryName: 'System Visitor', roleCategoryManager: 'Admin System' },
    { roleCategoryName: 'System Employee', roleCategoryManager: 'Admin System' },
    { roleCategoryName: 'Seller Operations', roleCategoryManager: 'Seller Onboarding Team' }
  ];

  for (const cat of categories) {
    await prisma.rOLE_CATEGORIES.upsert({
      where: { RoleCategoryName: cat.roleCategoryName },
      update: {},
      create: {
        RoleCategoryName: cat.roleCategoryName,
        RoleCategoryManager: cat.roleCategoryManager
      },
    });
  }
  console.log(' Role Categories seeded.');

  // 2. إضافة الأدوار الأساسية التابعة للفئات
  const roles = [
    { roleName: 'CUSTOMER', roleCategoryName: 'System Visitor' },
    { roleName: 'SELLER', roleCategoryName: 'Seller Operations' },
    { roleName: 'STORE_MANAGER', roleCategoryName: 'Seller Operations' },
    { roleName: 'SYSTEM_ADMIN', roleCategoryName: 'System Employee' }
  ];

  for (const role of roles) {
    await prisma.rOLES.upsert({
      where: { RoleName: role.roleName },
      update: {},
      create: {
        RoleName: role.roleName,
        RoleCategoryName: role.roleCategoryName
      },
    });
  }
  console.log(' Core Roles seeded.');

  console.log(' Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(' Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
