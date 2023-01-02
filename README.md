# **NoticeFridayRoadshow**

Google App Script (GAS) を使用して、金曜ロードショーのラインナップ映画の情報を収集し、定期的にLineに通知するLineBotを作成します。

<br>

## **使用ツール**
+ Google App Script (GAS)
+ Line
+ javascript

<br>

## **事前準備**

### **Googleアカウントの準備**

GASを使用するには、Googleアカウントが必要になるので事前に作成しておきましょう。<br>
(詳細な説明はスキップします)

### **Line Developersの準備**

[LINE Developersの登録・設定マニュアル](https://www.salons.jp/posts/30916309/)の「①LINEビジネスアカウントの準備」から「⑦新規チャネルの作成」を実施して、本アプリで使用するLINE Developersのチャネルを作成しましょう。


+ `チャネル基本設定`の`あなたのユーザーID`
+ `Messaging API設定`の`チャネルアクセストークン` (未発行の場合は発行しておきましょう)

<br>

## **導入方法**

1. [GAS](https://script.google.com/home)を開き、新規プロジェクトを作成します。<br>
(プロジェクト名は好きな名前を設定します)

1. `ファイル`の横にある[`＋`ボタン→スクリプト]を選択し、`main`と`private`のスクリプトを作成します。<br>
実施すると、`main.gs`と`private.gs`が追加されます。

1. `main.js`のコードを`main.gs`、`private_template.js`のコードを`private.gs`にコピペします。

1. コピペ後の`private.gs`にあるLINE_PARAにアクセストークンとユーザIDを追加します。<br>
これらの情報の取得に関して、`Line Developersの準備`の章に記載しています。<br>
ユーザIDには`チャネル基本設定`の`あなたのユーザーID`、<br>アクセストークンには`Messaging API設定`の`チャネルアクセストークン`を設定してください。

1. トリガー（時計のマーク）から「トリガーを追加」をクリックし、下記のように設定し、保存します。
    + 実行する関数：Runner
    + イベントのソース：時間主導型
    + 時間ベースのトリガータイプ：週ベースのタイマー
    + 曜日を選択：毎週金曜日
    + 時刻の選択：ここの設定は任意

以上の設定が完了すると、定期的に金曜ロードショーのラインナップ映画の情報がLineで届くようになります。
