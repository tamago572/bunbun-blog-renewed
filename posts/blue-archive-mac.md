# M1/M2 Macでブルアカを動かす方法（PlayCover）と注意点とは

![thumbnail](/blue-archive-mac/playcover_blac.webp)

Macの綺麗な画面でブルアカをプレイしたい！メモロビを大画面で見たい！ストーリー見たい！って思った先生、いるのではないでしょうか？

そんな先生方のためにいいアプリがあります。PlayCoverというアプリです。超簡単にMacでブルアカをプレイできます。

さらに、AndroidエミュレーターではなくiOSアプリをMacのアプリとしてネイティブに動かすという仕組みなので、軽いだけでなく、エミュレーターのめんどくさい設定が不要になります！

ただし、Apple Silicon (M1/M2) Macでしか使えません。なぜなら、iOSアプリをネイティブで動かすためには、アーキテクチャがARMである必要があるためです。

＜注意＞
すべて自己責任でお願いします。また、後述する「利用規約について」もお読みください。もし懲戒免職(BAN)や課金あたりでトラブルなど、問題が起きても私は一切責任を負えません。

<!-- 目次 -->
<div><HeadingList></HeadingList></div>

## 筆者の環境

- MacBook Pro 14inch, 2021
- M1 Pro
- macOS Ventura 13.6.4
※Sonomaだと動かない可能性アリ

## PlayCoverのインストール

https://github.com/PlayCover/PlayCover/releases/tag/2.0.5

このリンクからダウンロードします。スクロールして、.dmgファイルをダウンロードしましょう。

![github](/blue-archive-mac/github_plcv.webp)

注意点として、必ずバージョン2.0.5をダウンロードするようにしてください。
3.0.0 betaもありますが、「Use of unauthorized apps.」と出て起動しないので注意しましょう。

そしたらいつも通りdmgファイルを開いてインストールしてください。

## ブルアカのダウンロード

ブルアカのIPAファイルをダウンロードします。

IPAファイルというのは、APKのApple版のようなものです。
アプリのアーカイブになります。

https://decrypt.day/app/id1515877221

リンクを開いたら、青色のFree Downloadというボタンでダウンロードできます。

![download ipa](/blue-archive-mac/blac_dlnow-1024x665.webp)

アプリのアップデート時は適宜このサイトからダウンロードしてください。
ただし、App Storeのアプリをコピーしているわけなので、リリースから少々タイムラグがあることに注意してください。

## ブルアカをPlayCoverにインストール

PlayCoverを開きましょう。

プラスボタンをクリックし、さっきダウンロードしたIPAファイルを選択します。

![add ipa](/blue-archive-mac/add_ipa-1024x632.webp)

ブルアカが追加されたら、右上の設定アイコンをクリックします。

![click settings icon](/blue-archive-mac/settings_icon-1024x569.webp)

脱獄検知回避タブから「ジェイルブレイクバイパスを有効にする（アルファ）」のチェックボックスを有効にします。

![click a checkbox](/blue-archive-mac/jail_break-1024x569.webp)

OKで保存します。

## SIPの無効化

PlayCover v2.0.5では動作させるためにはSIPの無効化が必要です。

まず、Macをシャットダウンしてください。

次に、電源ボタンを押しっぱなしにします。
起動オプションを読み込み中と出るまで離さないでください。

起動ディスクの選択画面が出るので、「オプション」を選択します。

![select option](/blue-archive-mac/IMG_3562-1024x768.webp)

ユーザーを選択し、パスワードを入力します。

メニューバーから、ユーティリティ→ターミナルを選択します。

![terminal](/blue-archive-mac/IMG_3564-1024x768.webp)

```bash
csrutil disable
```

と入力してEnter。

![terminal](/blue-archive-mac/IMG_3566-1024x768.webp)

なんか聞かれるので、yと入力してEnter。

ログインパスワードを聞かれるので入力してEnter。
入力中、文字が見えませんが、入力されているので、そのままEnterで大丈夫です。

![enter pw](/blue-archive-mac/IMG_3568-1-1024x768.webp)

少し処理に時間がかかります。
Restart the machine…と出たら、リンゴアイコンからMacを再起動します。

起動したらまず、PlayCoverを開いてください。

メニューバーから、PlayCover→コード署名設定を選択します。

![menubar](/blue-archive-mac/playcovermenubar.webp)

コマンドをコピーをクリックします。

![copy commands](/blue-archive-mac/playcovercode.webp)

そしたらターミナルを開きます。

さきほどコピーした文字列をペーストして、Enter。
Macが再起動されます。

![terminal](/blue-archive-mac/playcoverterminal.webp)

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
