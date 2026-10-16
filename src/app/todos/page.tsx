import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function TodosPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase.from("todos").select();

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 p-8">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-orange-500">Supabase Connection Test</h1>
            <p className="text-sm text-stone-400">Route: /todos</p>
          </div>
          <Link
            href="/"
            className="text-xs px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
          >
            ← Kembali ke Home
          </Link>
        </div>

        {error ? (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
            <p className="font-semibold mb-1">Status Koneksi Supabase:</p>
            <p className="font-mono text-xs">{error.message}</p>
            <p className="text-xs text-stone-400 mt-2">
              (Jika tabel &quot;todos&quot; belum dibuat di Supabase Dashboard, Anda dapat membuatnya melalui SQL Editor Supabase).
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-stone-300 uppercase tracking-wider">
              Daftar Todos ({todos?.length || 0})
            </h2>
            {todos && todos.length > 0 ? (
              <ul className="space-y-2">
                {todos.map((todo: { id: string | number; name?: string; title?: string }) => (
                  <li
                    key={todo.id}
                    className="p-3 rounded-lg bg-stone-800/80 border border-stone-700/60 flex items-center justify-between"
                  >
                    <span>{todo.name || todo.title || JSON.stringify(todo)}</span>
                    <span className="text-xs font-mono text-stone-500">ID: {todo.id}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-stone-400 italic">
                Koneksi berhasil! Belum ada data di tabel &quot;todos&quot;.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
