import { Noto_Sans_JP } from "next/font/google";
import Header from "../components/Header";
import "@/app/styles/main.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${notoSansJP.className}`}>

        {/* TODO: サイドバーを実装する
          widthを変えるよりもgridレイアウトに変えるほうがいいかも
        */}
        <Header />
        <main className="mx-auto lg:w-4/5 xl:w-2/3 2xl:w-3/5 p-8">
          {children}
        </main>
    </div>
  );
}
