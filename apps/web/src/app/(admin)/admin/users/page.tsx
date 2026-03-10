import { Shield } from "lucide-react";
const MOCK_USERS = [
  {id:"u1",username:"sora",display_name:"Sora",role:"OWNER",supporter_role:null,created_at:"2023-08-01"},
  {id:"u2",username:"bubu",display_name:"Bubu",role:"ADMIN",supporter_role:"VVIP",created_at:"2023-08-02"},
  {id:"u3",username:"kaizo",display_name:"Kaizo",role:"ADMIN",supporter_role:"VIP",created_at:"2023-08-03"},
  {id:"u4",username:"riu",display_name:"Riu",role:"MANAGER",supporter_role:"VVIP",created_at:"2023-08-01"},
];
const RC:Record<string,string>={OWNER:"text-amber-400 bg-amber-500/10",MANAGER:"text-violet-400 bg-violet-500/10",ADMIN:"text-primary bg-primary/10",USER:"text-muted-foreground bg-muted"};
const SC:Record<string,string>={VVIP:"text-amber-400",VIP:"text-primary",DONATUR:"text-blue-400"};
export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Users</h1><p className="text-sm text-muted-foreground mt-1">Kelola role dan membership.</p></div>
      <div className="glass-card overflow-hidden"><div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border/50 text-left">{["User","Role","Supporter","Sejak","Aksi"].map(h=><th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-border/30">
            {MOCK_USERS.map(u=>(
              <tr key={u.id} className="hover:bg-primary/3 transition-colors">
                <td className="px-4 py-3"><div className="flex items-center gap-2.5"><div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{(u.display_name).charAt(0)}</div><div><p className="font-medium">{u.display_name}</p><p className="text-xs text-muted-foreground">@{u.username}</p></div></div></td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${RC[u.role]??RC.USER}`}>{u.role}</span></td>
                <td className="px-4 py-3">{u.supporter_role?<span className={`text-xs font-medium ${SC[u.supporter_role]}`}>{u.supporter_role}</span>:<span className="text-xs text-muted-foreground/50">—</span>}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground/60">{u.created_at}</td>
                <td className="px-4 py-3"><button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"><Shield className="h-3 w-3"/>Ubah Role</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>
      <div className="rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">💡 Fungsi ubah role aktif setelah Kaizo setup <code className="text-primary">PATCH /api/admin/users/[id]</code></div>
    </div>
  );
}
