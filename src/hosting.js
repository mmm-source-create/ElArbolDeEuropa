// Valor público fijado durante el build; nunca contiene credenciales.
export const HOSTING_PROVIDER = import.meta.env?.VITE_HOSTING_PROVIDER === 'cloudflare' ? 'cloudflare' : 'vercel';
