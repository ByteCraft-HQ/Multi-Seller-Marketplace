const prisma = require('./src/config/db');
const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('--- Starting Business Profile & Seller Onboarding Test Suite ---');

  const email = `seller_${Date.now()}@marketplace.com`;
  const phone = `+201${Date.now().toString().slice(-8)}`;

  // ==========================================================================
  // 1. Register Fresh Customer
  // ==========================================================================
  const registerRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userFirstName: 'Ahmed',
      userLastName: 'Trader',
      userEmail: email,
      password: 'Password123!',
      userPhoneNumber: phone,
    }),
  });

  const regData = await registerRes.json();
  const token = regData.JWTtoken;
  const userId = regData.data.user.userId;

  if (registerRes.status === 201 && token) {
    console.log(`[PASS] 1. Register Customer: Status 201`);
  } else {
    console.error(`[FAIL] 1. Register Customer: Status ${registerRes.status}`);
    process.exit(1);
  }

  // ==========================================================================
  // 2. GET Business Profile Before Creation (Should Return 404)
  // ==========================================================================
  const getBeforeRes = await fetch(`${BASE_URL}/users/business-profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (getBeforeRes.status === 404) {
    console.log(`[PASS] 2. GET Profile Before Creation: Status 404`);
  } else {
    console.error(`[FAIL] 2. GET Profile Before Creation: Status ${getBeforeRes.status}`);
    process.exit(1);
  }

  // ==========================================================================
  // 3. POST /business-profile (Seller Onboarding - Happy Path)
  // ==========================================================================
  const uniqueRegNum = `CR-${Date.now().toString().slice(-8)}`;
  const uniqueNatId = `NID-${Date.now().toString().slice(-8)}`;
  const bizEmail = `biz_${Date.now()}@company.com`;
  const bizPhone = `+2019${Date.now().toString().slice(-7)}`;

  const createRes = await fetch(`${BASE_URL}/users/business-profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      BusinessInformationBusinessType: 'COMPANY',
      BusinessInformationBusinessCountry: 'Egypt',
      CompanyRegistrationNumber: uniqueRegNum,
      BusinessInformationNationalId: uniqueNatId,
      BusinessInformationBirthCertificateImage: 'https://cdn.marketplace.com/docs/birth.png',
      BusinessInformationNationalIdCardImage: 'https://cdn.marketplace.com/docs/nid.png',
      BusinessInformationBusinessRegister: 'https://cdn.marketplace.com/docs/cr.pdf',
      BusinessInformationBusinessLegalName: 'Alpha Trading & Logistics LLC',
      BusinessInformationBusinessPostalCode: '11511',
      BusinessInformationEmail: [bizEmail],
      BusinessInformationPhoneNumber: [bizPhone],
    }),
  });

  const createData = await createRes.json();

  if (
    createRes.status === 201 &&
    createData.data?.businessProfile?.BusinessInformationLegalName !== null
  ) {
    console.log(`[PASS] 3.1 POST Business Profile (Onboarding): Status 201`);
  } else {
    console.error(`[FAIL] 3.1 POST Business Profile: Status ${createRes.status}`, createData);
    process.exit(1);
  }

  // Verify in Database: SELLER role was provisioned with UNDERREVIEW and ActiveNow=false
  const sellerRoleInDb = await prisma.uSER_ROLE.findFirst({
    where: {
      UserId: BigInt(userId),
      ROLES: { RoleName: 'SELLER' },
    },
  });

  if (
    sellerRoleInDb &&
    sellerRoleInDb.UserRoleStatus === 'UNDERREVIEW' &&
    sellerRoleInDb.UserRoleActiveNow === false
  ) {
    console.log(`[PASS] 3.2 Database Verification: SELLER role created as UNDERREVIEW, ActiveNow=false`);
  } else {
    console.error(`[FAIL] 3.2 Database Verification for SELLER role:`, sellerRoleInDb);
    process.exit(1);
  }

  // ==========================================================================
  // 4. Duplicate Guard: Attempt to Create Another Business Profile (Should Return 409)
  // ==========================================================================
  const duplicateRes = await fetch(`${BASE_URL}/users/business-profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      BusinessInformationBusinessType: 'INDIVIDUAL',
      BusinessInformationBusinessCountry: 'Egypt',
      CompanyRegistrationNumber: `CR-DUP-${Date.now()}`,
      BusinessInformationNationalId: `NID-DUP-${Date.now()}`,
      BusinessInformationBirthCertificateImage: 'https://cdn.marketplace.com/docs/birth.png',
      BusinessInformationNationalIdCardImage: 'https://cdn.marketplace.com/docs/nid.png',
      BusinessInformationBusinessRegister: 'https://cdn.marketplace.com/docs/cr.pdf',
      BusinessInformationBusinessLegalName: 'Duplicate Store LLC',
      BusinessInformationBusinessPostalCode: '12345',
      BusinessInformationEmail: [`dup_${Date.now()}@company.com`],
      BusinessInformationPhoneNumber: [`+2018${Date.now().toString().slice(-7)}`],
    }),
  });

  if (duplicateRes.status === 409) {
    console.log(`[PASS] 4. Duplicate Profile Guard: Status 409 Conflict`);
  } else {
    console.error(`[FAIL] 4. Duplicate Profile Guard: Status ${duplicateRes.status}`);
    process.exit(1);
  }

  // ==========================================================================
  // 5. GET /business-profile (Fetch After Creation)
  // ==========================================================================
  const getAfterRes = await fetch(`${BASE_URL}/users/business-profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const getAfterData = await getAfterRes.json();
  const profile = getAfterData.data?.getBusinessProfileInfo || getAfterData.data?.businessProfile;

  if (
    getAfterRes.status === 200 &&
    profile &&
    profile.BUSINESS_INFORMATION_EMAIL?.length > 0 &&
    profile.BUSINESS_INFORMATION_PHONENUMBER?.length > 0
  ) {
    console.log(`[PASS] 5. GET Business Profile: Status 200, Emails & Phones Populated`);
  } else {
    console.error(`[FAIL] 5. GET Business Profile: Status ${getAfterRes.status}`, getAfterData);
    process.exit(1);
  }

  // ==========================================================================
  // 6. PATCH /business-profile - Empty Body Guard (Should Return 400)
  // ==========================================================================
  const patchEmptyRes = await fetch(`${BASE_URL}/users/business-profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });

  if (patchEmptyRes.status === 400) {
    console.log(`[PASS] 6.1 PATCH Empty Body Guard: Status 400`);
  } else {
    console.error(`[FAIL] 6.1 PATCH Empty Body Guard: Status ${patchEmptyRes.status}`);
    process.exit(1);
  }

  // ==========================================================================
  // 7. PATCH /business-profile - Happy Path (Partial Update)
  // ==========================================================================
  const updatedLegalName = 'Beta Global Trading Corp';
  const updatedPostalCode = '99999';

  const patchRes = await fetch(`${BASE_URL}/users/business-profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      BusinessInformationBusinessLegalName: updatedLegalName,
      BusinessInformationBusinessPostalCode: updatedPostalCode,
    }),
  });

  const patchData = await patchRes.json();

  if (
    patchRes.status === 200 &&
    patchData.data?.businessProfile?.BusinessInformationBusinessLegalName === updatedLegalName &&
    patchData.data?.businessProfile?.BusinessInformationBusinessPostalCode === updatedPostalCode
  ) {
    console.log(`[PASS] 7.1 PATCH Business Profile: Status 200, Values Updated`);
  } else {
    console.error(`[FAIL] 7.1 PATCH Business Profile: Status ${patchRes.status}`, patchData);
    process.exit(1);
  }

  // Verify in Database: UserRoleStatus remained or reset to UNDERREVIEW
  const roleAfterPatch = await prisma.uSER_ROLE.findFirst({
    where: {
      UserId: BigInt(userId),
      ROLES: { RoleName: 'SELLER' },
    },
  });

  if (roleAfterPatch && roleAfterPatch.UserRoleStatus === 'UNDERREVIEW') {
    console.log(`[PASS] 7.2 Security Verification: Role Status is UNDERREVIEW after update`);
  } else {
    console.error(`[FAIL] 7.2 Security Verification:`, roleAfterPatch);
    process.exit(1);
  }

  console.log('--- ALL DAY 7 BUSINESS PROFILE TESTS PASSED 100% ---');
  await prisma.$disconnect();
  process.exit(0);
};

runTests().catch(async (e) => {
  console.error('Unhandled test failure:', e);
  await prisma.$disconnect();
  process.exit(1);
});
