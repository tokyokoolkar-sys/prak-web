import KatalogTransition from "component/KatalogTransition";

export default function KatalogTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <KatalogTransition />
      {children}
    </>
  );
}
