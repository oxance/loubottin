import React from 'react'
import ReactDOM from 'react-dom/client'
import { createClient } from '@supabase/supabase-js';
import { Database } from './supabase.types.ts';
import { SupabaseContextProvider } from './Supabase.tsx';
import App from './App.tsx'
import './index.scss'

const {
    VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY,
} = import.meta.env;

const supabase = createClient<Database>(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SupabaseContextProvider supabase={supabase}>
            <App />
        </SupabaseContextProvider>
    </React.StrictMode>,
)
