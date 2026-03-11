import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../api/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
};

export const AuthProvider = ({ children }) => {
    const ORG_SLUG = 'Furn';

    const [orgId, setOrgId] = useState(() => localStorage.getItem('org_id'));
    const [orgName, setOrgName] = useState(() => localStorage.getItem('org_name') || '');
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('auth_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [orgLoading, setOrgLoading] = useState(!localStorage.getItem('org_id'));
    const [orgError, setOrgError] = useState(null);

    // Resolve org slug once on mount — always re-verify on fresh load
    useEffect(() => {
        if (localStorage.getItem('org_id')) {
            setOrgLoading(false);
            return;
        }
        fetch(`http://localhost:5000/api/orgs/resolve/${ORG_SLUG}`)
            .then(r => {
                if (!r.ok) throw new Error(`Org resolve failed: ${r.status}`);
                else console.log('Org resolved successfully');
                return r.json();
            })
            .then(data => {
                if (!data.org_id) throw new Error('Organization not found');
                console.log('[AuthContext] Resolved org_id:', data.org_id);
                localStorage.setItem('org_id', String(data.org_id));
                localStorage.setItem('org_name', data.org_name);
                setOrgId(String(data.org_id));
                setOrgName(data.org_name);
            })
            .catch(e => {
                console.error('[AuthContext] Org resolution error:', e);
                setOrgError(e.message);
            })
            .finally(() => setOrgLoading(false));
    }, []);

    /**
     * Login: fetches users scoped to the resolved org, then matches by email.
     *
     * Tenancy is enforced at two levels:
     *   1. GET /users/org sends x-org-id, so the backend already filters by org.
     *   2. We double-check match.org_id === resolved orgId as a belt-and-suspenders guard.
     *
     * Password is NOT verified against the DB (no /login endpoint yet).
     * Returns { success: bool, user?, error? }
     */
    const login = async (email, password) => {
        if (!email || !password) return { success: false, error: 'Email and password are required' };

        // Guard: org must be resolved before we can scope the request
        const currentOrgId = localStorage.getItem('org_id');
        if (!currentOrgId) {
            return { success: false, error: 'Organization not resolved yet. Please wait a moment and try again.' };
        }

        try {
            // Fetches only users belonging to currentOrgId (x-org-id header set by apiFetch)
            const users = await apiFetch('/users/org');

            const match = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

            if (!match) {
                return { success: false, error: 'No account found with that email in this organization' };
            }

            // Belt-and-suspenders tenancy check:
            // The backend already filtered by org, but verify the returned record agrees.
            if (String(match.org_id) !== String(currentOrgId)) {
                console.error('[AuthContext] Tenancy mismatch — returned user org_id does not match resolved org_id');
                return { success: false, error: 'Account does not belong to this organization' };
            }

            const userData = {
                user_id: match.user_id,
                full_name: match.full_name,
                email: match.email,
                role_name: match.role_name,
                org_id: String(match.org_id),
            };

            localStorage.setItem('user_id', String(userData.user_id));
            localStorage.setItem('auth_user', JSON.stringify(userData));
            setUser(userData);

            console.log('[AuthContext] Logged in:', userData.email, '| role:', userData.role_name, '| org_id:', userData.org_id);
            return { success: true, user: userData };
        } catch (e) {
            console.error('[AuthContext] Login error:', e);
            return { success: false, error: e.message || 'Login failed. Please try again.' };
        }
    };

    const logout = () => {
        localStorage.removeItem('user_id');
        localStorage.removeItem('auth_user');
        setUser(null);
    };

    // Admin = role 1 (Admin) or role 3 (Org_Level_Access) per the schema.
    // Match against role_name strings from the DB join.
    const isAdmin = user?.role_name === 'admin' || user?.role_name === 'Org_Level_Access' || user?.role_name === 'Dev';

    return (
        <AuthContext.Provider value={{ user, orgId, orgName, orgLoading, orgError, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};
