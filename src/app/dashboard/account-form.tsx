"use client";

interface User {
  id: string
  email: string
  name?: string | null
}

export default function AccountForm({ user }: { user: User | null }) {
  return (
    <div className="form-widget">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={user?.email} disabled />
      </div>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" value={user?.name || ''} disabled />
      </div>
    </div>
  );
}
