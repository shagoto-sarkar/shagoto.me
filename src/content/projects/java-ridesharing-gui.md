---
title: "DIU Everywhere"
constraint: "Designing an asynchronous, multi-threaded campus ride-sharing desktop application in Java Swing demonstrating atomic seat allocation and transaction safety over a relational SQL database without UI freezing."
techStack: ["Java", "Swing", "JDBC", "SQL"]
date: 2024-11-15
collaborators: []
demoVideoAvailable: false
repoUrl: "https://github.com/shagoto-sarkar/diu-everywhere"
---

## The Constraint

Desktop GUI engineering in Java Swing requires strict discipline: the **Event Dispatch Thread (EDT)** must never be blocked by blocking network calls, heavy compute, or disk I/O. Doing so leads to non-responsive interfaces and corrupted UI states.

As an academic software engineering project at Daffodil International University, **DIU Everywhere** explored desktop GUI architecture and transactional data integrity: concurrent student commuters reserving vehicle seats simultaneously require ACID compliance and atomic row locking.

---

## The Execution

**DIU Everywhere** implements an architectural boundary decoupling UI view controllers from database persistence workers:
* **Concurrency Model:** All SQL read/write routines run off-EDT using `javax.swing.SwingWorker` and background executors.
* **Transaction Isolation:** Seat reservation requests execute inside serializable SQL transactions with `SELECT ... FOR UPDATE` semantics.
* **Component Modularity:** Strict Model-View-Controller (MVC) organization with custom paint components.

### Asynchronous Concurrency Routine

```java
public class BookingWorker extends SwingWorker<Boolean, String> {
    private final int tripId;
    private final int commuterId;
    private final Connection connection;

    public BookingWorker(Connection conn, int tripId, int commuterId) {
        this.connection = conn;
        this.tripId = tripId;
        this.commuterId = commuterId;
    }

    @Override
    protected Boolean doInBackground() throws Exception {
        connection.setAutoCommit(false);
        try (PreparedStatement checkStmt = connection.prepareStatement(
                "SELECT available_seats FROM trips WHERE trip_id = ? FOR UPDATE")) {
            checkStmt.setInt(1, tripId);
            ResultSet rs = checkStmt.executeQuery();
            if (rs.next() && rs.getInt("available_seats") > 0) {
                // Atomic seat decrement
                try (PreparedStatement bookStmt = connection.prepareStatement(
                        "UPDATE trips SET available_seats = available_seats - 1 WHERE trip_id = ?")) {
                    bookStmt.setInt(1, tripId);
                    bookStmt.executeUpdate();
                }
                connection.commit();
                return true;
            }
            connection.rollback();
            return false;
        } catch (SQLException e) {
            connection.rollback();
            throw e;
        }
    }
}
```

### Transaction Diagnostics Log

*Illustrative transaction log demonstrating concurrent booking and lock acquisition handling:*

```text
[DB-POOL] Connection pool initialized: 8 active JDBC connections.
[EDT] Main frame rendered in 42ms. Zero thread lockup detected.
[TRANSACTION #1042] Booking request for Trip #89 (User #4029) -> LOCK ACQUIRED.
[TRANSACTION #1042] Seats available: 1 -> Decrementing to 0. COMMIT SUCCESS.
[TRANSACTION #1043] Concurrent Booking request for Trip #89 (User #7112) -> REJECTED (Seat count exhausted).
```

---

## Takeaways

Modern web apps often obscure foundational concurrency principles. Constructing DIU Everywhere in Java Swing solidified direct expertise in thread synchronization, mutex handling, and transactional database integrity.
