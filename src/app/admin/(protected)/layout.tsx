import AdminSidebar from './AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#0a0a0a',
        fontFamily: "'Space Mono', monospace",
      }}
    >
      <AdminSidebar />
      <main
        style={{
          marginLeft: 200,
          flex: 1,
          padding: '40px 48px',
          minHeight: '100vh',
          overflowY: 'auto',
        }}
      >
        {children}
      </main>
    </div>
  );
}
