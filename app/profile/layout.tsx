export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-sm flex flex-col gap-12 items-start mx-auto">
      {children}
    </div>
  );
}