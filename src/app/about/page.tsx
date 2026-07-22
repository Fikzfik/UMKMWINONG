import ProfilPage, { metadata as profilMetadata } from "../profil/page";

export const metadata = {
  ...profilMetadata,
  title: "About & Profil | WebDesa Winong",
};

export default function AboutPage() {
  return <ProfilPage />;
}
