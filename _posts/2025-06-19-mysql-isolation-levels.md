---
layout: post
title: "MYSQL Isolation Levels"
permalink: "mysql-isolation-levels.html"
desc: "MySQL isolation levels control how transactions interact with each other, particularly when accessing the same data concurrently. They determine the degree of isolation between transactions, influencing which inconsistencies (like dirty reads or phantom reads) may occur. These levels dictate how locks are acquired and released, affecting both data consistency and performance."
category: "sql"

---

# Intro

MySQL isolation levels control how transactions interact with each other, particularly when accessing the same data concurrently. They determine the degree of isolation between transactions, influencing which inconsistencies (like dirty reads or phantom reads) may occur. These levels dictate how locks are acquired and released, affecting both data consistency and performance.

## 1. READ UNCOMMITTED

- **Description**: The least isolated level. Transactions can read data modified by other uncommitted transactions ("dirty reads"). 
- **Locking**: Minimal locking. No locks are generally acquired or released. 
- **Inconsistencies**: Prone to dirty reads, non-repeatable reads, and phantom reads. 
- **Performance**: Fastest due to minimal locking overhead.

## 2. READ COMMITTED:

- **Description**:
Transactions can only read data that has been committed by other transactions.
- **Locking**:
Shared locks are acquired for read operations, exclusive locks for write operations. Locks are released after the statement completes.
- **Inconsistencies**:
Prevents dirty reads. May still encounter non-repeatable reads and phantom reads.
- **Performance**:
Moderate.

## 3. REPEATABLE READ:

- **Description**:
Transactions can only read data that was committed at the start of the transaction.
- **Locking**:
Shared locks are acquired for read operations, exclusive locks for write operations. Locks are held until the end of the transaction.
- **Inconsistencies**:
Prevents dirty reads and non-repeatable reads. May still encounter phantom reads.
- **Performance**:
Better than serializable, but potentially slower than READ COMMITTED. 

## 4. SERIALIZABLE:

- **Description**: The highest isolation level. Transactions appear to execute one at a time, preventing all anomalies.
- **Locking**: Uses range locks (intention locks) to prevent phantom reads.
- **Inconsistencies**: Prevents dirty reads, non-repeatable reads, and phantom reads.
- **Performance**: Slowest due to strict locking. 

### Setting Isolation Levels:

**Globally**:
Affects all new sessions. Use the `--transaction-isolation` option when starting the MySQL server or
```SQL
SET GLOBAL transaction_isolation = 'level';
```

**Per Session**:
Affects only the current session. Use
```SQL
SET SESSION transaction_isolation = 'level';
```

**Next Transaction**:
Affects only the next transaction. Use
```SQL
SET TRANSACTION ISOLATION LEVEL level;
```

**Example:**

```SQL
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
-- or
SET GLOBAL TRANSACTION ISOLATION LEVEL REPEATABLE READ;

START TRANSACTION;
SELECT * FROM products WHERE id = 1;
-- ...
COMMIT;
```

## Choosing the Right Level:
The best isolation level depends on the specific needs of the application. Consider the trade-offs between consistency and performance. 
-  **SERIALIZABLE** or **REPEATABLE READ**: might be appropriate for applications requiring high consistency.
- **READ COMMITTED** or even **READ UNCOMMITTED**: might be suitable for applications where performance is paramount. 
