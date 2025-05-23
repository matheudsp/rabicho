export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl flex flex-col mx-auto py-10 gap-12 items-start">{children}</div>
  );
}
