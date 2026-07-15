export async function onRequestGet(context) {
    const db = context.env.DB;
    if (!db) {
        return new Response(JSON.stringify({ error: "DB binding not found." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const { results } = await db.prepare("SELECT * FROM employee_profiles ORDER BY name ASC").all();
        const profiles = results.map(p => ({
            name: p.name,
            team: p.team,
            baseSalary: p.base_salary,
            isProbation: p.is_probation === 1,
            isMidmonth: p.is_midmonth === 1,
            extraDays: p.extra_days,
            passcode: p.passcode,
            hireDate: p.hire_date
        }));

        return new Response(JSON.stringify(profiles), {
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
        const nameKey = body.name.toLowerCase().trim();
        const isProb = body.isProbation ? 1 : 0;
        const isMid = body.isMidmonth ? 1 : 0;

        await db.prepare(`
            INSERT OR REPLACE INTO employee_profiles (
                name, team, base_salary, is_probation, is_midmonth, extra_days, passcode, hire_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            nameKey, body.team, body.baseSalary, isProb, isMid, body.extraDays || 0, body.passcode, body.hireDate
        ).run();

        return new Response(JSON.stringify({ success: true, name: nameKey }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
