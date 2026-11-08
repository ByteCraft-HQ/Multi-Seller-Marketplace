

CREATE TABLE [ROLE].[ROLECATEGORY]
(
RoleCategoryName VARCHAR(50) NOT NULL ,
RoleCategoryStatus VARCHAR(20) NOT NULL DEFAULT 'PENDING',
RoleCategoryCreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
RoleCategoryManager NVARCHAR(50)NOT NULL ,

CONSTRAINT RoleCategoryName_ROLECATEGORY_PK PRIMARY KEY(RoleCategoryName),

CONSTRAINT RoleCategoryName_ROLECATEGORY_CHECK CHECK (
    LEN(RoleCategoryName) > 0
    AND RoleCategoryName COLLATE Latin1_General_100_BIN2
        LIKE '%[A-Z0-9]%'
),

CONSTRAINT RoleCategroyManagerName_ROLECATEGORY_UQ UNIQUE(RoleCategoryManager),

CONSTRAINT RoleCategoryStatus_ROLECATEGORY_CHECK CHECK (
    RoleCategoryStatus COLLATE Latin1_General_100_BIN2
    IN (
        'PENDING',
        'UNDERREVIEW',
        'ACTIVE',
        'DEACTIVATED',
        'DELETED'
    )
),


CONSTRAINT RoleCategoryCreatedAt_ROLECATEGORY_CHECK CHECK (RoleCategoryCreatedAt <= SYSDATETIME()),


CONSTRAINT RoleCategoryManager CHECK (
    RoleCategoryManager =
    TRIM(LOWER(RoleCategoryManager)) COLLATE Latin1_General_100_BIN2
)


);