export async function onRequestPost(context) {
    const db = context.env.DB;
    if (!db) {
        return new Response(JSON.stringify({ error: "D1 DB binding not found. Please bind 'DB' to D1 in Cloudflare settings." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        await db.exec(`
            CREATE TABLE IF NOT EXISTS employee_profiles (
                name TEXT PRIMARY KEY,
                team TEXT,
                base_salary REAL,
                is_probation INTEGER,
                is_midmonth INTEGER,
                extra_days INTEGER,
                passcode TEXT,
                hire_date TEXT
            );
        `);

        await db.exec(`
            CREATE TABLE IF NOT EXISTS employee_records (
                record_id TEXT PRIMARY KEY,
                employee_name TEXT,
                month TEXT,
                base_salary REAL,
                night_shift_off_date TEXT,
                night_shift_transition_date TEXT,
                night_shift_allowance_rate REAL,
                diligent REAL,
                night_shift REAL,
                probation_deduct REAL,
                unpaid_deduct REAL,
                attendance_deduct REAL,
                extra_work_pay REAL,
                net_salary REAL,
                admin_checked INTEGER,
                dispute_status TEXT,
                admin_comment TEXT,
                logs_json TEXT,
                holidays_json TEXT,
                rules_before_json TEXT,
                rules_after_json TEXT,
                updated_at TEXT
            );
        `);

        return new Response(JSON.stringify({ success: true, message: "Database tables created successfully." }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export async function onRequestGet(context) {
    const db = context.env.DB;
    if (!db) {
        return new Response(JSON.stringify({ active: false, message: "D1 DB binding not found." }), {
            headers: { "Content-Type": "application/json" }
        });
    }
    try {
        await db.prepare("SELECT 1").first();
        return new Response(JSON.stringify({ active: true, message: "Database connected and ready." }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch(err) {
        return new Response(JSON.stringify({ active: false, message: "DB bound but error: " + err.message }), {
            headers: { "Content-Type": "application/json" }
        });
    }
}
