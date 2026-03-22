import { createClient } from '@supabase/supabase-js';

type RequestBody = {
    email: string;
    password: string;
    username: string;
    role: 'Admin' | 'Super Admin';
    phone?: string | null;
    department?: string | null;
    location?: string | null;
};

export default async function handler(req: { method?: string; headers?: any; body?: any }, res: any) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
        res.status(500).json({ error: 'Server not configured.' });
        return;
    }

    const authHeader = req.headers?.authorization ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
        res.status(401).json({ error: 'Missing auth token.' });
        return;
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
        auth: { persistSession: false }
    });

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData?.user) {
        res.status(401).json({ error: 'Invalid auth token.' });
        return;
    }

    const { data: profile, error: profileError } = await supabaseAdmin
        .from('admin_profiles')
        .select('role')
        .eq('id', userData.user.id)
        .maybeSingle();

    if (profileError || profile?.role !== 'Super Admin') {
        res.status(403).json({ error: 'Super Admin access required.' });
        return;
    }

    const body: RequestBody = req.body ?? {};
    const email = String(body.email ?? '').trim();
    const password = String(body.password ?? '').trim();
    const username = String(body.username ?? '').trim();
    const role = body.role === 'Super Admin' ? 'Super Admin' : 'Admin';

    if (!email || !password || !username) {
        res.status(400).json({ error: 'Email, password, and username are required.' });
        return;
    }

    const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    });

    if (createError || !createdUser?.user) {
        res.status(400).json({ error: createError?.message ?? 'Failed to create user.' });
        return;
    }

    const { data: adminProfile, error: insertError } = await supabaseAdmin
        .from('admin_profiles')
        .insert({
            id: createdUser.user.id,
            username,
            role,
            phone: body.phone?.toString().trim() || null,
            department: body.department?.toString().trim() || null,
            location: body.location?.toString().trim() || null
        })
        .select('id, username, role, phone, department, location, avatar_url')
        .single();

    if (insertError) {
        res.status(400).json({ error: insertError.message });
        return;
    }

    res.status(200).json({ admin: adminProfile });
}
