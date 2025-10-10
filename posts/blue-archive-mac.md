# M1/M2 Macでブルアカを動かす方法（PlayCover）と注意点とは

Macの綺麗な画面でブルアカをプレイしたい！メモロビを大画面で見たい！ストーリー見たい！って思った先生、いるのではないでしょうか？

そんな先生方のためにいいアプリがあります。PlayCoverというアプリです。超簡単にMacでブルアカをプレイできます。

さらに、AndroidエミュレーターではなくiOSアプリをMacのアプリとしてネイティブに動かすという仕組みなので、軽いだけでなく、エミュレーターのめんどくさい設定が不要になります！

ただし、Apple Silicon (M1/M2) Macでしか使えません。なぜなら、iOSアプリをネイティブで動かすためには、アーキテクチャがARMである必要があるためです。

＜注意＞
すべて自己責任でお願いします。また、後述する「利用規約について」もお読みください。もし懲戒免職(BAN)や課金あたりでトラブルなど、問題が起きても私は一切責任を負えません。

<HeadingList></HeadingList>

## 筆者の環境

- MacBook Pro 14inch, 2021
- M1 Pro
- macOS Ventura 13.6.4
※Sonomaだと動かない可能性アリ

## PlayCoverのインストール

https://github.com/PlayCover/PlayCover/releases/tag/2.0.5

このリンクからダウンロードします。スクロールして、.dmgファイルをダウンロードしましょう。

{-image-}

注意点として、必ずバージョン2.0.5をダウンロードするようにしてください。
3.0.0 betaもありますが、「Use of unauthorized apps.」と出て起動しないので注意しましょう。

そしたらいつも通りdmgファイルを開いてインストールしてください。

## ブルアカのダウンロード

ブルアカのIPAファイルをダウンロードします。

IPAファイルというのは、APKのApple版のようなものです。
アプリのアーカイブになります。

https://decrypt.day/app/id1515877221

リンクを開いたら、青色のFree Downloadというボタンでダウンロードできます。

{image}

アプリのアップデート時は適宜このサイトからダウンロードしてください。
ただし、App Storeのアプリをコピーしているわけなので、リリースから少々タイムラグがあることに注意してください。

## ブルアカをPlayCoverにインストール

PlayCoverを開きましょう。

プラスボタンをクリックし、さっきダウンロードしたIPAファイルを選択します。

{image}

ブルアカが追加されたら、右上の設定アイコンをクリックします。

{image}

脱獄検知回避タブから「ジェイルブレイクバイパスを有効にする（アルファ）」のチェックボックスを有効にします。

{image}

OKで保存します。

## SIPの無効化

PlayCover v2.0.5では動作させるためにはSIPの無効化が必要です。

まず、Macをシャットダウンしてください。

次に、電源ボタンを押しっぱなしにします。
起動オプションを読み込み中と出るまで離さないでください。

起動ディスクの選択画面が出るので、「オプション」を選択します。

{image}

ユーザーを選択し、パスワードを入力します。

メニューバーから、ユーティリティ→ターミナルを選択します。

{image}

```bash
csrutil disable
```

と入力してEnter。

{image}

なんか聞かれるので、yと入力してEnter。

ログインパスワードを聞かれるので入力してEnter。
入力中、文字が見えませんが、入力されているので、そのままEnterで大丈夫です。

{image}

少し処理に時間がかかります。
Restart the machine…と出たら、リンゴアイコンからMacを再起動します。

起動したらまず、PlayCoverを開いてください。

メニューバーから、PlayCover→コード署名設定を選択します。

{image}

コマンドをコピーをクリックします。

{image}

そしたらターミナルを開きます。

さきほどコピーした文字列をペーストして、Enter。
Macが再起動されます。

{image}

するとPlayCoverからブルアカをダブルクリックで起動で遊ぶことができます。

Dockに追加することもできます。

## 利用規約について

2024年3月15日より、ブルーアーカイブの規約変更がありました。

この規約変更で禁止事項として以下の部分が追加されました。

```text
    （13）当社が頒布したものでない、または当社からの認可を受けていない第三者のソフトウェア、プラグイン、外部ツール、システムを本サービスにおいて利用する行為。
https://bluearchive.jp/terms
```

この部分について、Androidエミュで動かしている分にはおそらく関係ないですが、（Android端末で遊んでいるのと同じ、アプリに直接干渉していないため）
PlayCoverでは直接に動かしています。また、アプリに対して脱獄検知回避の設定をしているので、この**規約に触れる**可能性があります。

ですがアプリの起動時の脱獄検知を回避しているだけでゲームには一切干渉していないですし、グレーゾーン？もしくはアウトか？と曖昧だなーと私は考えています。

ですので垢BANが怖い人はやらないほうがいいかもしれません。

## 最後に

ブルアカをやっていてM1/M2 Macを持っている先生は是非一度試してみてください。

ただし自己責任でお願いします。私は一切責任を負えません。

## これはテスト

### TypeScript

以下TypeScript

```typescript
import fs from "node:fs";

const POST_PATH = "posts/";

export async function getPostContent(filename: string): Promise<string> {
  const content = await fs.promises.readFile(
    `${POST_PATH}/${filename}`,
    "utf-8",
  );
  return content;
}

export async function getPostTitle(filename: string): Promise<string> {
  const content = await getPostContent(filename);
  const match = content.match(/^# (.+)$/m);
  return match ? match[1] : "Untitled";
}

export async function getPostUpdateDate(
  filename: string,
): Promise<Date | null> {
  const date = await fs.promises.stat(`${POST_PATH}/${filename}`);
  return date ? date.mtime : null; // mtime→ファイルの最終更新日時を取得
}

export async function getPostsFileList(): Promise<string[]> {
  const postfiles = await fs.promises.readdir(POST_PATH);
  return postfiles;
}

export async function getPostsSlug(): Promise<string[]> {
  const postfiles = await getPostsFileList();
  return postfiles.map((filename) => filename.replace(/\.md$/, ""));
}

export async function getPostsTitle(): Promise<string[]> {
  const files = await getPostsFileList();
  const titles = await Promise.all(files.map((file) => getPostTitle(file)));
  return titles;
}
```
