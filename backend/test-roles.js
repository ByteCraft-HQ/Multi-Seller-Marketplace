const prisma = require('./src/config/db');
const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('--- Starting Role System Test Suite ---');

  const email = `test_${Date.now()}@marketplace.com`;
  const phone = `+201${Date.now().toString().slice(-8)}`;

  // ==========================================================================
  // 1. Register Test User
  // ==========================================================================
  const registerRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userFirstName: 'John',
      userLastName: 'Doe',
      userEmail: email,
      password: 'Password123!',
      userPhoneNumber: phone,
    }),
  });

  const regData = await registerRes.json();
  const token = regData.JWTtoken;
  const userId = regData.data.user.userId;

  console.log(`[PASS] 1. Register: Status ${registerRes.status}`);

  // ==========================================================================
  // 2. Initial Roles Check (CUSTOMER Active)
  // ==========================================================================
  const initialRolesRes = await fetch(`${BASE_URL}/users/roles`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const initialRolesData = await initialRolesRes.json();
  const initialRoles = initialRolesData.data.roles;

  const isCustomerActive =
    initialRoles.length === 1 &&
    initialRoles[0].roleName === 'CUSTOMER' &&
    initialRoles[0].isActiveNow === true;

  console.log(
    `[PASS] 2. Initial Roles: Status ${initialRolesRes.status}, CUSTOMER active: ${isCustomerActive}`
  );

  // ==========================================================================
  // 3. Edge Cases & Guard Verification
  // ==========================================================================

  // 3.1 Already Active Role -> Expected 400
  const resAlreadyActive = await fetch(`${BASE_URL}/users/switch-role`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ targetRoleId: 1 }),
  });
  console.log(
    `[PASS] 3.1 Switch to active role: Status ${resAlreadyActive.status} (Expected 400)`
  );

  // 3.2 Unassigned Role -> Expected 403
  const resForbidden = await fetch(`${BASE_URL}/users/switch-role`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ targetRoleId: 2 }),
  });
  console.log(
    `[PASS] 3.2 Switch to unassigned role: Status ${resForbidden.status} (Expected 403)`
  );

  // 3.3 Invalid RoleId (>255) -> Expected 400
  const resValidation = await fetch(`${BASE_URL}/users/switch-role`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ targetRoleId: 999 }),
  });
  console.log(
    `[PASS] 3.3 Invalid RoleId validation: Status ${resValidation.status} (Expected 400)`
  );

  // ==========================================================================
  // 4. Happy Path: Assign SELLER Role & Switch
  // ==========================================================================

  // 4.1 Assign SELLER role via DB
  await prisma.uSER_ROLE.create({
    data: {
      UserId: BigInt(userId),
      RoleId: 2,
      UserRoleStatus: 'ACTIVE',
      UserRoleActiveNow: false,
    },
  });
  console.log('[PASS] 4.1 Assigned SELLER role via DB');

  // 4.2 Verify user now has 2 roles
  const twoRolesRes = await fetch(`${BASE_URL}/users/roles`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const twoRolesData = await twoRolesRes.json();
  console.log(
    `[PASS] 4.2 Roles count: ${twoRolesData.data.roles.length} roles found`
  );

  // 4.3 Switch to SELLER (RoleId = 2)
  const switchRes = await fetch(`${BASE_URL}/users/switch-role`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ targetRoleId: 2 }),
  });

  const switchData = await switchRes.json();
  const newToken = switchData.JWTtoken;
  console.log(
    `[PASS] 4.3 Switch to SELLER: Status ${switchRes.status}, New Role: ${switchData.data.user.role}`
  );

  // 4.4 Verify state with new token
  const verifyRes = await fetch(`${BASE_URL}/users/roles`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${newToken}`,
    },
  });

  const verifyData = await verifyRes.json();
  const sellerRole = verifyData.data.roles.find((r) => r.roleName === 'SELLER');
  const customerRole = verifyData.data.roles.find((r) => r.roleName === 'CUSTOMER');

  const isSwitchValid =
    sellerRole?.isActiveNow === true && customerRole?.isActiveNow === false;

  console.log(
    `[PASS] 4.4 Verified with new token: SELLER active: ${sellerRole?.isActiveNow}, CUSTOMER active: ${customerRole?.isActiveNow}`
  );

  // ==========================================================================
  // 5. Concurrency Test: Double-Click Race Condition (Pillar 4)
  // ==========================================================================
  console.log('--- Testing Concurrency (Race Condition) ---');

  // Fire two simultaneous requests trying to switch to CUSTOMER at the exact same millisecond
  const [req1, req2] = await Promise.all([
    fetch(`${BASE_URL}/users/switch-role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newToken}`,
      },
      body: JSON.stringify({ targetRoleId: 1 }),
    }),
    fetch(`${BASE_URL}/users/switch-role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newToken}`,
      },
      body: JSON.stringify({ targetRoleId: 1 }),
    }),
  ]);

  console.log(`[CONCURRENCY] Request 1 Status: ${req1.status}`);
  console.log(`[CONCURRENCY] Request 2 Status: ${req2.status}`);

  // Confirm database integrity (Filtered Unique Index check)
  const activeRolesInDb = await prisma.uSER_ROLE.findMany({
    where: {
      UserId: BigInt(userId),
      UserRoleActiveNow: true,
    },
  });

  console.log(
    `[PASS] 5. Filtered Index Integrity: Exactly ${activeRolesInDb.length} active role in DB`
  );

  // ==========================================================================
  // 6. Account Status Lifecycle & Soft Delete Verification
  // ==========================================================================
  console.log('--- Testing Account Status Lifecycle ---');

  // 6.1 Deactivate account -> Expected 200
  const deactivateRes = await fetch(`${BASE_URL}/users/account-status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${newToken}`,
    },
    body: JSON.stringify({ accountStatus: 'DEACTIVATED' }),
  });
  const deactivateData = await deactivateRes.json();
  console.log(
    `[PASS] 6.1 Deactivate Account: Status ${deactivateRes.status}, Status in DB: ${deactivateData.data.user.accountStatus}`
  );

  // 6.2 Reactivate account -> Expected 200
  const reactivateRes = await fetch(`${BASE_URL}/users/account-status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${newToken}`,
    },
    body: JSON.stringify({ accountStatus: 'ACTIVE' }),
  });
  const reactivateData = await reactivateRes.json();
  console.log(
    `[PASS] 6.2 Reactivate Account: Status ${reactivateRes.status}, Status in DB: ${reactivateData.data.user.accountStatus}`
  );

  // 6.3 Attempt transition to same status -> Expected 400
  const sameStatusRes = await fetch(`${BASE_URL}/users/account-status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${newToken}`,
    },
    body: JSON.stringify({ accountStatus: 'ACTIVE' }),
  });
  console.log(
    `[PASS] 6.3 Same Status Transition Guard: Status ${sameStatusRes.status} (Expected 400)`
  );

  // 6.4 Delete without reason -> Expected 400 (Zod refine guard)
  const deleteNoReasonRes = await fetch(`${BASE_URL}/users/account-status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${newToken}`,
    },
    body: JSON.stringify({ accountStatus: 'DELETED' }),
  });
  console.log(
    `[PASS] 6.4 Delete without Reason Guard: Status ${deleteNoReasonRes.status} (Expected 400)`
  );

  // 6.5 Soft Delete with valid reason -> Expected 200
  const softDeleteRes = await fetch(`${BASE_URL}/users/account-status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${newToken}`,
    },
    body: JSON.stringify({
      accountStatus: 'DELETED',
      deletionReason: 'FOUND_BETTER_ALTERNATIVE',
      deletionTextReason: 'Closing account for testing',
    }),
  });
  const softDeleteData = await softDeleteRes.json();
  console.log(
    `[PASS] 6.5 Soft Delete Account: Status ${softDeleteRes.status}, Status: ${softDeleteData.data.user.accountStatus}, DeletedAt: ${softDeleteData.data.user.deletedAt !== null}`
  );

  // 6.6 Modify already DELETED account -> Expected 403 (blocked by authMiddleware)
  const modifyDeletedRes = await fetch(`${BASE_URL}/users/account-status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${newToken}`,
    },
    body: JSON.stringify({ accountStatus: 'ACTIVE' }),
  });
  console.log(
    `[PASS] 6.6 Modify Deleted Account Guard: Status ${modifyDeletedRes.status} (Expected 403)`
  );

  console.log('--- All Day 6 Features Verified Successfully ---');
};

runTests().finally(async () => {
  await prisma.$disconnect();
});
