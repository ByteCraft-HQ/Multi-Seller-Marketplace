




CREATE TABLE [USERS].[USER]
(
UserId BIGINT NOT NULL IDENTITY(1,1),
UserFirstName NVARCHAR(50) NOT NULL,
UserMiddelName NVARCHAR(50) NULL,
UserLastName NVARCHAR(50)  NULL,
UserAccountStatus VARCHAR(20)  NOT NULL,
UserDeletedAtReason VARCHAR(30)  ,
UserDeletedAtTextReason NVARCHAR(150),
UserDeletedAt DATETIME2,
UserHashPassword VARCHAR(255) NOT NULL,
UserEmail NVARCHAR(320) NOT NULL ,
UserEmailVerification BIT NOT NULL DEFAULT 0,
UserRecoveryEmail NVARCHAR(320) ,
UserRecoveryEmailVerification BIT DEFAULT 0,
UserBirthDate DATE NULL ,
UserGender VARCHAR(10) NULL ,
UserCreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),


CONSTRAINT UserId_USER_PK PRIMARY KEY(UserId) ,
CONSTRAINT UserEmail_USER_UQ UNIQUE(UserEmail),

CONSTRAINT UserFirstName_USER_CHECK CHECK 
(UserFirstName COLLATE Latin1_General_100_BIN2 = LOWER(TRIM(UserFirstName)) COLLATE Latin1_General_100_BIN2),

CONSTRAINT UserMeddelName_USER_CHECK CHECK 
(UserMiddelName COLLATE Latin1_General_100_BIN2 = LOWER(TRIM(UserMiddelName)) COLLATE Latin1_General_100_BIN2),

CONSTRAINT UserLastName_USER_CHECK CHECK 
(UserLastName COLLATE Latin1_General_100_BIN2 = LOWER(TRIM(UserLastName)) COLLATE Latin1_General_100_BIN2),

CONSTRAINT UserAccountStatus_USER_CHECK CHECK (
    UserAccountStatus COLLATE Latin1_General_100_BIN2 =
    UPPER(TRIM(UserAccountStatus)) COLLATE Latin1_General_100_BIN2
    AND
    UserAccountStatus COLLATE Latin1_General_100_BIN2 IN (
        'PENDING',
        'UNDERREVIEW',
        'ACTIVE',
        'LIMITED',
        'SUSPENDED',
        'DEACTIVATED',
        'DELETED',
        'BLOCKED'
    )),


CONSTRAINT UserDeletedAtReason_USER_CHECK CHECK (
    UserDeletedAtReason IS NULL
    OR (
        UserDeletedAtReason COLLATE Latin1_General_100_BIN2 =
        UPPER(TRIM(UserDeletedAtReason)) COLLATE Latin1_General_100_BIN2
        AND
        UserDeletedAtReason COLLATE Latin1_General_100_BIN2 IN (
            'NO_LONGER_USING_ACCOUNT',
            'FOUND_BETTER_ALTERNATIVE',
            'HIGH_PRICES',
            'DELIVERY_ISSUES',
            'PRODUCT_QUALITY_ISSUES',
            'POOR_CUSTOMER_SERVICE',
            'PRIVACY_CONCERNS',
            'HAS_ANOTHER_ACCOUNT',
            'OTHER'
        ))),


CONSTRAINT UserGender_USER_CHECK CHECK (
    UserGender IS NULL
    OR (
        UserGender COLLATE Latin1_General_100_BIN2 =
        UPPER(TRIM(UserGender)) COLLATE Latin1_General_100_BIN2
        AND
        UserGender COLLATE Latin1_General_100_BIN2 IN (
            'MALE',
            'FEMALE'
        ))),

CONSTRAINT UserCreatedAt_USER_CHECK CHECK(UserCreatedAt <= SYSDATETIME()),


CONSTRAINT UserRecoveryEmailAndUserRecoverEmailVerification_USER_CHECK CHECK 
    ((UserRecoveryEmail IS NULL AND UserRecoveryEmailVerification IS NULL)
    OR
    (UserRecoveryEmail IS NOT NULL AND UserRecoveryEmailVerification IS NOT NULL)),


CONSTRAINT UserRecoveryEmail_UserEmail_USER_CHECK CHECK(UserRecoveryEmail <> UserEmail)  
);






CREATE TABLE [USERS].[USERPHONENUMBERS]
(
UserId BIGINT NOT NULL ,
UserPhoneNumber NVARCHAR(25) NOT NULL,
UserPhoneNumberVerification BIT NOT NULL,
UserPhoneNumberStatus VARCHAR(20) NOT NULL,
UserPhoneNumberCreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
CONSTRAINT UserPhoneNumber_USERPHONENUMBER_PK PRIMARY KEY(UserPhoneNumber),


CONSTRAINT UserId_USERPHONENUMBER_FK FOREIGN KEY (UserId) REFERENCES [USERS].[USER](UserId)
ON UPDATE NO ACTION ON DELETE NO ACTION ,


CONSTRAINT UserPhoneNumber_USERPHONENUMBER_CHECK CHECK (
    LEN(UserPhoneNumber) > 1
    AND LEFT(UserPhoneNumber, 1) = '+'
),


CONSTRAINT UserphoneNumberStatus_USERPHONENUMBER_CHECK CHECK (
    UserPhoneNumberStatus COLLATE Latin1_General_100_BIN2
    IN (
        'PENDING',
        'UNDERREVIEW',
        'ACTIVE',
        'DEACTIVATED',
        'DELETED'
    )
),

CONSTRAINT UserPhoneNumberCreatedAt_USERPHONENUMBER_CHECK CHECK (UserPhoneNumberCreatedAt <=SYSDATETIME())

);