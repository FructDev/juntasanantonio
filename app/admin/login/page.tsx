"use client";

import { adminLogin } from "@/app/actions";
import { useActionState } from "react";

export default function LoginPage() {
  const [state, action, pending] = useActionState(
    async (_prev: { error?: string } | null, fd: FormData) => {
      return adminLogin(fd) as Promise<{ ok: boolean; error?: string }>;
    },
    null
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#f5f7fa" }}>
      <div className="bg-white border rounded-xl shadow-sm w-full max-w-sm p-8" style={{ borderColor: "#d1d9e6" }}>
        <div className="text-center mb-7">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3" style={{ background: "#003876" }}>
            <span className="text-white text-xl">🏛</span>
          </div>
          <h1 className="text-lg font-bold">Panel de administración</h1>
          <p className="text-xs mt-1" style={{ color: "#4a5568" }}>Junta de Vecinos — Sector San Antonio</p>
        </div>

        <form action={action} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5">Contraseña</label>
            <input
              name="password"
              type="password"
              required
              autoFocus
              className="w-full px-3 py-2.5 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-200"
              style={{ borderColor: "#d1d9e6" }}
            />
          </div>
          {state?.error && (
            <p className="text-xs font-medium" style={{ color: "#c8102e" }}>
              {state.error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full text-white text-sm font-semibold py-2.5 rounded-md transition-opacity disabled:opacity-60"
            style={{ background: "#003876" }}
          >
            {pending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
