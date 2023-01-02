class Param {
    constructor() {
        Object.defineProperty(this, "URL", {value: "https://kinro.ntv.co.jp/lineup"});
        Object.defineProperty(this, "SEPARATE_LINE", {value: "--------------------"});
    }
}


class Notice extends Param {

    constructor() {
        super();
    }

    /**
     * LineAPIにPOSTするデータを作成する。
     * @param {String} message 送信する文字列
     * @return {Dict}} POSTするデータを格納した辞書
     */
    CreatePostData(message) {
        const url = "https://api.line.me/v2/bot/message/push";
        const headers = {
        "Content-Type": "application/json; charset=UTF-8",
        "Authorization": "Bearer " + LINE_PARAM.accessToken
        };
        const payload = {
        "to": LINE_PARAM.userId,
        "messages": [{
            "type": "text",
            "text": message
            }]
        };
        const options = {
        "method": "POST",
        "headers": headers,
        "payload": JSON.stringify(payload)
        };

        return {url: url, options: options};
    }

    /**
     * Webページからラインナップ映画の情報を抽出する。
     * @return {Dict}} ラインナップ映画の情報
     */
    ExtractLineupMovieInfo() {
        // URLに対しフェッチを行ってHTMLデータを取得する
        const pageHtml = UrlFetchApp.fetch(this.URL).getContentText('UTF-8');

        // 今後の放送ラインナップのHTMLデータを取得
        const lineupHtml = Parser.data(pageHtml).from('<section id="after_lineup">').to('</section>').iterate()[0];

        // 放送映画ごとのHTMLデータを取得
        const itemHtmls = Parser.data(lineupHtml).from("<li>").to("</li>").iterate();

        // 日時とタイトルを取得
        const itemDicts = itemHtmls.map(function (itemHtml) {
            const titleHtml = Parser.data(itemHtml).from('<div class="title">').to('</div>').iterate()[0];
            const hrefUrl = Parser.data(itemHtml).from("<a href='").to("'>").iterate()[0];
            const itemDict = {
                date: Parser.data(itemHtml).from('<div class="date">').to('</div>').iterate()[0],
                title: Parser.data(titleHtml).from("<a href='" + hrefUrl + "'>").to('</a>').iterate()[0]
            };
            return itemDict;
        });

        return itemDicts;
    }

    /**
     * ラインナップ映画の情報を送信文字列の形に変換する。
     * @param {List} itemDicts ラインナップ映画の情報(辞書)を格納したリスト
     * @return {String}} Lineに送信するメッセージ文字列
     */
    ConvertNoticeMessage(itemDicts) {
        const messages = itemDicts.map(function (itemDict) {
            return '■' + itemDict.date + "\n" + itemDict.title
        });

        const message = "【金曜ロードショーの放送日程】\n" + this.SEPARATE_LINE + "\n" + messages.join("\n\n");
        return message;
    }

    /**
     * 作成したデータをLineのAPIにPOSTする。
     * @param {Dict} postData POST用のURLとOPTIONデータ
     */
    PostToLine(postData) {
        UrlFetchApp.fetch(postData.url, postData.options)
    }
}


// トリガーで指定する関数
function Runner() {
    const notice = new Notice();

    const lineupMovieDicts = notice.ExtractLineupMovieInfo();
    const noticeMessage = notice.ConvertNoticeMessage(lineupMovieDicts);

    const postData = notice.CreatePostData(noticeMessage);
    notice.PostToLine(postData)
    console.log(noticeMessage);
}
