export async function onRequestGet(context) {
    const db = context.env.DB;
    if (!db) {
        return new Response(JSON.stringify({ error: "DB binding not found." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const { results } = await db.prepare("SELECT * FROM employee_records ORDER BY record_id ASC").all();
        const records = results.map(r => {
            let logs = [];
            let holidays = [];
            let rulesBefore = {};
            let rulesAfter = {};

            try { logs = JSON.parse(r.logs_json || "[]"); } catch(e) {}
            try { holidays = JSON.parse(r.holidays_json || "[]"); } catch(e) {}
            try { rulesBefore = JSON.parse(r.rules_before_json || "{}"); } catch(e) {}
            try { rulesAfter = JSON.parse(r.rules_after_json || "{}"); } catch(e) {}

            return {
                id: r.record_id,
                name: r.employee_name,
                month: r.month,
                baseSalary: r.base_salary,
                nightShiftOffDate: r.night_shift_off_date,
                nightShiftTransitionDate: r.night_shift_transition_date,
                nightShiftAllowanceRate: r.night_shift_allowance_rate,
                diligent: r.diligent,
                nightShift: r.night_shift,
                probationDeduct: r.probation_deduct,
                unpaidDeduct: r.unpaid_deduct,
                attendanceDeduct: r.attendance_deduct,
                extraWorkPay: r.extra_work_pay,
                netSalary: r.net_salary,
                adminChecked: r.admin_checked === 1,
                disputeStatus: r.dispute_status || 'none',
                adminComment: r.admin_comment || '',
                logs,
                holidays,
                rulesBefore,
                rulesAfter
            };
        });

        return new Response(JSON.stringify(records), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export async function onRequestPost(context) {
    const db = context.env.DB;
    const request = context.request;
    if (!db) {
        return new Response(JSON.stringify({ error: "DB binding not found." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const body = await request.json();
        const recordId = body.id || `${body.name.toLowerCase()}-${body.month}`;
        
        const logsJson = JSON.stringify(body.logs || []);
        const holidaysJson = JSON.stringify(body.holidays || []);
        const rulesBeforeJson = JSON.stringify(body.rulesBefore || {});
        const rulesAfterJson = JSON.stringify(body.rulesAfter || {});
        const adminChecked = body.adminChecked ? 1 : 0;
        const updatedAt = new Date().toISOString();

        await db.prepare(`
            INSERT OR REPLACE INTO employee_records (
                record_id, employee_name, month, base_salary,
                night_shift_off_date, night_shift_transition_date, night_shift_allowance_rate,
                diligent, night_shift, probation_deduct, unpaid_deduct,
                attendance_deduct, extra_work_pay, net_salary, admin_checked,
                dispute_status, admin_comment, logs_json, holidays_json,
                rules_before_json, rules_after_json, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            recordId, body.name, body.month, body.baseSalary,
            body.nightShiftOffDate, body.nightShiftTransitionDate, body.nightShiftAllowanceRate,
            body.diligent, body.nightShift, body.probationDeduct, body.unpaidDeduct,
            body.attendanceDeduct, body.extraWorkPay, body.netSalary, adminChecked,
            body.disputeStatus || 'none', body.adminComment || '', logsJson, holidaysJson,
            rulesBeforeJson, rulesAfterJson, updatedAt
        ).run();

        return new Response(JSON.stringify({ success: true, recordId }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export async function onRequestDelete(context) {
    const db = context.env.DB;
    const request = context.request;
    if (!db) {
        return new Response(JSON.stringify({ error: "DB binding not found." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const url = new URL(request.url);
        const recordId = url.searchParams.get("record_id");
        if (!recordId) {
            return new Response(JSON.stringify({ error: "record_id is required." }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        await db.prepare("DELETE FROM employee_records WHERE record_id = ?").bind(recordId).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
