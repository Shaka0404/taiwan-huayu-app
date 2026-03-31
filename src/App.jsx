import { useState, useEffect, useCallback } from "react";
import { AUDIO_MAP } from "./audioMap.js";

const LEVELS = [
  { id: "beginner", label: "初級", labelZh: "初級 chūjí", color: "#e74c3c" },
  { id: "intermediate", label: "中級", labelZh: "中級 zhōngjí", color: "#f39c12" },
  { id: "advanced", label: "上級", labelZh: "高級 gāojí", color: "#27ae60" },
];

const CATEGORIES = [
  { id: "greetings", icon: "👋", label: "挨拶・自己紹介", labelZh: "打招呼" },
  { id: "food", icon: "🍜", label: "食事・飲み物", labelZh: "吃喝" },
  { id: "shopping", icon: "🛒", label: "買い物・会計", labelZh: "購物" },
  { id: "transport", icon: "🚇", label: "交通・移動", labelZh: "交通" },
  { id: "hotel", icon: "🏨", label: "宿泊・ホテル", labelZh: "住宿" },
  { id: "sightseeing", icon: "📸", label: "観光・レジャー", labelZh: "觀光" },
  { id: "health", icon: "🏥", label: "体調・病院", labelZh: "健康" },
  { id: "emotions", icon: "😊", label: "感情・表現", labelZh: "情感" },
  { id: "daily", icon: "🏠", label: "生活・日常", labelZh: "日常" },
  { id: "business", icon: "💼", label: "仕事・ビジネス", labelZh: "工作" },
  { id: "numbers", icon: "🔢", label: "数字・時間", labelZh: "數字" },
  { id: "idioms", icon: "📜", label: "成語・慣用句", labelZh: "成語" },
];

const VOCAB_BY_CAT = {
  greetings: [
    { id:"g1", hanzi:"你好", bopomofo:"ㄋㄧˇ ㄏㄠˇ", pinyin:"nǐ hǎo", meaning:"こんにちは", example:"你好，很高興認識你。", exampleMeaning:"こんにちは、お会いできて嬉しいです。", level:"beginner" },
    { id:"g2", hanzi:"早安", bopomofo:"ㄗㄠˇ ㄢ", pinyin:"zǎo ān", meaning:"おはよう", example:"早安！今天天氣很好。", exampleMeaning:"おはよう！今日はいい天気です。", level:"beginner" },
    { id:"g3", hanzi:"晚安", bopomofo:"ㄨㄢˇ ㄢ", pinyin:"wǎn ān", meaning:"おやすみ", example:"晚安，明天見。", exampleMeaning:"おやすみ、また明日。", level:"beginner" },
    { id:"g4", hanzi:"謝謝", bopomofo:"ㄒㄧㄝˋ ㄒㄧㄝˋ", pinyin:"xiè xie", meaning:"ありがとう", example:"謝謝你的幫忙。", exampleMeaning:"手伝ってくれてありがとう。", level:"beginner" },
    { id:"g5", hanzi:"不客氣", bopomofo:"ㄅㄨˋ ㄎㄜˋ ㄑㄧˋ", pinyin:"bú kè qì", meaning:"どういたしまして", example:"不客氣，這是應該的。", exampleMeaning:"どういたしまして、当然のことです。", level:"beginner" },
    { id:"g6", hanzi:"對不起", bopomofo:"ㄉㄨㄟˋ ㄅㄨˋ ㄑㄧˇ", pinyin:"duì bù qǐ", meaning:"ごめんなさい", example:"對不起，我遲到了。", exampleMeaning:"ごめんなさい、遅刻しました。", level:"beginner" },
    { id:"g7", hanzi:"沒關係", bopomofo:"ㄇㄟˊ ㄍㄨㄢ ㄒㄧˋ", pinyin:"méi guān xi", meaning:"大丈夫です", example:"沒關係，別擔心。", exampleMeaning:"大丈夫です、心配しないで。", level:"beginner" },
    { id:"g8", hanzi:"請問", bopomofo:"ㄑㄧㄥˇ ㄨㄣˋ", pinyin:"qǐng wèn", meaning:"お尋ねします", example:"請問，洗手間在哪裡？", exampleMeaning:"すみません、トイレはどこですか？", level:"beginner" },
    { id:"g9", hanzi:"不好意思", bopomofo:"ㄅㄨˋ ㄏㄠˇ ㄧˋ ㄙ˙", pinyin:"bù hǎo yì si", meaning:"すみません（恐縮）", example:"不好意思，可以幫我拍照嗎？", exampleMeaning:"すみません、写真を撮ってもらえますか？", level:"beginner" },
    { id:"g10", hanzi:"再見", bopomofo:"ㄗㄞˋ ㄐㄧㄢˋ", pinyin:"zài jiàn", meaning:"さようなら", example:"再見！下次再聊。", exampleMeaning:"さようなら！また今度話しましょう。", level:"beginner" },
    { id:"g11", hanzi:"我叫", bopomofo:"ㄨㄛˇ ㄐㄧㄠˋ", pinyin:"wǒ jiào", meaning:"私は〜と申します", example:"我叫田中，來自日本。", exampleMeaning:"私は田中と申します、日本から来ました。", level:"beginner" },
    { id:"g12", hanzi:"你好嗎", bopomofo:"ㄋㄧˇ ㄏㄠˇ ㄇㄚ˙", pinyin:"nǐ hǎo ma", meaning:"お元気ですか", example:"好久不見，你好嗎？", exampleMeaning:"お久しぶり、お元気ですか？", level:"beginner" },
    { id:"g13", hanzi:"認識", bopomofo:"ㄖㄣˋ ㄕˋ", pinyin:"rèn shì", meaning:"知り合う・知っている", example:"很高興認識你。", exampleMeaning:"お会いできて嬉しいです。", level:"intermediate" },
    { id:"g14", hanzi:"幸會", bopomofo:"ㄒㄧㄥˋ ㄏㄨㄟˋ", pinyin:"xìng huì", meaning:"お目にかかれて光栄です", example:"幸會幸會，久仰大名。", exampleMeaning:"お目にかかれて光栄です。", level:"advanced" },
    { id:"g15", hanzi:"掰掰", bopomofo:"ㄅㄞ ㄅㄞ", pinyin:"bāi bāi", meaning:"バイバイ", example:"掰掰，明天見！", exampleMeaning:"バイバイ、また明日！", level:"beginner" },
  ],
  food: [
    { id:"f1", hanzi:"吃飯", bopomofo:"ㄔ ㄈㄢˋ", pinyin:"chī fàn", meaning:"ご飯を食べる", example:"我們去吃飯吧！", exampleMeaning:"ご飯を食べに行こう！", level:"beginner" },
    { id:"f2", hanzi:"好吃", bopomofo:"ㄏㄠˇ ㄔ", pinyin:"hǎo chī", meaning:"おいしい", example:"這個小籠包很好吃！", exampleMeaning:"この小籠包はとてもおいしい！", level:"beginner" },
    { id:"f3", hanzi:"珍珠奶茶", bopomofo:"ㄓㄣ ㄓㄨ ㄋㄞˇ ㄔㄚˊ", pinyin:"zhēn zhū nǎi chá", meaning:"タピオカミルクティー", example:"我要一杯珍珠奶茶。", exampleMeaning:"タピオカミルクティーを一つください。", level:"beginner" },
    { id:"f4", hanzi:"小籠包", bopomofo:"ㄒㄧㄠˇ ㄌㄨㄥˊ ㄅㄠ", pinyin:"xiǎo lóng bāo", meaning:"小籠包", example:"鼎泰豐的小籠包很有名。", exampleMeaning:"鼎泰豊の小籠包は有名です。", level:"beginner" },
    { id:"f5", hanzi:"滷肉飯", bopomofo:"ㄌㄨˇ ㄖㄡˋ ㄈㄢˋ", pinyin:"lǔ ròu fàn", meaning:"ルーローファン", example:"這家的滷肉飯很道地。", exampleMeaning:"この店のルーローファンは本場の味。", level:"beginner" },
    { id:"f6", hanzi:"甜度", bopomofo:"ㄊㄧㄢˊ ㄉㄨˋ", pinyin:"tián dù", meaning:"甘さの度合い", example:"甜度要半糖。", exampleMeaning:"甘さは半糖で。", level:"beginner" },
    { id:"f7", hanzi:"冰塊", bopomofo:"ㄅㄧㄥ ㄎㄨㄞˋ", pinyin:"bīng kuài", meaning:"氷", example:"少冰，謝謝。", exampleMeaning:"氷少なめで、ありがとう。", level:"beginner" },
    { id:"f8", hanzi:"內用", bopomofo:"ㄋㄟˋ ㄩㄥˋ", pinyin:"nèi yòng", meaning:"店内で食べる", example:"內用還是外帶？", exampleMeaning:"店内ですかお持ち帰りですか？", level:"beginner" },
    { id:"f9", hanzi:"外帶", bopomofo:"ㄨㄞˋ ㄉㄞˋ", pinyin:"wài dài", meaning:"テイクアウト", example:"我要外帶。", exampleMeaning:"テイクアウトで。", level:"beginner" },
    { id:"f10", hanzi:"菜單", bopomofo:"ㄘㄞˋ ㄉㄢ", pinyin:"cài dān", meaning:"メニュー", example:"請給我看菜單。", exampleMeaning:"メニューを見せてください。", level:"beginner" },
    { id:"f11", hanzi:"辣", bopomofo:"ㄌㄚˋ", pinyin:"là", meaning:"辛い", example:"我不敢吃辣。", exampleMeaning:"辛いものは苦手です。", level:"beginner" },
    { id:"f12", hanzi:"素食", bopomofo:"ㄙㄨˋ ㄕˊ", pinyin:"sù shí", meaning:"ベジタリアン料理", example:"這附近有素食餐廳嗎？", exampleMeaning:"この近くにベジタリアンレストランはある？", level:"intermediate" },
    { id:"f13", hanzi:"夜市", bopomofo:"ㄧㄝˋ ㄕˋ", pinyin:"yè shì", meaning:"夜市", example:"我們今晚去逛夜市吧！", exampleMeaning:"今夜は夜市に行こう！", level:"beginner" },
    { id:"f14", hanzi:"臭豆腐", bopomofo:"ㄔㄡˋ ㄉㄡˋ ㄈㄨˇ", pinyin:"chòu dòu fu", meaning:"臭豆腐", example:"你敢吃臭豆腐嗎？", exampleMeaning:"臭豆腐食べられる？", level:"intermediate" },
    { id:"f15", hanzi:"飽", bopomofo:"ㄅㄠˇ", pinyin:"bǎo", meaning:"お腹いっぱい", example:"我吃飽了，謝謝。", exampleMeaning:"お腹いっぱいです、ありがとう。", level:"beginner" },
    { id:"f16", hanzi:"好喝", bopomofo:"ㄏㄠˇ ㄏㄜ", pinyin:"hǎo hē", meaning:"（飲み物が）おいしい", example:"這杯茶很好喝。", exampleMeaning:"このお茶はおいしい。", level:"beginner" },
  ],
  shopping: [
    { id:"s1", hanzi:"多少錢", bopomofo:"ㄉㄨㄛ ㄕㄠˇ ㄑㄧㄢˊ", pinyin:"duō shǎo qián", meaning:"いくらですか", example:"這個多少錢？", exampleMeaning:"これはいくらですか？", level:"beginner" },
    { id:"s2", hanzi:"太貴了", bopomofo:"ㄊㄞˋ ㄍㄨㄟˋ ㄌㄜ˙", pinyin:"tài guì le", meaning:"高すぎる", example:"太貴了，可以便宜一點嗎？", exampleMeaning:"高すぎます、安くなりますか？", level:"beginner" },
    { id:"s3", hanzi:"便宜", bopomofo:"ㄆㄧㄢˊ ㄧˊ", pinyin:"pián yi", meaning:"安い", example:"這個很便宜。", exampleMeaning:"これは安いです。", level:"beginner" },
    { id:"s4", hanzi:"買", bopomofo:"ㄇㄞˇ", pinyin:"mǎi", meaning:"買う", example:"我要買這個。", exampleMeaning:"これを買いたいです。", level:"beginner" },
    { id:"s5", hanzi:"付錢", bopomofo:"ㄈㄨˋ ㄑㄧㄢˊ", pinyin:"fù qián", meaning:"お金を払う", example:"請問在哪裡付錢？", exampleMeaning:"どこでお会計ですか？", level:"beginner" },
    { id:"s6", hanzi:"刷卡", bopomofo:"ㄕㄨㄚ ㄎㄚˇ", pinyin:"shuā kǎ", meaning:"カードで支払う", example:"可以刷卡嗎？", exampleMeaning:"カードは使えますか？", level:"beginner" },
    { id:"s7", hanzi:"現金", bopomofo:"ㄒㄧㄢˋ ㄐㄧㄣ", pinyin:"xiàn jīn", meaning:"現金", example:"只收現金。", exampleMeaning:"現金のみです。", level:"beginner" },
    { id:"s8", hanzi:"收據", bopomofo:"ㄕㄡ ㄐㄩˋ", pinyin:"shōu jù", meaning:"レシート", example:"請給我收據。", exampleMeaning:"レシートをください。", level:"intermediate" },
    { id:"s9", hanzi:"打折", bopomofo:"ㄉㄚˇ ㄓㄜˊ", pinyin:"dǎ zhé", meaning:"割引する", example:"這個有打折嗎？", exampleMeaning:"これは割引ありますか？", level:"intermediate" },
    { id:"s10", hanzi:"找錢", bopomofo:"ㄓㄠˇ ㄑㄧㄢˊ", pinyin:"zhǎo qián", meaning:"おつりを返す", example:"找你五十塊。", exampleMeaning:"50元のおつりです。", level:"beginner" },
    { id:"s11", hanzi:"結帳", bopomofo:"ㄐㄧㄝˊ ㄓㄤˋ", pinyin:"jié zhàng", meaning:"会計する", example:"我要結帳。", exampleMeaning:"お会計お願いします。", level:"beginner" },
    { id:"s12", hanzi:"袋子", bopomofo:"ㄉㄞˋ ㄗ˙", pinyin:"dài zi", meaning:"袋", example:"需要袋子嗎？", exampleMeaning:"袋は要りますか？", level:"beginner" },
    { id:"s13", hanzi:"試穿", bopomofo:"ㄕˋ ㄔㄨㄢ", pinyin:"shì chuān", meaning:"試着する", example:"可以試穿嗎？", exampleMeaning:"試着できますか？", level:"intermediate" },
    { id:"s14", hanzi:"退貨", bopomofo:"ㄊㄨㄟˋ ㄏㄨㄛˋ", pinyin:"tuì huò", meaning:"返品する", example:"這個可以退貨嗎？", exampleMeaning:"これは返品できますか？", level:"intermediate" },
    { id:"s15", hanzi:"特價", bopomofo:"ㄊㄜˋ ㄐㄧㄚˋ", pinyin:"tè jià", meaning:"特価・セール", example:"今天有特價活動。", exampleMeaning:"今日はセールイベントがあります。", level:"intermediate" },
  ],
  transport: [
    { id:"t1", hanzi:"捷運", bopomofo:"ㄐㄧㄝˊ ㄩㄣˋ", pinyin:"jié yùn", meaning:"MRT（地下鉄）", example:"我搭捷運去上班。", exampleMeaning:"MRTで通勤しています。", level:"beginner" },
    { id:"t2", hanzi:"公車", bopomofo:"ㄍㄨㄥ ㄔㄜ", pinyin:"gōng chē", meaning:"バス", example:"公車站在前面。", exampleMeaning:"バス停は前方にあります。", level:"beginner" },
    { id:"t3", hanzi:"計程車", bopomofo:"ㄐㄧˋ ㄔㄥˊ ㄔㄜ", pinyin:"jì chéng chē", meaning:"タクシー", example:"我要叫計程車。", exampleMeaning:"タクシーを呼びたいです。", level:"beginner" },
    { id:"t4", hanzi:"高鐵", bopomofo:"ㄍㄠ ㄊㄧㄝˇ", pinyin:"gāo tiě", meaning:"新幹線（台湾高速鉄道）", example:"搭高鐵去台中很快。", exampleMeaning:"高鉄で台中に行くのは速い。", level:"beginner" },
    { id:"t5", hanzi:"火車", bopomofo:"ㄏㄨㄛˇ ㄔㄜ", pinyin:"huǒ chē", meaning:"電車・列車", example:"火車站在哪裡？", exampleMeaning:"駅はどこですか？", level:"beginner" },
    { id:"t6", hanzi:"悠遊卡", bopomofo:"ㄧㄡ ㄧㄡˊ ㄎㄚˇ", pinyin:"yōu yóu kǎ", meaning:"悠遊カード（ICカード）", example:"用悠遊卡比較方便。", exampleMeaning:"悠遊カードの方が便利です。", level:"beginner" },
    { id:"t7", hanzi:"轉車", bopomofo:"ㄓㄨㄢˇ ㄔㄜ", pinyin:"zhuǎn chē", meaning:"乗り換える", example:"需要在台北車站轉車。", exampleMeaning:"台北駅で乗り換えが必要です。", level:"beginner" },
    { id:"t8", hanzi:"下車", bopomofo:"ㄒㄧㄚˋ ㄔㄜ", pinyin:"xià chē", meaning:"降りる", example:"下一站我要下車。", exampleMeaning:"次の駅で降ります。", level:"beginner" },
    { id:"t9", hanzi:"機場", bopomofo:"ㄐㄧ ㄔㄤˇ", pinyin:"jī chǎng", meaning:"空港", example:"桃園機場離台北不遠。", exampleMeaning:"桃園空港は台北から遠くない。", level:"beginner" },
    { id:"t10", hanzi:"騎機車", bopomofo:"ㄑㄧˊ ㄐㄧ ㄔㄜ", pinyin:"qí jī chē", meaning:"バイクに乗る", example:"台灣人很多人騎機車。", exampleMeaning:"台湾人はバイクに乗る人が多い。", level:"intermediate" },
    { id:"t11", hanzi:"到", bopomofo:"ㄉㄠˋ", pinyin:"dào", meaning:"着く", example:"我到了！", exampleMeaning:"着きました！", level:"beginner" },
    { id:"t12", hanzi:"路線", bopomofo:"ㄌㄨˋ ㄒㄧㄢˋ", pinyin:"lù xiàn", meaning:"路線", example:"這條路線比較快。", exampleMeaning:"この路線の方が速い。", level:"intermediate" },
    { id:"t13", hanzi:"迷路", bopomofo:"ㄇㄧˊ ㄌㄨˋ", pinyin:"mí lù", meaning:"道に迷う", example:"我迷路了，可以幫我嗎？", exampleMeaning:"道に迷いました、助けてもらえますか？", level:"intermediate" },
    { id:"t14", hanzi:"左轉", bopomofo:"ㄗㄨㄛˇ ㄓㄨㄢˇ", pinyin:"zuǒ zhuǎn", meaning:"左に曲がる", example:"前面左轉就到了。", exampleMeaning:"前方を左に曲がれば着きます。", level:"beginner" },
    { id:"t15", hanzi:"右轉", bopomofo:"ㄧㄡˋ ㄓㄨㄢˇ", pinyin:"yòu zhuǎn", meaning:"右に曲がる", example:"在路口右轉。", exampleMeaning:"交差点を右に曲がって。", level:"beginner" },
  ],
  hotel: [
    { id:"h1", hanzi:"訂房", bopomofo:"ㄉㄧㄥˋ ㄈㄤˊ", pinyin:"dìng fáng", meaning:"部屋を予約する", example:"我有訂房。", exampleMeaning:"予約しています。", level:"beginner" },
    { id:"h2", hanzi:"入住", bopomofo:"ㄖㄨˋ ㄓㄨˋ", pinyin:"rù zhù", meaning:"チェックイン", example:"我要辦理入住。", exampleMeaning:"チェックインをお願いします。", level:"beginner" },
    { id:"h3", hanzi:"退房", bopomofo:"ㄊㄨㄟˋ ㄈㄤˊ", pinyin:"tuì fáng", meaning:"チェックアウト", example:"退房時間是中午十二點。", exampleMeaning:"チェックアウトは正午12時です。", level:"beginner" },
    { id:"h4", hanzi:"護照", bopomofo:"ㄏㄨˋ ㄓㄠˋ", pinyin:"hù zhào", meaning:"パスポート", example:"請出示護照。", exampleMeaning:"パスポートを提示してください。", level:"beginner" },
    { id:"h5", hanzi:"鑰匙", bopomofo:"ㄧㄠˋ ㄕˊ", pinyin:"yào shi", meaning:"鍵", example:"房間鑰匙在這裡。", exampleMeaning:"部屋の鍵はここです。", level:"beginner" },
    { id:"h6", hanzi:"房間", bopomofo:"ㄈㄤˊ ㄐㄧㄢ", pinyin:"fáng jiān", meaning:"部屋", example:"我的房間在五樓。", exampleMeaning:"私の部屋は5階です。", level:"beginner" },
    { id:"h7", hanzi:"雙人房", bopomofo:"ㄕㄨㄤ ㄖㄣˊ ㄈㄤˊ", pinyin:"shuāng rén fáng", meaning:"ツインルーム", example:"我要一間雙人房。", exampleMeaning:"ツインルームを一部屋お願いします。", level:"beginner" },
    { id:"h8", hanzi:"單人房", bopomofo:"ㄉㄢ ㄖㄣˊ ㄈㄤˊ", pinyin:"dān rén fáng", meaning:"シングルルーム", example:"還有單人房嗎？", exampleMeaning:"シングルルームはまだありますか？", level:"beginner" },
    { id:"h9", hanzi:"早餐", bopomofo:"ㄗㄠˇ ㄘㄢ", pinyin:"zǎo cān", meaning:"朝食", example:"有附早餐嗎？", exampleMeaning:"朝食は付きますか？", level:"beginner" },
    { id:"h10", hanzi:"冷氣", bopomofo:"ㄌㄥˇ ㄑㄧˋ", pinyin:"lěng qì", meaning:"エアコン", example:"冷氣壞了。", exampleMeaning:"エアコンが壊れています。", level:"beginner" },
    { id:"h11", hanzi:"毛巾", bopomofo:"ㄇㄠˊ ㄐㄧㄣ", pinyin:"máo jīn", meaning:"タオル", example:"可以多給我一條毛巾嗎？", exampleMeaning:"タオルをもう一枚もらえますか？", level:"intermediate" },
    { id:"h12", hanzi:"Wi-Fi密碼", bopomofo:"Wi-Fi ㄇㄧˋ ㄇㄚˇ", pinyin:"Wi-Fi mì mǎ", meaning:"Wi-Fiパスワード", example:"請問Wi-Fi密碼是什麼？", exampleMeaning:"Wi-Fiパスワードは何ですか？", level:"beginner" },
    { id:"h13", hanzi:"行李", bopomofo:"ㄒㄧㄥˊ ㄌㄧˇ", pinyin:"xíng lǐ", meaning:"荷物", example:"可以寄放行李嗎？", exampleMeaning:"荷物を預けられますか？", level:"intermediate" },
    { id:"h14", hanzi:"櫃台", bopomofo:"ㄍㄨㄟˋ ㄊㄞˊ", pinyin:"guì tái", meaning:"フロント", example:"請到櫃台辦理。", exampleMeaning:"フロントでお手続きください。", level:"intermediate" },
    { id:"h15", hanzi:"民宿", bopomofo:"ㄇㄧㄣˊ ㄙㄨˋ", pinyin:"mín sù", meaning:"民宿・B&B", example:"花蓮有很多特色民宿。", exampleMeaning:"花蓮には特色ある民宿がたくさんある。", level:"intermediate" },
  ],
  sightseeing: [
    { id:"ss1", hanzi:"景點", bopomofo:"ㄐㄧㄥˇ ㄉㄧㄢˇ", pinyin:"jǐng diǎn", meaning:"観光スポット", example:"台北有很多有名的景點。", exampleMeaning:"台北には有名な観光スポットが多い。", level:"beginner" },
    { id:"ss2", hanzi:"拍照", bopomofo:"ㄆㄞ ㄓㄠˋ", pinyin:"pāi zhào", meaning:"写真を撮る", example:"可以幫我拍照嗎？", exampleMeaning:"写真を撮ってもらえますか？", level:"beginner" },
    { id:"ss3", hanzi:"門票", bopomofo:"ㄇㄣˊ ㄆㄧㄠˋ", pinyin:"mén piào", meaning:"入場券", example:"門票多少錢？", exampleMeaning:"入場券はいくらですか？", level:"beginner" },
    { id:"ss4", hanzi:"好玩", bopomofo:"ㄏㄠˇ ㄨㄢˊ", pinyin:"hǎo wán", meaning:"楽しい・面白い", example:"台灣很好玩！", exampleMeaning:"台湾はとても楽しい！", level:"beginner" },
    { id:"ss5", hanzi:"風景", bopomofo:"ㄈㄥ ㄐㄧㄥˇ", pinyin:"fēng jǐng", meaning:"景色", example:"這裡的風景很漂亮。", exampleMeaning:"ここの景色はとても綺麗。", level:"beginner" },
    { id:"ss6", hanzi:"地圖", bopomofo:"ㄉㄧˋ ㄊㄨˊ", pinyin:"dì tú", meaning:"地図", example:"有沒有地圖？", exampleMeaning:"地図はありますか？", level:"beginner" },
    { id:"ss7", hanzi:"紀念品", bopomofo:"ㄐㄧˋ ㄋㄧㄢˋ ㄆㄧㄣˇ", pinyin:"jì niàn pǐn", meaning:"お土産", example:"我想買紀念品。", exampleMeaning:"お土産を買いたいです。", level:"beginner" },
    { id:"ss8", hanzi:"廟", bopomofo:"ㄇㄧㄠˋ", pinyin:"miào", meaning:"寺・廟", example:"龍山寺是有名的廟。", exampleMeaning:"龍山寺は有名なお寺です。", level:"beginner" },
    { id:"ss9", hanzi:"溫泉", bopomofo:"ㄨㄣ ㄑㄩㄢˊ", pinyin:"wēn quán", meaning:"温泉", example:"北投有很棒的溫泉。", exampleMeaning:"北投には素晴らしい温泉がある。", level:"intermediate" },
    { id:"ss10", hanzi:"爬山", bopomofo:"ㄆㄚˊ ㄕㄢ", pinyin:"pá shān", meaning:"山登り", example:"週末去爬山吧！", exampleMeaning:"週末に山登りに行こう！", level:"intermediate" },
    { id:"ss11", hanzi:"海邊", bopomofo:"ㄏㄞˇ ㄅㄧㄢ", pinyin:"hǎi biān", meaning:"海辺", example:"墾丁的海邊很美。", exampleMeaning:"墾丁の海辺はとても綺麗。", level:"beginner" },
    { id:"ss12", hanzi:"導遊", bopomofo:"ㄉㄠˇ ㄧㄡˊ", pinyin:"dǎo yóu", meaning:"ガイド", example:"需要導遊嗎？", exampleMeaning:"ガイドは必要ですか？", level:"intermediate" },
    { id:"ss13", hanzi:"打卡", bopomofo:"ㄉㄚˇ ㄎㄚˇ", pinyin:"dǎ kǎ", meaning:"チェックイン（SNS）", example:"這裡很適合打卡。", exampleMeaning:"ここはSNS映えする場所。", level:"intermediate" },
    { id:"ss14", hanzi:"排隊", bopomofo:"ㄆㄞˊ ㄉㄨㄟˋ", pinyin:"pái duì", meaning:"列に並ぶ", example:"要排隊排很久。", exampleMeaning:"長い行列に並ぶ必要がある。", level:"intermediate" },
    { id:"ss15", hanzi:"古蹟", bopomofo:"ㄍㄨˇ ㄐㄧ", pinyin:"gǔ jī", meaning:"史跡", example:"台南有很多古蹟。", exampleMeaning:"台南には史跡が多い。", level:"intermediate" },
  ],
  health: [
    { id:"he1", hanzi:"不舒服", bopomofo:"ㄅㄨˋ ㄕㄨ ㄈㄨˊ", pinyin:"bù shū fu", meaning:"具合が悪い", example:"我覺得不舒服。", exampleMeaning:"具合が悪いです。", level:"beginner" },
    { id:"he2", hanzi:"頭痛", bopomofo:"ㄊㄡˊ ㄊㄨㄥˋ", pinyin:"tóu tòng", meaning:"頭痛", example:"我頭很痛。", exampleMeaning:"頭がとても痛いです。", level:"beginner" },
    { id:"he3", hanzi:"肚子痛", bopomofo:"ㄉㄨˋ ㄗ˙ ㄊㄨㄥˋ", pinyin:"dù zi tòng", meaning:"腹痛", example:"我肚子痛。", exampleMeaning:"お腹が痛いです。", level:"beginner" },
    { id:"he4", hanzi:"發燒", bopomofo:"ㄈㄚ ㄕㄠ", pinyin:"fā shāo", meaning:"熱がある", example:"我有一點發燒。", exampleMeaning:"少し熱があります。", level:"beginner" },
    { id:"he5", hanzi:"感冒", bopomofo:"ㄍㄢˇ ㄇㄠˋ", pinyin:"gǎn mào", meaning:"風邪", example:"我感冒了。", exampleMeaning:"風邪をひきました。", level:"beginner" },
    { id:"he6", hanzi:"藥", bopomofo:"ㄧㄠˋ", pinyin:"yào", meaning:"薬", example:"要吃藥嗎？", exampleMeaning:"薬を飲む必要がありますか？", level:"beginner" },
    { id:"he7", hanzi:"醫院", bopomofo:"ㄧ ㄩㄢˋ", pinyin:"yī yuàn", meaning:"病院", example:"最近的醫院在哪裡？", exampleMeaning:"一番近い病院はどこですか？", level:"beginner" },
    { id:"he8", hanzi:"醫生", bopomofo:"ㄧ ㄕㄥ", pinyin:"yī shēng", meaning:"医者", example:"我要看醫生。", exampleMeaning:"医者に診てもらいたい。", level:"beginner" },
    { id:"he9", hanzi:"過敏", bopomofo:"ㄍㄨㄛˋ ㄇㄧㄣˇ", pinyin:"guò mǐn", meaning:"アレルギー", example:"我對海鮮過敏。", exampleMeaning:"海鮮アレルギーがあります。", level:"intermediate" },
    { id:"he10", hanzi:"拉肚子", bopomofo:"ㄌㄚ ㄉㄨˋ ㄗ˙", pinyin:"lā dù zi", meaning:"下痢をする", example:"我拉肚子了。", exampleMeaning:"お腹を壊しました。", level:"intermediate" },
    { id:"he11", hanzi:"咳嗽", bopomofo:"ㄎㄜˊ ㄙㄡˋ", pinyin:"ké sòu", meaning:"咳", example:"咳嗽很嚴重。", exampleMeaning:"咳がひどいです。", level:"intermediate" },
    { id:"he12", hanzi:"健保卡", bopomofo:"ㄐㄧㄢˋ ㄅㄠˇ ㄎㄚˇ", pinyin:"jiàn bǎo kǎ", meaning:"健康保険証", example:"有帶健保卡嗎？", exampleMeaning:"健康保険証は持っていますか？", level:"intermediate" },
    { id:"he13", hanzi:"藥局", bopomofo:"ㄧㄠˋ ㄐㄩˊ", pinyin:"yào jú", meaning:"薬局", example:"藥局在便利商店旁邊。", exampleMeaning:"薬局はコンビニの隣です。", level:"intermediate" },
    { id:"he14", hanzi:"休息", bopomofo:"ㄒㄧㄡ ㄒㄧˊ", pinyin:"xiū xi", meaning:"休む", example:"你應該多休息。", exampleMeaning:"もっと休んだ方がいいですよ。", level:"beginner" },
    { id:"he15", hanzi:"掛號", bopomofo:"ㄍㄨㄚˋ ㄏㄠˋ", pinyin:"guà hào", meaning:"受付をする（病院）", example:"請先去掛號。", exampleMeaning:"まず受付をしてください。", level:"intermediate" },
  ],
  emotions: [
    { id:"e1", hanzi:"開心", bopomofo:"ㄎㄞ ㄒㄧㄣ", pinyin:"kāi xīn", meaning:"嬉しい", example:"今天很開心！", exampleMeaning:"今日はとても嬉しい！", level:"beginner" },
    { id:"e2", hanzi:"難過", bopomofo:"ㄋㄢˊ ㄍㄨㄛˋ", pinyin:"nán guò", meaning:"悲しい", example:"聽到這個消息很難過。", exampleMeaning:"この知らせを聞いて悲しい。", level:"beginner" },
    { id:"e3", hanzi:"生氣", bopomofo:"ㄕㄥ ㄑㄧˋ", pinyin:"shēng qì", meaning:"怒る", example:"不要生氣了。", exampleMeaning:"もう怒らないで。", level:"beginner" },
    { id:"e4", hanzi:"害怕", bopomofo:"ㄏㄞˋ ㄆㄚˋ", pinyin:"hài pà", meaning:"怖い", example:"我很害怕。", exampleMeaning:"私はとても怖いです。", level:"beginner" },
    { id:"e5", hanzi:"厲害", bopomofo:"ㄌㄧˋ ㄏㄞˋ", pinyin:"lì hài", meaning:"すごい", example:"你好厲害！", exampleMeaning:"あなたはすごい！", level:"beginner" },
    { id:"e6", hanzi:"無聊", bopomofo:"ㄨˊ ㄌㄧㄠˊ", pinyin:"wú liáo", meaning:"退屈", example:"好無聊喔。", exampleMeaning:"つまらないなあ。", level:"beginner" },
    { id:"e7", hanzi:"緊張", bopomofo:"ㄐㄧㄣˇ ㄓㄤ", pinyin:"jǐn zhāng", meaning:"緊張する", example:"面試前很緊張。", exampleMeaning:"面接前はとても緊張する。", level:"intermediate" },
    { id:"e8", hanzi:"期待", bopomofo:"ㄑㄧˊ ㄉㄞˋ", pinyin:"qí dài", meaning:"楽しみにする", example:"很期待這次旅行！", exampleMeaning:"この旅行がとても楽しみ！", level:"intermediate" },
    { id:"e9", hanzi:"放心", bopomofo:"ㄈㄤˋ ㄒㄧㄣ", pinyin:"fàng xīn", meaning:"安心する", example:"你放心，沒問題的。", exampleMeaning:"安心して、大丈夫だよ。", level:"intermediate" },
    { id:"e10", hanzi:"羨慕", bopomofo:"ㄒㄧㄢˋ ㄇㄨˋ", pinyin:"xiàn mù", meaning:"うらやましい", example:"好羨慕你可以去台灣！", exampleMeaning:"台湾に行けるなんて羨ましい！", level:"intermediate" },
    { id:"e11", hanzi:"感動", bopomofo:"ㄍㄢˇ ㄉㄨㄥˋ", pinyin:"gǎn dòng", meaning:"感動する", example:"這部電影很感動。", exampleMeaning:"この映画はとても感動的。", level:"intermediate" },
    { id:"e12", hanzi:"煩惱", bopomofo:"ㄈㄢˊ ㄋㄠˇ", pinyin:"fán nǎo", meaning:"悩む", example:"最近有什麼煩惱嗎？", exampleMeaning:"最近何か悩みある？", level:"intermediate" },
    { id:"e13", hanzi:"加油", bopomofo:"ㄐㄧㄚ ㄧㄡˊ", pinyin:"jiā yóu", meaning:"頑張れ", example:"加油！你可以的！", exampleMeaning:"頑張れ！あなたならできる！", level:"beginner" },
    { id:"e14", hanzi:"幸福", bopomofo:"ㄒㄧㄥˋ ㄈㄨˊ", pinyin:"xìng fú", meaning:"幸せ", example:"希望你永遠幸福。", exampleMeaning:"ずっと幸せでいてね。", level:"intermediate" },
    { id:"e15", hanzi:"討厭", bopomofo:"ㄊㄠˇ ㄧㄢˋ", pinyin:"tǎo yàn", meaning:"嫌い・嫌だ", example:"我最討厭下雨天。", exampleMeaning:"雨の日が一番嫌い。", level:"intermediate" },
  ],
  daily: [
    { id:"d1", hanzi:"方便", bopomofo:"ㄈㄤ ㄅㄧㄢˋ", pinyin:"fāng biàn", meaning:"便利な", example:"台灣的生活很方便。", exampleMeaning:"台湾の生活はとても便利。", level:"beginner" },
    { id:"d2", hanzi:"便利商店", bopomofo:"ㄅㄧㄢˋ ㄌㄧˋ ㄕㄤ ㄉㄧㄢˋ", pinyin:"biàn lì shāng diàn", meaning:"コンビニ", example:"便利商店到處都有。", exampleMeaning:"コンビニはどこにでもある。", level:"beginner" },
    { id:"d3", hanzi:"洗手間", bopomofo:"ㄒㄧˇ ㄕㄡˇ ㄐㄧㄢ", pinyin:"xǐ shǒu jiān", meaning:"トイレ", example:"請問洗手間在哪裡？", exampleMeaning:"トイレはどこですか？", level:"beginner" },
    { id:"d4", hanzi:"天氣", bopomofo:"ㄊㄧㄢ ㄑㄧˋ", pinyin:"tiān qì", meaning:"天気", example:"今天天氣很好。", exampleMeaning:"今日はいい天気です。", level:"beginner" },
    { id:"d5", hanzi:"下雨", bopomofo:"ㄒㄧㄚˋ ㄩˇ", pinyin:"xià yǔ", meaning:"雨が降る", example:"下雨了，帶傘了嗎？", exampleMeaning:"雨が降ってきた、傘持ってる？", level:"beginner" },
    { id:"d6", hanzi:"熱", bopomofo:"ㄖㄜˋ", pinyin:"rè", meaning:"暑い", example:"台灣的夏天很熱。", exampleMeaning:"台湾の夏はとても暑い。", level:"beginner" },
    { id:"d7", hanzi:"習慣", bopomofo:"ㄒㄧˊ ㄍㄨㄢˋ", pinyin:"xí guàn", meaning:"慣れる・習慣", example:"你習慣台灣的生活了嗎？", exampleMeaning:"台湾の生活に慣れた？", level:"intermediate" },
    { id:"d8", hanzi:"手機", bopomofo:"ㄕㄡˇ ㄐㄧ", pinyin:"shǒu jī", meaning:"スマホ・携帯", example:"我手機沒電了。", exampleMeaning:"スマホの充電が切れた。", level:"beginner" },
    { id:"d9", hanzi:"充電", bopomofo:"ㄔㄨㄥ ㄉㄧㄢˋ", pinyin:"chōng diàn", meaning:"充電する", example:"哪裡可以充電？", exampleMeaning:"どこで充電できますか？", level:"beginner" },
    { id:"d10", hanzi:"垃圾", bopomofo:"ㄌㄜˋ ㄙㄜˋ", pinyin:"lè sè", meaning:"ゴミ", example:"垃圾要分類。", exampleMeaning:"ゴミは分別が必要です。", level:"intermediate" },
    { id:"d11", hanzi:"洗衣服", bopomofo:"ㄒㄧˇ ㄧ ㄈㄨˊ", pinyin:"xǐ yī fu", meaning:"洗濯する", example:"我要去洗衣服。", exampleMeaning:"洗濯しに行きます。", level:"beginner" },
    { id:"d12", hanzi:"鄰居", bopomofo:"ㄌㄧㄣˊ ㄐㄩ", pinyin:"lín jū", meaning:"隣人", example:"我的鄰居很友善。", exampleMeaning:"私の隣人はとても親切。", level:"intermediate" },
    { id:"d13", hanzi:"網路", bopomofo:"ㄨㄤˇ ㄌㄨˋ", pinyin:"wǎng lù", meaning:"インターネット", example:"這裡有網路嗎？", exampleMeaning:"ここはネット使えますか？", level:"beginner" },
    { id:"d14", hanzi:"超市", bopomofo:"ㄔㄠ ㄕˋ", pinyin:"chāo shì", meaning:"スーパー", example:"我去超市買東西。", exampleMeaning:"スーパーに買い物に行く。", level:"beginner" },
    { id:"d15", hanzi:"租房子", bopomofo:"ㄗㄨ ㄈㄤˊ ㄗ˙", pinyin:"zū fáng zi", meaning:"部屋を借りる", example:"在台北租房子很貴。", exampleMeaning:"台北で部屋を借りるのは高い。", level:"intermediate" },
  ],
  business: [
    { id:"b1", hanzi:"上班", bopomofo:"ㄕㄤˋ ㄅㄢ", pinyin:"shàng bān", meaning:"出勤する", example:"我每天九點上班。", exampleMeaning:"毎日9時に出勤します。", level:"beginner" },
    { id:"b2", hanzi:"下班", bopomofo:"ㄒㄧㄚˋ ㄅㄢ", pinyin:"xià bān", meaning:"退勤する", example:"你幾點下班？", exampleMeaning:"何時に退勤しますか？", level:"beginner" },
    { id:"b3", hanzi:"開會", bopomofo:"ㄎㄞ ㄏㄨㄟˋ", pinyin:"kāi huì", meaning:"会議をする", example:"下午要開會。", exampleMeaning:"午後に会議があります。", level:"beginner" },
    { id:"b4", hanzi:"同事", bopomofo:"ㄊㄨㄥˊ ㄕˋ", pinyin:"tóng shì", meaning:"同僚", example:"我的同事很友善。", exampleMeaning:"私の同僚はとても親切。", level:"beginner" },
    { id:"b5", hanzi:"老闆", bopomofo:"ㄌㄠˇ ㄅㄢˇ", pinyin:"lǎo bǎn", meaning:"社長・上司・店主", example:"老闆人很好。", exampleMeaning:"上司はいい人です。", level:"beginner" },
    { id:"b6", hanzi:"薪水", bopomofo:"ㄒㄧㄣ ㄕㄨㄟˇ", pinyin:"xīn shuǐ", meaning:"給料", example:"台灣的薪水跟日本比較低。", exampleMeaning:"台湾の給料は日本より低い。", level:"intermediate" },
    { id:"b7", hanzi:"請假", bopomofo:"ㄑㄧㄥˇ ㄐㄧㄚˋ", pinyin:"qǐng jià", meaning:"休みを取る", example:"我明天要請假。", exampleMeaning:"明日休みを取ります。", level:"intermediate" },
    { id:"b8", hanzi:"加班", bopomofo:"ㄐㄧㄚ ㄅㄢ", pinyin:"jiā bān", meaning:"残業する", example:"今天又要加班了。", exampleMeaning:"今日もまた残業だ。", level:"intermediate" },
    { id:"b9", hanzi:"名片", bopomofo:"ㄇㄧㄥˊ ㄆㄧㄢˋ", pinyin:"míng piàn", meaning:"名刺", example:"這是我的名片。", exampleMeaning:"これは私の名刺です。", level:"beginner" },
    { id:"b10", hanzi:"面試", bopomofo:"ㄇㄧㄢˋ ㄕˋ", pinyin:"miàn shì", meaning:"面接", example:"明天有面試。", exampleMeaning:"明日面接があります。", level:"intermediate" },
    { id:"b11", hanzi:"出差", bopomofo:"ㄔㄨ ㄔㄞ", pinyin:"chū chāi", meaning:"出張する", example:"下週要去台中出差。", exampleMeaning:"来週台中に出張します。", level:"intermediate" },
    { id:"b12", hanzi:"簡報", bopomofo:"ㄐㄧㄢˇ ㄅㄠˋ", pinyin:"jiǎn bào", meaning:"プレゼン", example:"我要準備簡報。", exampleMeaning:"プレゼンの準備をします。", level:"intermediate" },
    { id:"b13", hanzi:"合作", bopomofo:"ㄏㄜˊ ㄗㄨㄛˋ", pinyin:"hé zuò", meaning:"協力する", example:"期待跟你合作。", exampleMeaning:"協力できるのを楽しみにしています。", level:"intermediate" },
    { id:"b14", hanzi:"辭職", bopomofo:"ㄘˊ ㄓˊ", pinyin:"cí zhí", meaning:"辞職する", example:"他決定辭職了。", exampleMeaning:"彼は辞職を決めた。", level:"advanced" },
    { id:"b15", hanzi:"升遷", bopomofo:"ㄕㄥ ㄑㄧㄢ", pinyin:"shēng qiān", meaning:"昇進する", example:"恭喜你升遷！", exampleMeaning:"昇進おめでとう！", level:"advanced" },
  ],
  numbers: [
    { id:"n1", hanzi:"一", bopomofo:"ㄧ", pinyin:"yī", meaning:"1", example:"一杯咖啡。", exampleMeaning:"コーヒー一杯。", level:"beginner" },
    { id:"n2", hanzi:"十", bopomofo:"ㄕˊ", pinyin:"shí", meaning:"10", example:"十塊錢。", exampleMeaning:"10元。", level:"beginner" },
    { id:"n3", hanzi:"百", bopomofo:"ㄅㄞˇ", pinyin:"bǎi", meaning:"100", example:"三百塊。", exampleMeaning:"300元。", level:"beginner" },
    { id:"n4", hanzi:"千", bopomofo:"ㄑㄧㄢ", pinyin:"qiān", meaning:"1000", example:"一千塊台幣。", exampleMeaning:"1000台湾ドル。", level:"beginner" },
    { id:"n5", hanzi:"現在", bopomofo:"ㄒㄧㄢˋ ㄗㄞˋ", pinyin:"xiàn zài", meaning:"今", example:"現在幾點？", exampleMeaning:"今何時？", level:"beginner" },
    { id:"n6", hanzi:"幾點", bopomofo:"ㄐㄧˇ ㄉㄧㄢˇ", pinyin:"jǐ diǎn", meaning:"何時", example:"你幾點出門？", exampleMeaning:"何時に出かける？", level:"beginner" },
    { id:"n7", hanzi:"分鐘", bopomofo:"ㄈㄣ ㄓㄨㄥ", pinyin:"fēn zhōng", meaning:"分（時間）", example:"等我五分鐘。", exampleMeaning:"5分待って。", level:"beginner" },
    { id:"n8", hanzi:"小時", bopomofo:"ㄒㄧㄠˇ ㄕˊ", pinyin:"xiǎo shí", meaning:"時間", example:"坐高鐵大概一個小時。", exampleMeaning:"高鉄で約1時間。", level:"beginner" },
    { id:"n9", hanzi:"今天", bopomofo:"ㄐㄧㄣ ㄊㄧㄢ", pinyin:"jīn tiān", meaning:"今日", example:"今天星期幾？", exampleMeaning:"今日は何曜日？", level:"beginner" },
    { id:"n10", hanzi:"明天", bopomofo:"ㄇㄧㄥˊ ㄊㄧㄢ", pinyin:"míng tiān", meaning:"明日", example:"明天見！", exampleMeaning:"また明日！", level:"beginner" },
    { id:"n11", hanzi:"昨天", bopomofo:"ㄗㄨㄛˊ ㄊㄧㄢ", pinyin:"zuó tiān", meaning:"昨日", example:"昨天去了九份。", exampleMeaning:"昨日九份に行った。", level:"beginner" },
    { id:"n12", hanzi:"星期", bopomofo:"ㄒㄧㄥ ㄑㄧˊ", pinyin:"xīng qí", meaning:"曜日・週", example:"星期六有空嗎？", exampleMeaning:"土曜日空いてる？", level:"beginner" },
    { id:"n13", hanzi:"月", bopomofo:"ㄩㄝˋ", pinyin:"yuè", meaning:"月", example:"我三月去台灣。", exampleMeaning:"3月に台湾に行く。", level:"beginner" },
    { id:"n14", hanzi:"號", bopomofo:"ㄏㄠˋ", pinyin:"hào", meaning:"日（日付）", example:"今天幾月幾號？", exampleMeaning:"今日は何月何日？", level:"beginner" },
    { id:"n15", hanzi:"年", bopomofo:"ㄋㄧㄢˊ", pinyin:"nián", meaning:"年", example:"新年快樂！", exampleMeaning:"あけましておめでとう！", level:"beginner" },
    { id:"n16", hanzi:"半", bopomofo:"ㄅㄢˋ", pinyin:"bàn", meaning:"半分", example:"三點半。", exampleMeaning:"3時半。", level:"beginner" },
  ],
  idioms: [
    { id:"i1", hanzi:"入境隨俗", bopomofo:"ㄖㄨˋ ㄐㄧㄥˋ ㄙㄨㄟˊ ㄙㄨˊ", pinyin:"rù jìng suí sú", meaning:"郷に入っては郷に従え", example:"來台灣就要入境隨俗。", exampleMeaning:"台湾に来たら郷に従え。", level:"advanced" },
    { id:"i2", hanzi:"耳濡目染", bopomofo:"ㄦˇ ㄖㄨˊ ㄇㄨˋ ㄖㄢˇ", pinyin:"ěr rú mù rǎn", meaning:"見聞きして自然に身につく", example:"耳濡目染也學會了台語。", exampleMeaning:"自然と台湾語も覚えた。", level:"advanced" },
    { id:"i3", hanzi:"隨緣", bopomofo:"ㄙㄨㄟˊ ㄩㄢˊ", pinyin:"suí yuán", meaning:"成り行きに任せる", example:"感情的事就隨緣吧。", exampleMeaning:"恋愛は成り行きに任せよう。", level:"advanced" },
    { id:"i4", hanzi:"一舉兩得", bopomofo:"ㄧˋ ㄐㄩˇ ㄌㄧㄤˇ ㄉㄜˊ", pinyin:"yì jǔ liǎng dé", meaning:"一石二鳥", example:"這樣做可以一舉兩得。", exampleMeaning:"こうすれば一石二鳥だ。", level:"advanced" },
    { id:"i5", hanzi:"半途而廢", bopomofo:"ㄅㄢˋ ㄊㄨˊ ㄦˊ ㄈㄟˋ", pinyin:"bàn tú ér fèi", meaning:"途中で投げ出す", example:"學中文不能半途而廢。", exampleMeaning:"中国語学習は途中で投げ出してはいけない。", level:"advanced" },
    { id:"i6", hanzi:"塞翁失馬", bopomofo:"ㄙㄞˋ ㄨㄥ ㄕ ㄇㄚˇ", pinyin:"sài wēng shī mǎ", meaning:"人間万事塞翁が馬", example:"塞翁失馬，焉知非福。", exampleMeaning:"禍福はあざなえる縄の如し。", level:"advanced" },
    { id:"i7", hanzi:"差不多", bopomofo:"ㄔㄚˋ ㄅㄨˋ ㄉㄨㄛ", pinyin:"chà bù duō", meaning:"だいたい・ほぼ同じ", example:"差不多可以了。", exampleMeaning:"だいたい大丈夫です。", level:"intermediate" },
    { id:"i8", hanzi:"馬馬虎虎", bopomofo:"ㄇㄚˇ ㄇㄚˇ ㄏㄨ ㄏㄨ", pinyin:"mǎ mǎ hū hū", meaning:"まあまあ", example:"最近怎麼樣？馬馬虎虎。", exampleMeaning:"最近どう？まあまあだよ。", level:"intermediate" },
    { id:"i9", hanzi:"不知不覺", bopomofo:"ㄅㄨˋ ㄓ ㄅㄨˋ ㄐㄩㄝˊ", pinyin:"bù zhī bù jué", meaning:"知らず知らずのうちに", example:"不知不覺就到了。", exampleMeaning:"知らないうちに着いた。", level:"intermediate" },
    { id:"i10", hanzi:"自言自語", bopomofo:"ㄗˋ ㄧㄢˊ ㄗˋ ㄩˇ", pinyin:"zì yán zì yǔ", meaning:"独り言", example:"他常常自言自語。", exampleMeaning:"彼はよく独り言を言う。", level:"intermediate" },
    { id:"i11", hanzi:"亂七八糟", bopomofo:"ㄌㄨㄢˋ ㄑㄧ ㄅㄚ ㄗㄠ", pinyin:"luàn qī bā zāo", meaning:"めちゃくちゃ", example:"房間亂七八糟的。", exampleMeaning:"部屋がめちゃくちゃだ。", level:"intermediate" },
    { id:"i12", hanzi:"莫名其妙", bopomofo:"ㄇㄛˋ ㄇㄧㄥˊ ㄑㄧˊ ㄇㄧㄠˋ", pinyin:"mò míng qí miào", meaning:"わけがわからない", example:"他說的話莫名其妙。", exampleMeaning:"彼の言うことは意味不明だ。", level:"advanced" },
    { id:"i13", hanzi:"恍然大悟", bopomofo:"ㄏㄨㄤˇ ㄖㄢˊ ㄉㄚˋ ㄨˋ", pinyin:"huǎng rán dà wù", meaning:"はっと悟る", example:"聽完解釋後恍然大悟。", exampleMeaning:"説明を聞いてはっと悟った。", level:"advanced" },
    { id:"i14", hanzi:"七嘴八舌", bopomofo:"ㄑㄧ ㄗㄨㄟˇ ㄅㄚ ㄕㄜˊ", pinyin:"qī zuǐ bā shé", meaning:"口々に言う", example:"大家七嘴八舌地討論。", exampleMeaning:"みんなが口々に議論した。", level:"advanced" },
    { id:"i15", hanzi:"刻骨銘心", bopomofo:"ㄎㄜˋ ㄍㄨˇ ㄇㄧㄥˊ ㄒㄧㄣ", pinyin:"kè gǔ míng xīn", meaning:"骨身にしみる・忘れがたい", example:"這是一段刻骨銘心的回憶。", exampleMeaning:"これは忘れがたい思い出だ。", level:"advanced" },
  ],
};

function getAllWords() { return Object.values(VOCAB_BY_CAT).flat(); }

const PHRASE_SCENARIOS = [
  { id:"nightmarket", icon:"🏮", title:"夜市で食べ歩き", titleZh:"逛夜市", level:"beginner", color:"#e74c3c", description:"夜市での注文・値段交渉",
    dialogues:[
      { speaker:"you", hanzi:"老闆，這個多少錢？", bopomofo:"ㄌㄠˇ ㄅㄢˇ，ㄓㄜˋ ㄍㄜˋ ㄉㄨㄛ ㄕㄠˇ ㄑㄧㄢˊ？", pinyin:"lǎo bǎn, zhè ge duō shǎo qián?", meaning:"店長さん、これいくらですか？" },
      { speaker:"other", hanzi:"一份五十塊。", bopomofo:"ㄧˋ ㄈㄣˋ ㄨˇ ㄕˊ ㄎㄨㄞˋ。", pinyin:"yí fèn wǔ shí kuài.", meaning:"一つ50元です。" },
      { speaker:"you", hanzi:"好，我要一份。", bopomofo:"ㄏㄠˇ，ㄨㄛˇ ㄧㄠˋ ㄧˋ ㄈㄣˋ。", pinyin:"hǎo, wǒ yào yí fèn.", meaning:"じゃあ、一つください。" },
      { speaker:"other", hanzi:"要不要加辣？", bopomofo:"ㄧㄠˋ ㄅㄨˊ ㄧㄠˋ ㄐㄧㄚ ㄌㄚˋ？", pinyin:"yào bú yào jiā là?", meaning:"辛くしますか？" },
      { speaker:"you", hanzi:"小辣就好，謝謝！", bopomofo:"ㄒㄧㄠˇ ㄌㄚˋ ㄐㄧㄡˋ ㄏㄠˇ，ㄒㄧㄝˋ ㄒㄧㄝˋ！", pinyin:"xiǎo là jiù hǎo, xiè xie!", meaning:"少し辛くして、ありがとう！" },
    ],
    keyPhrases:[
      { hanzi:"多少錢？", meaning:"いくらですか？", note:"値段を聞く定番" },
      { hanzi:"我要⋯", meaning:"〜をください", note:"注文の基本形" },
      { hanzi:"要不要⋯？", meaning:"〜しますか？", note:"Yes/No質問" },
      { hanzi:"⋯就好", meaning:"〜でいいです", note:"控えめに希望を伝える" },
    ],
  },
  { id:"bubbletea", icon:"🧋", title:"ドリンクを注文", titleZh:"點飲料", level:"beginner", color:"#f39c12", description:"ドリンクスタンドでの注文",
    dialogues:[
      { speaker:"other", hanzi:"歡迎光臨！請問要喝什麼？", bopomofo:"ㄏㄨㄢ ㄧㄥˊ ㄍㄨㄤ ㄌㄧㄣˊ！ㄑㄧㄥˇ ㄨㄣˋ ㄧㄠˋ ㄏㄜ ㄕㄣˊ ㄇㄜ˙？", pinyin:"huān yíng guāng lín! qǐng wèn yào hē shén me?", meaning:"いらっしゃいませ！何を飲みますか？" },
      { speaker:"you", hanzi:"我要一杯珍珠奶茶。", bopomofo:"ㄨㄛˇ ㄧㄠˋ ㄧˋ ㄅㄟ ㄓㄣ ㄓㄨ ㄋㄞˇ ㄔㄚˊ。", pinyin:"wǒ yào yì bēi zhēn zhū nǎi chá.", meaning:"タピオカミルクティーを一杯ください。" },
      { speaker:"other", hanzi:"甜度冰塊呢？", bopomofo:"ㄊㄧㄢˊ ㄉㄨˋ ㄅㄧㄥ ㄎㄨㄞˋ ㄋㄜ˙？", pinyin:"tián dù bīng kuài ne?", meaning:"甘さと氷の量は？" },
      { speaker:"you", hanzi:"半糖少冰，謝謝。", bopomofo:"ㄅㄢˋ ㄊㄤˊ ㄕㄠˇ ㄅㄧㄥ，ㄒㄧㄝˋ ㄒㄧㄝˋ。", pinyin:"bàn táng shǎo bīng, xiè xie.", meaning:"半糖・氷少なめで。" },
      { speaker:"other", hanzi:"好的，請稍等。", bopomofo:"ㄏㄠˇ ㄉㄜ˙，ㄑㄧㄥˇ ㄕㄠ ㄉㄥˇ。", pinyin:"hǎo de, qǐng shāo děng.", meaning:"かしこまりました、少々お待ちください。" },
    ],
    keyPhrases:[
      { hanzi:"甜度", meaning:"甘さの度合い", note:"全糖/半糖/微糖/無糖" },
      { hanzi:"冰塊", meaning:"氷の量", note:"正常冰/少冰/去冰/溫/熱" },
      { hanzi:"請稍等", meaning:"少々お待ちください", note:"丁寧な表現" },
    ],
  },
  { id:"mrt", icon:"🚇", title:"MRTに乗る", titleZh:"搭捷運", level:"beginner", color:"#3498db", description:"地下鉄での道案内",
    dialogues:[
      { speaker:"you", hanzi:"不好意思，請問台北101怎麼去？", bopomofo:"ㄅㄨˋ ㄏㄠˇ ㄧˋ ㄙ˙，ㄑㄧㄥˇ ㄨㄣˋ ㄊㄞˊ ㄅㄟˇ ㄧ ㄌㄧㄥˊ ㄧ ㄗㄣˇ ㄇㄜ˙ ㄑㄩˋ？", pinyin:"bù hǎo yì si, qǐng wèn Táiběi yī líng yī zěn me qù?", meaning:"すみません、台北101にはどう行きますか？" },
      { speaker:"other", hanzi:"搭紅線到台北101站就到了。", bopomofo:"ㄉㄚ ㄏㄨㄥˊ ㄒㄧㄢˋ ㄉㄠˋ ㄊㄞˊ ㄅㄟˇ ㄧ ㄌㄧㄥˊ ㄧ ㄓㄢˋ ㄐㄧㄡˋ ㄉㄠˋ ㄌㄜ˙。", pinyin:"dā hóng xiàn dào Táiběi yī líng yī zhàn jiù dào le.", meaning:"赤線で台北101駅まで行けば着きます。" },
      { speaker:"you", hanzi:"需要轉車嗎？", bopomofo:"ㄒㄩ ㄧㄠˋ ㄓㄨㄢˇ ㄔㄜ ㄇㄚ˙？", pinyin:"xū yào zhuǎn chē ma?", meaning:"乗り換えは必要ですか？" },
      { speaker:"other", hanzi:"不用，直接到就可以了。", bopomofo:"ㄅㄨˊ ㄩㄥˋ，ㄓˊ ㄐㄧㄝ ㄉㄠˋ ㄐㄧㄡˋ ㄎㄜˇ ㄧˇ ㄌㄜ˙。", pinyin:"bú yòng, zhí jiē dào jiù kě yǐ le.", meaning:"いりません、直接行けますよ。" },
    ],
    keyPhrases:[
      { hanzi:"⋯怎麼去？", meaning:"〜にはどう行きますか？", note:"道を聞く定番" },
      { hanzi:"搭⋯線", meaning:"〜線に乗る", note:"紅線、藍線、綠線など" },
      { hanzi:"轉車", meaning:"乗り換え", note:"需要轉車嗎？" },
    ],
  },
  { id:"hotel", icon:"🏨", title:"ホテルでチェックイン", titleZh:"飯店入住", level:"intermediate", color:"#9b59b6", description:"チェックイン・リクエスト",
    dialogues:[
      { speaker:"you", hanzi:"你好，我有訂房，姓田中。", bopomofo:"ㄋㄧˇ ㄏㄠˇ，ㄨㄛˇ ㄧㄡˇ ㄉㄧㄥˋ ㄈㄤˊ，ㄒㄧㄥˋ ㄊㄧㄢˊ ㄓㄨㄥ。", pinyin:"nǐ hǎo, wǒ yǒu dìng fáng, xìng Tián zhōng.", meaning:"こんにちは、予約しています。田中です。" },
      { speaker:"other", hanzi:"好的，請給我看一下護照。", bopomofo:"ㄏㄠˇ ㄉㄜ˙，ㄑㄧㄥˇ ㄍㄟˇ ㄨㄛˇ ㄎㄢˋ ㄧˊ ㄒㄧㄚˋ ㄏㄨˋ ㄓㄠˋ。", pinyin:"hǎo de, qǐng gěi wǒ kàn yí xià hù zhào.", meaning:"かしこまりました、パスポートを見せてください。" },
      { speaker:"you", hanzi:"請問退房是幾點？", bopomofo:"ㄑㄧㄥˇ ㄨㄣˋ ㄊㄨㄟˋ ㄈㄤˊ ㄕˋ ㄐㄧˇ ㄉㄧㄢˇ？", pinyin:"qǐng wèn tuì fáng shì jǐ diǎn?", meaning:"チェックアウトは何時ですか？" },
      { speaker:"other", hanzi:"中午十二點以前。", bopomofo:"ㄓㄨㄥ ㄨˇ ㄕˊ ㄦˋ ㄉㄧㄢˇ ㄧˇ ㄑㄧㄢˊ。", pinyin:"zhōng wǔ shí èr diǎn yǐ qián.", meaning:"お昼の12時までです。" },
    ],
    keyPhrases:[
      { hanzi:"我有訂房", meaning:"予約しています", note:"チェックイン時の定番" },
      { hanzi:"護照", meaning:"パスポート", note:"台湾では護照と言う" },
      { hanzi:"退房", meaning:"チェックアウト", note:"入住＝チェックイン" },
    ],
  },
  { id:"bargain", icon:"🛍️", title:"市場で値切る", titleZh:"殺價", level:"advanced", color:"#e67e22", description:"伝統市場での値段交渉",
    dialogues:[
      { speaker:"you", hanzi:"老闆，這件衣服怎麼賣？", bopomofo:"ㄌㄠˇ ㄅㄢˇ，ㄓㄜˋ ㄐㄧㄢˋ ㄧ ㄈㄨˊ ㄗㄣˇ ㄇㄜ˙ ㄇㄞˋ？", pinyin:"lǎo bǎn, zhè jiàn yī fu zěn me mài?", meaning:"この服はいくらですか？" },
      { speaker:"other", hanzi:"算你八百。", bopomofo:"ㄙㄨㄢˋ ㄋㄧˇ ㄅㄚ ㄅㄞˇ。", pinyin:"suàn nǐ bā bǎi.", meaning:"800元にしてあげる。" },
      { speaker:"you", hanzi:"太貴了！可以算便宜一點嗎？", bopomofo:"ㄊㄞˋ ㄍㄨㄟˋ ㄌㄜ˙！ㄎㄜˇ ㄧˇ ㄙㄨㄢˋ ㄆㄧㄢˊ ㄧˊ ㄧˋ ㄉㄧㄢˇ ㄇㄚ˙？", pinyin:"tài guì le! kě yǐ suàn pián yi yì diǎn ma?", meaning:"高すぎ！安くなりませんか？" },
      { speaker:"other", hanzi:"好啦好啦，六百五給你。", bopomofo:"ㄏㄠˇ ㄌㄚ˙ ㄏㄠˇ ㄌㄚ˙，ㄌㄧㄡˋ ㄅㄞˇ ㄨˇ ㄍㄟˇ ㄋㄧˇ。", pinyin:"hǎo la hǎo la, liù bǎi wǔ gěi nǐ.", meaning:"わかった、650元でいいよ。" },
    ],
    keyPhrases:[
      { hanzi:"怎麼賣？", meaning:"いくら？（市場風）", note:"多少錢よりカジュアル" },
      { hanzi:"太貴了", meaning:"高すぎる", note:"値切りの第一歩" },
      { hanzi:"算便宜一點", meaning:"もう少し安くして", note:"値切りの決まり文句" },
    ],
  },
  { id:"restaurant", icon:"🍽️", title:"レストランで注文", titleZh:"餐廳點餐", level:"beginner", color:"#1abc9c", description:"着席・注文・会計",
    dialogues:[
      { speaker:"you", hanzi:"請問有位子嗎？兩位。", bopomofo:"ㄑㄧㄥˇ ㄨㄣˋ ㄧㄡˇ ㄨㄟˋ ㄗ˙ ㄇㄚ˙？ㄌㄧㄤˇ ㄨㄟˋ。", pinyin:"qǐng wèn yǒu wèi zi ma? liǎng wèi.", meaning:"席はありますか？二人です。" },
      { speaker:"other", hanzi:"有的，這邊請。", bopomofo:"ㄧㄡˇ ㄉㄜ˙，ㄓㄜˋ ㄅㄧㄢ ㄑㄧㄥˇ。", pinyin:"yǒu de, zhè biān qǐng.", meaning:"ございます、こちらへどうぞ。" },
      { speaker:"you", hanzi:"我要一碗牛肉麵，還有一盤小菜。", bopomofo:"ㄨㄛˇ ㄧㄠˋ ㄧˋ ㄨㄢˇ ㄋㄧㄡˊ ㄖㄡˋ ㄇㄧㄢˋ，ㄏㄞˊ ㄧㄡˇ ㄧˋ ㄆㄢˊ ㄒㄧㄠˇ ㄘㄞˋ。", pinyin:"wǒ yào yì wǎn niú ròu miàn, hái yǒu yì pán xiǎo cài.", meaning:"牛肉麺を一杯と、小皿料理を一つください。" },
      { speaker:"you", hanzi:"可以結帳嗎？", bopomofo:"ㄎㄜˇ ㄧˇ ㄐㄧㄝˊ ㄓㄤˋ ㄇㄚ˙？", pinyin:"kě yǐ jié zhàng ma?", meaning:"お会計お願いします。" },
      { speaker:"other", hanzi:"一共兩百五十塊。", bopomofo:"ㄧˋ ㄍㄨㄥˋ ㄌㄧㄤˇ ㄅㄞˇ ㄨˇ ㄕˊ ㄎㄨㄞˋ。", pinyin:"yí gòng liǎng bǎi wǔ shí kuài.", meaning:"合計250元です。" },
    ],
    keyPhrases:[
      { hanzi:"有位子嗎？", meaning:"席はありますか？", note:"入店時の定番" },
      { hanzi:"結帳", meaning:"お会計", note:"買單も同じ意味" },
      { hanzi:"一共⋯", meaning:"合計〜", note:"金額を伝える時" },
    ],
  },
  { id:"doctor", icon:"🏥", title:"病院で受診", titleZh:"看醫生", level:"intermediate", color:"#c0392b", description:"症状を伝える・薬をもらう",
    dialogues:[
      { speaker:"other", hanzi:"你哪裡不舒服？", bopomofo:"ㄋㄧˇ ㄋㄚˇ ㄌㄧˇ ㄅㄨˋ ㄕㄨ ㄈㄨˊ？", pinyin:"nǐ nǎ lǐ bù shū fu?", meaning:"どこが具合悪いですか？" },
      { speaker:"you", hanzi:"我頭痛，而且有一點發燒。", bopomofo:"ㄨㄛˇ ㄊㄡˊ ㄊㄨㄥˋ，ㄦˊ ㄑㄧㄝˇ ㄧㄡˇ ㄧˋ ㄉㄧㄢˇ ㄈㄚ ㄕㄠ。", pinyin:"wǒ tóu tòng, ér qiě yǒu yì diǎn fā shāo.", meaning:"頭が痛くて、少し熱もあります。" },
      { speaker:"other", hanzi:"從什麼時候開始的？", bopomofo:"ㄘㄨㄥˊ ㄕㄣˊ ㄇㄜ˙ ㄕˊ ㄏㄡˋ ㄎㄞ ㄕˇ ㄉㄜ˙？", pinyin:"cóng shén me shí hòu kāi shǐ de?", meaning:"いつから始まりましたか？" },
      { speaker:"you", hanzi:"昨天晚上開始的。", bopomofo:"ㄗㄨㄛˊ ㄊㄧㄢ ㄨㄢˇ ㄕㄤˋ ㄎㄞ ㄕˇ ㄉㄜ˙。", pinyin:"zuó tiān wǎn shàng kāi shǐ de.", meaning:"昨日の夜からです。" },
      { speaker:"other", hanzi:"我開藥給你，一天吃三次。", bopomofo:"ㄨㄛˇ ㄎㄞ ㄧㄠˋ ㄍㄟˇ ㄋㄧˇ，ㄧˋ ㄊㄧㄢ ㄔ ㄙㄢ ㄘˋ。", pinyin:"wǒ kāi yào gěi nǐ, yì tiān chī sān cì.", meaning:"薬を出します、1日3回飲んでください。" },
    ],
    keyPhrases:[
      { hanzi:"不舒服", meaning:"具合が悪い", note:"体調不良の基本" },
      { hanzi:"發燒", meaning:"熱がある", note:"台湾でよく使う" },
      { hanzi:"開藥", meaning:"薬を処方する", note:"醫生幫你開藥" },
    ],
  },
  { id:"taxi", icon:"🚕", title:"タクシーに乗る", titleZh:"搭計程車", level:"beginner", color:"#f1c40f", description:"行き先を伝える・料金確認",
    dialogues:[
      { speaker:"you", hanzi:"你好，我要去台北車站。", bopomofo:"ㄋㄧˇ ㄏㄠˇ，ㄨㄛˇ ㄧㄠˋ ㄑㄩˋ ㄊㄞˊ ㄅㄟˇ ㄔㄜ ㄓㄢˋ。", pinyin:"nǐ hǎo, wǒ yào qù Táiběi chē zhàn.", meaning:"台北駅までお願いします。" },
      { speaker:"other", hanzi:"好，大概十五分鐘。", bopomofo:"ㄏㄠˇ，ㄉㄚˋ ㄍㄞˋ ㄕˊ ㄨˇ ㄈㄣ ㄓㄨㄥ。", pinyin:"hǎo, dà gài shí wǔ fēn zhōng.", meaning:"わかりました、約15分です。" },
      { speaker:"you", hanzi:"可以開快一點嗎？我趕時間。", bopomofo:"ㄎㄜˇ ㄧˇ ㄎㄞ ㄎㄨㄞˋ ㄧˋ ㄉㄧㄢˇ ㄇㄚ˙？ㄨㄛˇ ㄍㄢˇ ㄕˊ ㄐㄧㄢ。", pinyin:"kě yǐ kāi kuài yì diǎn ma? wǒ gǎn shí jiān.", meaning:"少し急いでもらえますか？急いでいます。" },
      { speaker:"you", hanzi:"到了，多少錢？", bopomofo:"ㄉㄠˋ ㄌㄜ˙，ㄉㄨㄛ ㄕㄠˇ ㄑㄧㄢˊ？", pinyin:"dào le, duō shǎo qián?", meaning:"着きました、いくらですか？" },
      { speaker:"other", hanzi:"一百八十塊。", bopomofo:"ㄧˋ ㄅㄞˇ ㄅㄚ ㄕˊ ㄎㄨㄞˋ。", pinyin:"yì bǎi bā shí kuài.", meaning:"180元です。" },
    ],
    keyPhrases:[
      { hanzi:"我要去⋯", meaning:"〜に行きたい", note:"行き先を伝える" },
      { hanzi:"大概⋯分鐘", meaning:"約〜分", note:"所要時間" },
      { hanzi:"趕時間", meaning:"急いでいる", note:"便利な表現" },
    ],
  },
  { id:"photo", icon:"📸", title:"写真を撮ってもらう", titleZh:"請人拍照", level:"beginner", color:"#2ecc71", description:"観光地でのお願い",
    dialogues:[
      { speaker:"you", hanzi:"不好意思，可以幫我們拍照嗎？", bopomofo:"ㄅㄨˋ ㄏㄠˇ ㄧˋ ㄙ˙，ㄎㄜˇ ㄧˇ ㄅㄤ ㄨㄛˇ ㄇㄣ˙ ㄆㄞ ㄓㄠˋ ㄇㄚ˙？", pinyin:"bù hǎo yì si, kě yǐ bāng wǒ men pāi zhào ma?", meaning:"すみません、写真を撮ってもらえますか？" },
      { speaker:"other", hanzi:"當然可以！按哪裡？", bopomofo:"ㄉㄤ ㄖㄢˊ ㄎㄜˇ ㄧˇ！ㄢˋ ㄋㄚˇ ㄌㄧˇ？", pinyin:"dāng rán kě yǐ! àn nǎ lǐ?", meaning:"もちろん！どこを押せばいいですか？" },
      { speaker:"you", hanzi:"按這個就好了，謝謝！", bopomofo:"ㄢˋ ㄓㄜˋ ㄍㄜˋ ㄐㄧㄡˋ ㄏㄠˇ ㄌㄜ˙，ㄒㄧㄝˋ ㄒㄧㄝˋ！", pinyin:"àn zhè ge jiù hǎo le, xiè xie!", meaning:"ここを押すだけです、ありがとう！" },
      { speaker:"other", hanzi:"一、二、三！好了！", bopomofo:"ㄧ、ㄦˋ、ㄙㄢ！ㄏㄠˇ ㄌㄜ˙！", pinyin:"yī, èr, sān! hǎo le!", meaning:"1、2、3！撮れました！" },
    ],
    keyPhrases:[
      { hanzi:"可以幫我⋯嗎？", meaning:"〜してもらえますか？", note:"お願いの丁寧表現" },
      { hanzi:"拍照", meaning:"写真を撮る", note:"自拍＝自撮り" },
      { hanzi:"按", meaning:"押す", note:"ボタンを押す時" },
    ],
  },
  { id:"friends", icon:"🤝", title:"友達と予定を立てる", titleZh:"跟朋友約", level:"intermediate", color:"#8e44ad", description:"誘い・待ち合わせ",
    dialogues:[
      { speaker:"you", hanzi:"你週末有空嗎？", bopomofo:"ㄋㄧˇ ㄓㄡ ㄇㄛˋ ㄧㄡˇ ㄎㄨㄥˋ ㄇㄚ˙？", pinyin:"nǐ zhōu mò yǒu kòng ma?", meaning:"週末空いてる？" },
      { speaker:"other", hanzi:"有啊，你想做什麼？", bopomofo:"ㄧㄡˇ ㄚ˙，ㄋㄧˇ ㄒㄧㄤˇ ㄗㄨㄛˋ ㄕㄣˊ ㄇㄜ˙？", pinyin:"yǒu a, nǐ xiǎng zuò shén me?", meaning:"空いてるよ、何したい？" },
      { speaker:"you", hanzi:"我們去九份玩吧！", bopomofo:"ㄨㄛˇ ㄇㄣ˙ ㄑㄩˋ ㄐㄧㄡˇ ㄈㄣˋ ㄨㄢˊ ㄅㄚ˙！", pinyin:"wǒ men qù Jiǔ fèn wán ba!", meaning:"九份に遊びに行こう！" },
      { speaker:"other", hanzi:"好啊！幾點在哪裡見面？", bopomofo:"ㄏㄠˇ ㄚ˙！ㄐㄧˇ ㄉㄧㄢˇ ㄗㄞˋ ㄋㄚˇ ㄌㄧˇ ㄐㄧㄢˋ ㄇㄧㄢˋ？", pinyin:"hǎo a! jǐ diǎn zài nǎ lǐ jiàn miàn?", meaning:"いいね！何時にどこで待ち合わせ？" },
      { speaker:"you", hanzi:"早上十點在台北車站，好不好？", bopomofo:"ㄗㄠˇ ㄕㄤˋ ㄕˊ ㄉㄧㄢˇ ㄗㄞˋ ㄊㄞˊ ㄅㄟˇ ㄔㄜ ㄓㄢˋ，ㄏㄠˇ ㄅㄨˋ ㄏㄠˇ？", pinyin:"zǎo shàng shí diǎn zài Táiběi chē zhàn, hǎo bù hǎo?", meaning:"朝10時に台北駅で、どう？" },
    ],
    keyPhrases:[
      { hanzi:"有空嗎？", meaning:"空いてる？", note:"誘う時の定番" },
      { hanzi:"⋯吧！", meaning:"〜しよう！", note:"提案・誘い" },
      { hanzi:"見面", meaning:"会う", note:"在哪裡見面？" },
      { hanzi:"好不好？", meaning:"どう？いい？", note:"確認を求める" },
    ],
  },
  { id:"phone", icon:"📱", title:"電話でレストラン予約", titleZh:"電話訂位", level:"intermediate", color:"#34495e", description:"電話での予約・確認",
    dialogues:[
      { speaker:"other", hanzi:"你好，鼎泰豐，請問幾位？", bopomofo:"ㄋㄧˇ ㄏㄠˇ，ㄉㄧㄥˇ ㄊㄞˋ ㄈㄥ，ㄑㄧㄥˇ ㄨㄣˋ ㄐㄧˇ ㄨㄟˋ？", pinyin:"nǐ hǎo, Dǐng tài fēng, qǐng wèn jǐ wèi?", meaning:"鼎泰豊です、何名様ですか？" },
      { speaker:"you", hanzi:"我要訂位，四個人，明天晚上七點。", bopomofo:"ㄨㄛˇ ㄧㄠˋ ㄉㄧㄥˋ ㄨㄟˋ，ㄙˋ ㄍㄜˋ ㄖㄣˊ，ㄇㄧㄥˊ ㄊㄧㄢ ㄨㄢˇ ㄕㄤˋ ㄑㄧ ㄉㄧㄢˇ。", pinyin:"wǒ yào dìng wèi, sì ge rén, míng tiān wǎn shàng qī diǎn.", meaning:"予約したいです、4人で明日の夜7時。" },
      { speaker:"other", hanzi:"好的，請問貴姓？", bopomofo:"ㄏㄠˇ ㄉㄜ˙，ㄑㄧㄥˇ ㄨㄣˋ ㄍㄨㄟˋ ㄒㄧㄥˋ？", pinyin:"hǎo de, qǐng wèn guì xìng?", meaning:"かしこまりました、お名前は？" },
      { speaker:"you", hanzi:"我姓田中。", bopomofo:"ㄨㄛˇ ㄒㄧㄥˋ ㄊㄧㄢˊ ㄓㄨㄥ。", pinyin:"wǒ xìng Tián zhōng.", meaning:"田中です。" },
    ],
    keyPhrases:[
      { hanzi:"訂位", meaning:"予約する", note:"レストラン予約" },
      { hanzi:"幾位？", meaning:"何名様？", note:"店員が聞く表現" },
      { hanzi:"貴姓？", meaning:"お名前は？", note:"丁寧な聞き方" },
    ],
  },
  { id:"lost", icon:"😰", title:"道に迷った", titleZh:"迷路了", level:"intermediate", color:"#e74c3c", description:"道を尋ねる・助けを求める",
    dialogues:[
      { speaker:"you", hanzi:"不好意思，我迷路了。", bopomofo:"ㄅㄨˋ ㄏㄠˇ ㄧˋ ㄙ˙，ㄨㄛˇ ㄇㄧˊ ㄌㄨˋ ㄌㄜ˙。", pinyin:"bù hǎo yì si, wǒ mí lù le.", meaning:"すみません、道に迷いました。" },
      { speaker:"other", hanzi:"你要去哪裡？", bopomofo:"ㄋㄧˇ ㄧㄠˋ ㄑㄩˋ ㄋㄚˇ ㄌㄧˇ？", pinyin:"nǐ yào qù nǎ lǐ?", meaning:"どこに行きたいですか？" },
      { speaker:"you", hanzi:"我要去龍山寺。", bopomofo:"ㄨㄛˇ ㄧㄠˋ ㄑㄩˋ ㄌㄨㄥˊ ㄕㄢ ㄙˋ。", pinyin:"wǒ yào qù Lóng shān sì.", meaning:"龍山寺に行きたいです。" },
      { speaker:"other", hanzi:"往前走，到路口左轉就到了。", bopomofo:"ㄨㄤˇ ㄑㄧㄢˊ ㄗㄡˇ，ㄉㄠˋ ㄌㄨˋ ㄎㄡˇ ㄗㄨㄛˇ ㄓㄨㄢˇ ㄐㄧㄡˋ ㄉㄠˋ ㄌㄜ˙。", pinyin:"wǎng qián zǒu, dào lù kǒu zuǒ zhuǎn jiù dào le.", meaning:"まっすぐ行って、交差点を左に曲がれば着きます。" },
    ],
    keyPhrases:[
      { hanzi:"迷路了", meaning:"道に迷った", note:"困った時に" },
      { hanzi:"往前走", meaning:"まっすぐ行く", note:"道案内の基本" },
      { hanzi:"左轉/右轉", meaning:"左折/右折", note:"方向指示" },
    ],
  },
];

const GRAMMAR_LESSONS = [
  { id:"shi", icon:"🔤", title:"「是」の使い方", titleZh:"是的用法", level:"beginner", color:"#e74c3c",
    explanation:"「是」は英語のbe動詞に近く、A是B（AはBです）の形で使います。否定は「不是」。",
    structure:"主語 ＋ 是 ＋ 名詞",
    examples:[{zh:"我是日本人。",reading:"ㄨㄛˇ ㄕˋ ㄖˋ ㄅㄣˇ ㄖㄣˊ",jp:"私は日本人です。"},{zh:"她不是老師。",reading:"ㄊㄚ ㄅㄨˊ ㄕˋ ㄌㄠˇ ㄕ",jp:"彼女は先生ではない。"},{zh:"你是學生嗎？",reading:"ㄋㄧˇ ㄕˋ ㄒㄩㄝˊ ㄕㄥ ㄇㄚ˙",jp:"あなたは学生ですか？"}],
    tips:["「是」は名詞の前でのみ使う。形容詞の前には使わない（×我是忙→○我很忙）","疑問文は文末に「嗎」をつけるだけ"],
  },
  { id:"le", icon:"⏰", title:"「了」で変化・完了", titleZh:"了的用法", level:"beginner", color:"#3498db",
    explanation:"「了」は動詞の後に置くと完了、文末に置くと状態の変化を表します。",
    structure:"動詞＋了（完了）／文末＋了（変化）",
    examples:[{zh:"我吃了早餐。",reading:"ㄨㄛˇ ㄔ ㄌㄜ˙ ㄗㄠˇ ㄘㄢ",jp:"朝ごはんを食べた。"},{zh:"天氣變冷了。",reading:"ㄊㄧㄢ ㄑㄧˋ ㄅㄧㄢˋ ㄌㄥˇ ㄌㄜ˙",jp:"寒くなった。"},{zh:"我已經到了。",reading:"ㄨㄛˇ ㄧˇ ㄐㄧㄥ ㄉㄠˋ ㄌㄜ˙",jp:"もう着きました。"}],
    tips:["動詞の直後の「了」＝完了（〜した）","文末の「了」＝変化（〜になった）","両方同時に使うこともある"],
  },
  { id:"de", icon:"🔗", title:"3つの「的・得・地」", titleZh:"的得地的區別", level:"intermediate", color:"#f39c12",
    explanation:"同じ発音「de」で3つの助詞があり、それぞれ役割が違います。",
    structure:"的＝修飾（〜の）／得＝程度／地＝副詞化",
    examples:[{zh:"我的書",reading:"ㄨㄛˇ ㄉㄜ˙ ㄕㄨ",jp:"私の本──名詞を修飾"},{zh:"跑得很快",reading:"ㄆㄠˇ ㄉㄜ˙ ㄏㄣˇ ㄎㄨㄞˋ",jp:"走るのが速い──程度"},{zh:"開心地笑",reading:"ㄎㄞ ㄒㄧㄣ ㄉㄜ˙ ㄒㄧㄠˋ",jp:"楽しそうに笑う──副詞"}],
    tips:["的：名詞の前（我的朋友）","得：動詞の後で程度を表す（說得很好）","地：形容詞＋地＋動詞（慢慢地走）"],
  },
  { id:"ba", icon:"💬", title:"「把」構文", titleZh:"把字句", level:"intermediate", color:"#9b59b6",
    explanation:"「把」構文は目的語に対する処置・変化を強調する文型です。",
    structure:"主語＋把＋目的語＋動詞＋結果",
    examples:[{zh:"把門關起來。",reading:"ㄅㄚˇ ㄇㄣˊ ㄍㄨㄢ ㄑㄧˇ ㄌㄞˊ",jp:"ドアを閉めて。"},{zh:"我把作業寫完了。",reading:"ㄨㄛˇ ㄅㄚˇ ㄗㄨㄛˋ ㄧㄝˋ ㄒㄧㄝˇ ㄨㄢˊ ㄌㄜ˙",jp:"宿題を書き終えた。"},{zh:"請把這個拿走。",reading:"ㄑㄧㄥˇ ㄅㄚˇ ㄓㄜˋ ㄍㄜ˙ ㄋㄚˊ ㄗㄡˇ",jp:"これを持って行って。"}],
    tips:["「把」の後の動詞には結果補語が必要","単純な動詞だけでは使えない（×把書看→○把書看完）"],
  },
  { id:"bei", icon:"📝", title:"受身文「被」", titleZh:"被字句", level:"advanced", color:"#27ae60",
    explanation:"「被」は受身を表します。台湾ではネガティブなニュアンスで使われることが多いです。",
    structure:"主語＋被＋（行為者）＋動詞＋結果",
    examples:[{zh:"我的手機被偷了。",reading:"ㄨㄛˇ ㄉㄜ˙ ㄕㄡˇ ㄐㄧ ㄅㄟˋ ㄊㄡ ㄌㄜ˙",jp:"携帯を盗まれた。"},{zh:"蛋糕被弟弟吃掉了。",reading:"ㄉㄢˋ ㄍㄠ ㄅㄟˋ ㄉㄧˋ ㄉㄧ˙ ㄔ ㄉㄧㄠˋ ㄌㄜ˙",jp:"ケーキが弟に食べられた。"},{zh:"他被老闆罵了。",reading:"ㄊㄚ ㄅㄟˋ ㄌㄠˇ ㄅㄢˇ ㄇㄚˋ ㄌㄜ˙",jp:"彼は上司に怒られた。"}],
    tips:["ネガティブな場面で使う（盗まれた、怒られた等）","最近はポジティブにも（被稱讚了＝褒められた）"],
  },
  { id:"measure", icon:"📏", title:"量詞の使い方", titleZh:"量詞", level:"beginner", color:"#1abc9c",
    explanation:"中国語では「一杯」「一碗」など、物を数える時に量詞（助数詞）が必要です。「個」が最も万能。",
    structure:"数字＋量詞＋名詞",
    examples:[{zh:"一杯咖啡",reading:"ㄧˋ ㄅㄟ ㄎㄚ ㄈㄟ",jp:"一杯のコーヒー（杯＝カップ類）"},{zh:"一碗麵",reading:"ㄧˋ ㄨㄢˇ ㄇㄧㄢˋ",jp:"一杯の麺（碗＝丼類）"},{zh:"三個人",reading:"ㄙㄢ ㄍㄜ˙ ㄖㄣˊ",jp:"3人（個＝万能量詞）"}],
    tips:["杯＝飲み物、碗＝丼・椀もの、份＝セット・一人前","個＝迷ったらこれ！最も汎用的","件＝服、張＝平らなもの（紙・切符）、本＝本・冊子"],
  },
  { id:"comparison", icon:"⚖️", title:"比較の「比」と「跟⋯一樣」", titleZh:"比較句", level:"intermediate", color:"#e67e22",
    explanation:"「比」はA>Bの比較、「跟⋯一樣」はA=Bの同等を表します。",
    structure:"A 比 B ＋形容詞／A 跟 B 一樣＋形容詞",
    examples:[{zh:"台北比台中大。",reading:"ㄊㄞˊ ㄅㄟˇ ㄅㄧˇ ㄊㄞˊ ㄓㄨㄥ ㄉㄚˋ",jp:"台北は台中より大きい。"},{zh:"她跟我一樣高。",reading:"ㄊㄚ ㄍㄣ ㄨㄛˇ ㄧˊ ㄧㄤˋ ㄍㄠ",jp:"彼女は私と同じ身長。"},{zh:"今天沒有昨天熱。",reading:"ㄐㄧㄣ ㄊㄧㄢ ㄇㄟˊ ㄧㄡˇ ㄗㄨㄛˊ ㄊㄧㄢ ㄖㄜˋ",jp:"今日は昨日ほど暑くない。"}],
    tips:["「比」の後に「更」をつけると「さらに」の意味","否定は「沒有A那麼⋯」（Aほど〜でない）","「一樣」は「同じ」の意味"],
  },
  { id:"complement", icon:"🎯", title:"結果補語", titleZh:"結果補語", level:"intermediate", color:"#2980b9",
    explanation:"動詞の後に結果を示す語をつけて「〜し終えた」「〜できた」などを表します。台湾の日常会話で頻出。",
    structure:"動詞＋結果補語（完/好/到/見/懂/會）",
    examples:[{zh:"我吃完了。",reading:"ㄨㄛˇ ㄔ ㄨㄢˊ ㄌㄜ˙",jp:"食べ終わった。（完＝完了）"},{zh:"你聽懂了嗎？",reading:"ㄋㄧˇ ㄊㄧㄥ ㄉㄨㄥˇ ㄌㄜ˙ ㄇㄚ˙",jp:"聞いて分かった？（懂＝理解）"},{zh:"我找到了！",reading:"ㄨㄛˇ ㄓㄠˇ ㄉㄠˋ ㄌㄜ˙",jp:"見つけた！（到＝達成）"}],
    tips:["完＝終わる、好＝準備OK、到＝達成","見＝知覚（看見＝見える、聽見＝聞こえる）","懂＝理解（聽懂、看懂）、會＝習得（學會）"],
  },
  { id:"guolai", icon:"🔄", title:"方向補語「過來/過去」", titleZh:"趨向補語", level:"advanced", color:"#8e44ad",
    explanation:"動詞の後に「過來」（こちらへ）「過去」（あちらへ）をつけて方向を表します。比喩的な意味にも使います。",
    structure:"動詞＋過來（こちらへ）／過去（あちらへ）",
    examples:[{zh:"你過來一下。",reading:"ㄋㄧˇ ㄍㄨㄛˋ ㄌㄞˊ ㄧˊ ㄒㄧㄚˋ",jp:"ちょっとこっち来て。"},{zh:"把書拿過來。",reading:"ㄅㄚˇ ㄕㄨ ㄋㄚˊ ㄍㄨㄛˋ ㄌㄞˊ",jp:"本を持ってきて。"},{zh:"他想起來了。",reading:"ㄊㄚ ㄒㄧㄤˇ ㄑㄧˇ ㄌㄞˊ ㄌㄜ˙",jp:"彼は思い出した。（比喩的用法）"}],
    tips:["過來＝話者の方へ近づく動き","過去＝話者から離れる動き","起來＝上方向＋「〜し始める」の比喩（笑起來＝笑い出す）"],
  },
  { id:"keyi", icon:"✅", title:"「可以/會/能」の使い分け", titleZh:"可以會能的區別", level:"intermediate", color:"#16a085",
    explanation:"3つの「できる」は場面によって使い分けます。日本語の「できる」が全部同じなので混乱しやすいポイント。",
    structure:"可以＝許可・可能／會＝習得した能力／能＝条件的な能力",
    examples:[{zh:"這裡可以拍照嗎？",reading:"ㄓㄜˋ ㄌㄧˇ ㄎㄜˇ ㄧˇ ㄆㄞ ㄓㄠˋ ㄇㄚ˙",jp:"ここで写真撮っていいですか？（許可）"},{zh:"我會說中文。",reading:"ㄨㄛˇ ㄏㄨㄟˋ ㄕㄨㄛ ㄓㄨㄥ ㄨㄣˊ",jp:"中国語が話せます。（習得）"},{zh:"今天不能去。",reading:"ㄐㄧㄣ ㄊㄧㄢ ㄅㄨˋ ㄋㄥˊ ㄑㄩˋ",jp:"今日は行けない。（条件的に無理）"}],
    tips:["可以＝「〜してもいい？」の許可を求める時","會＝学んで身につけた技能（會游泳＝泳げる）","能＝状況的に可能かどうか（身體不舒服不能去）"],
  },
];

const PRONUNCIATION = {
  bopomofo_chart: [
    { group: "声母（子音）", items: [
      { symbol: "ㄅ", pinyin: "b", ipa: "p", example: "爸 bà", exMeaning: "お父さん" },
      { symbol: "ㄆ", pinyin: "p", ipa: "pʰ", example: "怕 pà", exMeaning: "怖い" },
      { symbol: "ㄇ", pinyin: "m", ipa: "m", example: "媽 mā", exMeaning: "お母さん" },
      { symbol: "ㄈ", pinyin: "f", ipa: "f", example: "飯 fàn", exMeaning: "ご飯" },
      { symbol: "ㄉ", pinyin: "d", ipa: "t", example: "大 dà", exMeaning: "大きい" },
      { symbol: "ㄊ", pinyin: "t", ipa: "tʰ", example: "他 tā", exMeaning: "彼" },
      { symbol: "ㄋ", pinyin: "n", ipa: "n", example: "你 nǐ", exMeaning: "あなた" },
      { symbol: "ㄌ", pinyin: "l", ipa: "l", example: "來 lái", exMeaning: "来る" },
      { symbol: "ㄍ", pinyin: "g", ipa: "k", example: "哥 gē", exMeaning: "お兄さん" },
      { symbol: "ㄎ", pinyin: "k", ipa: "kʰ", example: "可 kě", exMeaning: "〜できる" },
      { symbol: "ㄏ", pinyin: "h", ipa: "x", example: "好 hǎo", exMeaning: "良い" },
      { symbol: "ㄐ", pinyin: "j", ipa: "tɕ", example: "家 jiā", exMeaning: "家" },
      { symbol: "ㄑ", pinyin: "q", ipa: "tɕʰ", example: "去 qù", exMeaning: "行く" },
      { symbol: "ㄒ", pinyin: "x", ipa: "ɕ", example: "謝 xiè", exMeaning: "感謝する" },
      { symbol: "ㄓ", pinyin: "zh", ipa: "ʈʂ", example: "中 zhōng", exMeaning: "中" },
      { symbol: "ㄔ", pinyin: "ch", ipa: "ʈʂʰ", example: "吃 chī", exMeaning: "食べる" },
      { symbol: "ㄕ", pinyin: "sh", ipa: "ʂ", example: "是 shì", exMeaning: "〜である" },
      { symbol: "ㄖ", pinyin: "r", ipa: "ɻ", example: "人 rén", exMeaning: "人" },
      { symbol: "ㄗ", pinyin: "z", ipa: "ts", example: "在 zài", exMeaning: "〜にいる" },
      { symbol: "ㄘ", pinyin: "c", ipa: "tsʰ", example: "菜 cài", exMeaning: "料理" },
      { symbol: "ㄙ", pinyin: "s", ipa: "s", example: "三 sān", exMeaning: "三" },
    ]},
    { group: "韻母（母音）", items: [
      { symbol: "ㄚ", pinyin: "a", ipa: "a", example: "大 dà", exMeaning: "大きい" },
      { symbol: "ㄛ", pinyin: "o", ipa: "o", example: "我 wǒ", exMeaning: "私" },
      { symbol: "ㄜ", pinyin: "e", ipa: "ɤ", example: "喝 hē", exMeaning: "飲む" },
      { symbol: "ㄝ", pinyin: "ê", ipa: "ɛ", example: "姐 jiě", exMeaning: "お姉さん" },
      { symbol: "ㄞ", pinyin: "ai", ipa: "ai", example: "愛 ài", exMeaning: "愛する" },
      { symbol: "ㄟ", pinyin: "ei", ipa: "ei", example: "給 gěi", exMeaning: "あげる" },
      { symbol: "ㄠ", pinyin: "ao", ipa: "au", example: "好 hǎo", exMeaning: "良い" },
      { symbol: "ㄡ", pinyin: "ou", ipa: "ou", example: "走 zǒu", exMeaning: "歩く" },
      { symbol: "ㄢ", pinyin: "an", ipa: "an", example: "安 ān", exMeaning: "安全" },
      { symbol: "ㄣ", pinyin: "en", ipa: "ən", example: "人 rén", exMeaning: "人" },
      { symbol: "ㄤ", pinyin: "ang", ipa: "aŋ", example: "忙 máng", exMeaning: "忙しい" },
      { symbol: "ㄥ", pinyin: "eng", ipa: "əŋ", example: "冷 lěng", exMeaning: "寒い" },
      { symbol: "ㄦ", pinyin: "er", ipa: "ɚ", example: "二 èr", exMeaning: "二" },
      { symbol: "ㄧ", pinyin: "i", ipa: "i", example: "一 yī", exMeaning: "一" },
      { symbol: "ㄨ", pinyin: "u", ipa: "u", example: "五 wǔ", exMeaning: "五" },
      { symbol: "ㄩ", pinyin: "ü", ipa: "y", example: "雨 yǔ", exMeaning: "雨" },
    ]},
  ],
  tones: [
    { tone: "一聲（第1声）", mark: "ˉ", desc: "高くフラットに", pinyin: "mā", bopomofo: "ㄇㄚ", meaning: "お母さん（媽）", color: "#e74c3c" },
    { tone: "二聲（第2声）", mark: "ˊ", desc: "下から上へ上げる", pinyin: "má", bopomofo: "ㄇㄚˊ", meaning: "麻（麻）", color: "#f39c12" },
    { tone: "三聲（第3声）", mark: "ˇ", desc: "低く下げてから上げる", pinyin: "mǎ", bopomofo: "ㄇㄚˇ", meaning: "馬（馬）", color: "#27ae60" },
    { tone: "四聲（第4声）", mark: "ˋ", desc: "高いところから急に下げる", pinyin: "mà", bopomofo: "ㄇㄚˋ", meaning: "叱る（罵）", color: "#3498db" },
    { tone: "輕聲（軽声）", mark: "˙", desc: "軽く短く添える", pinyin: "ma", bopomofo: "ㄇㄚ˙", meaning: "〜ですか（嗎）", color: "#9b59b6" },
  ],
  tw_tips: [
    { title: "台湾特有の発音", items: [
      "「ㄓㄔㄕㄖ」(zh/ch/sh/r) の舌の反りが大陸より弱め",
      "「ㄈ」と「ㄏ」が混同されやすい（例：花 huā → fā と発音する人も）",
      "「ㄣ」(en) と「ㄥ」(eng) の区別が曖昧なことが多い",
    ]},
    { title: "台湾独自の表現の発音", items: [
      "「和」は hé ではなく hàn と読むことが多い",
      "「垃圾」は lā jī ではなく lè sè",
      "「液體」は yè tǐ ではなく yì tǐ",
    ]},
  ],
};

const FEATURES = [
  { id: "flashcard", icon: "📇", label: "單字卡", sublabel: "単語カード" },
  { id: "phrases", icon: "💬", label: "會話", sublabel: "会話フレーズ" },
  { id: "grammar", icon: "📖", label: "文法", sublabel: "文法レッスン" },
  { id: "pronunciation", icon: "🎤", label: "發音", sublabel: "発音練習" },
  { id: "quiz", icon: "🏆", label: "測驗", sublabel: "クイズ挑戦" },
];

const S = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Noto+Serif+TC:wght@700;900&display=swap');
:root{--red:#c0392b;--red-light:#e74c3c;--gold:#f0c040;--gold-dark:#d4a017;--teal:#1a8a7d;--teal-dark:#136b61;--cream:#fdf6e3;--cream-dark:#f5e6c8;--brown:#5d4037;--brown-light:#8d6e63;--lantern-red:#d4342a;--ink:#2c1810;--paper:#faf3e0}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Noto Sans TC',sans-serif;background:var(--cream);color:var(--ink);min-height:100vh;overflow-x:hidden}
.app-bg{min-height:100vh;background-image:radial-gradient(circle at 20% 80%,rgba(26,138,125,.06) 0%,transparent 50%),radial-gradient(circle at 80% 20%,rgba(192,57,43,.06) 0%,transparent 50%)}
.cw{position:relative;z-index:1;max-width:430px;margin:0 auto;min-height:100vh;background:var(--paper);box-shadow:0 0 60px rgba(44,24,16,.1)}
.hdr{background:linear-gradient(135deg,var(--red),var(--lantern-red));padding:24px 20px 20px;position:relative;overflow:hidden}
.hdr::after{content:'';position:absolute;bottom:0;left:0;right:0;height:8px;background:repeating-linear-gradient(90deg,var(--gold) 0 12px,var(--gold-dark) 12px 16px,var(--red) 16px 28px,var(--gold-dark) 28px 32px)}
.hdr-l{position:absolute;top:8px;right:16px;font-size:28px;opacity:.6}
.hdr-t{font-family:'Noto Serif TC',serif;font-size:32px;font-weight:900;color:var(--gold);text-shadow:2px 2px 0 rgba(0,0,0,.3);letter-spacing:4px}
.hdr-s{color:rgba(255,255,255,.85);font-size:13px;margin-top:4px;letter-spacing:1px}
.nav{display:flex;background:var(--ink);border-bottom:3px solid var(--gold-dark);overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}.nav::-webkit-scrollbar{display:none}
.nav-i{flex:0 0 auto;min-width:60px;padding:10px 8px;text-align:center;color:rgba(255,255,255,.5);font-size:11px;font-weight:500;cursor:pointer;transition:all .2s;border:none;background:none;position:relative;font-family:'Noto Sans TC',sans-serif}
.nav-i.on{color:var(--gold);background:rgba(240,192,64,.1)}
.nav-i.on::after{content:'';position:absolute;bottom:0;left:20%;right:20%;height:3px;background:var(--gold);border-radius:3px 3px 0 0}
.nav-i:hover:not(.on){color:rgba(255,255,255,.8)}
.nav-ic{font-size:20px;display:block;margin-bottom:2px}
.sec{padding:20px 16px}
.gc{background:linear-gradient(135deg,var(--teal),var(--teal-dark));border-radius:16px;padding:20px;color:#fff;position:relative;overflow:hidden;margin-bottom:24px}
.gc::before{content:'學';position:absolute;right:-10px;top:-20px;font-size:120px;font-family:'Noto Serif TC',serif;font-weight:900;opacity:.08}
.gc-t{font-size:20px;font-weight:700;margin-bottom:4px}
.gc-s{font-size:13px;opacity:.85}
.streak{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.2);border-radius:20px;padding:6px 14px;font-size:13px;font-weight:500;margin-top:12px}
.st{font-family:'Noto Serif TC',serif;font-size:18px;font-weight:700;color:var(--brown);margin-bottom:14px;display:flex;align-items:center;gap:8px}
.st::before{content:'';width:4px;height:20px;background:var(--red);border-radius:2px}
.fg{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:28px}
.fc{background:#fff;border:2px solid var(--cream-dark);border-radius:14px;padding:18px 14px;text-align:center;cursor:pointer;transition:all .2s}
.fc:hover:not(.dis){border-color:var(--teal);transform:translateY(-2px);box-shadow:0 6px 20px rgba(26,138,125,.15)}
.fc.dis{opacity:.5;cursor:not-allowed}
.fc-i{font-size:36px;margin-bottom:8px;display:block}
.fc-l{font-family:'Noto Serif TC',serif;font-size:18px;font-weight:700;color:var(--ink)}
.fc-sl{font-size:11px;color:var(--brown-light);margin-top:2px}
.fc-cs{font-size:10px;color:#fff;background:var(--brown-light);border-radius:10px;padding:2px 8px;margin-top:8px;display:inline-block}
.lcs{display:flex;flex-direction:column;gap:10px;margin-bottom:28px}
.lc{display:flex;align-items:center;background:#fff;border:2px solid var(--cream-dark);border-radius:12px;padding:14px 16px;cursor:pointer;transition:all .2s;gap:14px}
.lc:hover{border-color:var(--teal);transform:translateX(4px)}
.ld{width:14px;height:14px;border-radius:50%;flex-shrink:0}
.li{flex:1}.ln{font-weight:700;font-size:15px}.llc{font-size:12px;color:var(--brown-light);margin-top:2px}
.la{color:var(--brown-light);font-size:18px}
.bb{display:inline-flex;align-items:center;gap:6px;background:none;border:2px solid var(--cream-dark);border-radius:10px;padding:8px 14px;font-size:13px;color:var(--brown);cursor:pointer;font-family:'Noto Sans TC',sans-serif;font-weight:500;margin-bottom:16px;transition:all .2s}
.bb:hover{border-color:var(--brown-light);background:#fff}
.rt{display:flex;justify-content:center;gap:4px;margin-bottom:16px;background:var(--cream-dark);border-radius:10px;padding:4px}
.rt button{padding:6px 16px;border:none;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;font-family:'Noto Sans TC',sans-serif;background:transparent;color:var(--brown-light);transition:all .2s}
.rt button.on{background:#fff;color:var(--ink);box-shadow:0 2px 6px rgba(0,0,0,.08)}
.cp{text-align:center;font-size:13px;color:var(--brown-light);margin-bottom:12px;font-weight:500}
.pbw{height:6px;background:var(--cream-dark);border-radius:3px;margin-bottom:20px;overflow:hidden}
.pbf{height:100%;background:linear-gradient(90deg,var(--teal),var(--gold));border-radius:3px;transition:width .4s}
.fcc{perspective:1000px;margin-bottom:20px}
.fcard{width:100%;min-height:340px;position:relative;cursor:pointer;transform-style:preserve-3d;transition:transform .5s cubic-bezier(.4,0,.2,1)}
.fcard.flip{transform:rotateY(180deg)}
.ff{position:absolute;width:100%;min-height:340px;backface-visibility:hidden;border-radius:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:30px 24px}
.ff-f{background:linear-gradient(160deg,#fff,var(--paper));border:3px solid var(--cream-dark);box-shadow:0 8px 30px rgba(44,24,16,.08)}
.ff-f::before{content:'';position:absolute;top:12px;left:12px;right:12px;bottom:12px;border:1px solid rgba(192,57,43,.1);border-radius:12px;pointer-events:none}
.ff-b{background:linear-gradient(160deg,var(--teal),var(--teal-dark));color:#fff;transform:rotateY(180deg);box-shadow:0 8px 30px rgba(26,138,125,.2)}
.ccat{font-size:12px;font-weight:500;color:var(--teal);background:rgba(26,138,125,.1);padding:4px 12px;border-radius:20px;margin-bottom:16px}
.chz{font-family:'Noto Serif TC',serif;font-size:56px;font-weight:900;color:var(--ink);line-height:1.2;margin-bottom:12px}
.cbp{font-size:18px;color:var(--red);font-weight:500;margin-bottom:4px;letter-spacing:2px}
.cpy{font-size:15px;color:var(--brown-light);font-style:italic;margin-bottom:8px}
.cth{font-size:12px;color:var(--brown-light);margin-top:16px;opacity:.6}
.bm{font-size:28px;font-weight:700;margin-bottom:20px;text-align:center}
.beb{background:rgba(255,255,255,.15);border-radius:14px;padding:16px 20px;width:100%;backdrop-filter:blur(4px)}
.bel{font-size:11px;opacity:.7;margin-bottom:6px;font-weight:500}
.bex{font-size:18px;font-weight:700;margin-bottom:6px;line-height:1.4}
.bem{font-size:13px;opacity:.85;line-height:1.4}
.ca{display:flex;gap:12px;justify-content:center}
.ab{display:flex;align-items:center;justify-content:center;gap:6px;padding:14px 28px;border-radius:14px;font-size:14px;font-weight:700;cursor:pointer;border:none;font-family:'Noto Sans TC',sans-serif;transition:all .2s}
.ab:active{transform:scale(.96)}
.ab-a{background:rgba(192,57,43,.1);color:var(--red);border:2px solid rgba(192,57,43,.2)}
.ab-a:hover{background:rgba(192,57,43,.18)}
.ab-g{background:var(--teal);color:#fff;border:2px solid var(--teal);box-shadow:0 4px 12px rgba(26,138,125,.3)}
.ab-g:hover{background:var(--teal-dark)}
.ss{text-align:center;padding:40px 20px}
.ss-e{font-size:64px;margin-bottom:16px;display:block}
.ss-t{font-family:'Noto Serif TC',serif;font-size:24px;font-weight:900;color:var(--ink);margin-bottom:8px}
.ss-d{font-size:15px;color:var(--brown-light);margin-bottom:24px;line-height:1.6}
.ss-a{display:flex;flex-direction:column;gap:10px;align-items:center}
.rb{background:var(--red);color:#fff;border:none;padding:14px 32px;border-radius:14px;font-size:15px;font-weight:700;cursor:pointer;font-family:'Noto Sans TC',sans-serif;transition:all .2s}
.rb:hover{background:var(--red-light)}
.hlb{background:none;border:none;color:var(--teal);font-size:14px;cursor:pointer;font-family:'Noto Sans TC',sans-serif;font-weight:500;padding:8px}
.wls{padding:0 16px 20px}
.wli{display:flex;align-items:center;gap:14px;padding:12px 14px;background:#fff;border:2px solid var(--cream-dark);border-radius:12px;margin-bottom:8px;cursor:pointer;transition:all .2s}
.wli:hover{border-color:var(--teal);background:rgba(26,138,125,.03)}
.whs{font-family:'Noto Serif TC',serif;font-size:24px;font-weight:900;color:var(--ink);min-width:70px}
.wd{flex:1}.wr{font-size:12px;color:var(--red);font-weight:500}.wms{font-size:13px;color:var(--brown);margin-top:2px}
.scl{display:flex;flex-direction:column;gap:12px;margin-top:8px}
.scc{background:#fff;border:2px solid var(--cream-dark);border-radius:16px;padding:18px;cursor:pointer;transition:all .25s;display:flex;align-items:center;gap:16px}
.scc:hover{border-color:var(--teal);transform:translateY(-2px);box-shadow:0 6px 24px rgba(44,24,16,.08)}
.siw{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0}
.sci{flex:1}.sct{font-weight:700;font-size:15px;color:var(--ink);margin-bottom:2px}
.sctz{font-size:12px;color:var(--brown-light);margin-bottom:4px}
.scd{font-size:12px;color:var(--brown-light)}
.slt{font-size:10px;font-weight:700;padding:3px 8px;border-radius:8px;color:#fff;flex-shrink:0}
.dh{display:flex;align-items:center;gap:12px;margin-bottom:20px;padding:16px;background:#fff;border-radius:16px;border:2px solid var(--cream-dark)}
.dhi{font-size:36px}.dhf{}.dhf h3{font-family:'Noto Serif TC',serif;font-size:18px;font-weight:700}.dhf p{font-size:12px;color:var(--brown-light);margin-top:2px}
.dbs{display:flex;flex-direction:column;gap:14px;margin-bottom:24px}
.br{display:flex;flex-direction:column;max-width:88%}
.br.you{align-self:flex-end}.br.oth{align-self:flex-start}
.bsp{font-size:11px;font-weight:700;margin-bottom:4px;padding:0 4px}
.br.you .bsp{color:var(--teal);text-align:right}.br.oth .bsp{color:var(--brown-light)}
.bbl{padding:14px 18px;border-radius:18px;cursor:pointer;transition:all .2s}
.bbl:hover{filter:brightness(.97)}
.br.you .bbl{background:linear-gradient(135deg,var(--teal),var(--teal-dark));color:#fff;border-bottom-right-radius:6px}
.br.oth .bbl{background:#fff;border:2px solid var(--cream-dark);color:var(--ink);border-bottom-left-radius:6px}
.bhz{font-size:17px;font-weight:700;line-height:1.5;margin-bottom:4px}
.brd{font-size:12px;opacity:.75;line-height:1.4;margin-bottom:4px}
.bmn{font-size:12px;opacity:.6;line-height:1.4;padding-top:6px;border-top:1px solid rgba(255,255,255,.15)}
.br.oth .bmn{border-top-color:var(--cream-dark)}
.bmn.hid{display:none}
.bth{font-size:10px;text-align:center;color:var(--brown-light);opacity:.5;margin-bottom:16px}
.kps{background:#fff;border:2px solid var(--cream-dark);border-radius:16px;padding:18px;margin-bottom:20px}
.kpt{font-family:'Noto Serif TC',serif;font-size:16px;font-weight:700;color:var(--ink);margin-bottom:14px;display:flex;align-items:center;gap:8px}
.kpi{padding:10px 0;border-bottom:1px solid var(--cream-dark)}
.kpi:last-child{border-bottom:none;padding-bottom:0}
.kph{font-family:'Noto Serif TC',serif;font-size:18px;font-weight:700;color:var(--ink)}
.kpm{font-size:13px;color:var(--brown);margin-top:2px}
.kpn{font-size:11px;color:var(--teal);margin-top:3px;font-weight:500}
.ft{display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap}
.ftb{padding:6px 14px;border:2px solid var(--cream-dark);border-radius:20px;font-size:12px;font-weight:500;cursor:pointer;font-family:'Noto Sans TC',sans-serif;background:#fff;color:var(--brown);transition:all .2s}
.ftb.on{border-color:var(--teal);background:var(--teal);color:#fff}
.ftb:hover:not(.on){border-color:var(--brown-light)}
.glc{display:flex;flex-direction:column;gap:12px;margin-top:8px}
.glcard{background:#fff;border:2px solid var(--cream-dark);border-radius:16px;padding:18px;cursor:pointer;transition:all .25s;display:flex;align-items:center;gap:16px}
.glcard:hover{border-color:var(--teal);transform:translateY(-2px);box-shadow:0 6px 24px rgba(44,24,16,.08)}
.gliw{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0}
.gli{flex:1}.glt{font-weight:700;font-size:15px;color:var(--ink);margin-bottom:2px}.gltz{font-size:12px;color:var(--brown-light)}
.gbox{background:#fff;border:2px solid var(--cream-dark);border-radius:16px;padding:20px;margin-bottom:16px}
.gbox-t{font-family:'Noto Serif TC',serif;font-size:16px;font-weight:700;color:var(--ink);margin-bottom:10px;display:flex;align-items:center;gap:8px}
.gbox-exp{font-size:14px;color:var(--brown);line-height:1.7;margin-bottom:14px}
.gstruct{background:linear-gradient(135deg,var(--teal),var(--teal-dark));color:#fff;border-radius:12px;padding:14px 18px;font-size:15px;font-weight:700;text-align:center;margin-bottom:16px;letter-spacing:1px}
.gex-item{padding:12px 0;border-bottom:1px solid var(--cream-dark)}
.gex-item:last-child{border-bottom:none;padding-bottom:0}
.gex-zh{font-family:'Noto Serif TC',serif;font-size:18px;font-weight:700;color:var(--ink);margin-bottom:2px}
.gex-rd{font-size:12px;color:var(--red);font-style:italic;margin-bottom:2px}
.gex-jp{font-size:13px;color:var(--brown)}
.gtip-item{display:flex;gap:8px;padding:8px 0;font-size:13px;color:var(--brown);line-height:1.5}
.gtip-item::before{content:'💡';flex-shrink:0}
.pron-tabs{display:flex;gap:4px;margin-bottom:16px;background:var(--cream-dark);border-radius:10px;padding:4px}
.pron-tab{flex:1;padding:8px;border:none;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;font-family:'Noto Sans TC',sans-serif;background:transparent;color:var(--brown-light);transition:all .2s;text-align:center}
.pron-tab.on{background:#fff;color:var(--ink);box-shadow:0 2px 6px rgba(0,0,0,.08)}
.tone-card{display:flex;align-items:center;gap:14px;background:#fff;border:2px solid var(--cream-dark);border-radius:14px;padding:14px 16px;margin-bottom:10px;transition:all .2s}
.tone-card:hover{border-color:var(--teal)}
.tone-mark{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:#fff;flex-shrink:0}
.tone-info{flex:1}
.tone-name{font-weight:700;font-size:14px;color:var(--ink)}
.tone-desc{font-size:12px;color:var(--brown-light);margin-top:2px}
.tone-ex{font-size:13px;color:var(--brown);margin-top:4px}
.tone-ex b{color:var(--red)}
.bp-group-title{font-family:'Noto Serif TC',serif;font-size:15px;font-weight:700;color:var(--brown);margin:16px 0 10px;padding-bottom:6px;border-bottom:2px solid var(--cream-dark)}
.bp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:8px;margin-bottom:16px}
.bp-cell{background:#fff;border:2px solid var(--cream-dark);border-radius:10px;padding:10px 6px;text-align:center;cursor:pointer;transition:all .2s}
.bp-cell:hover{border-color:var(--teal);background:rgba(26,138,125,.03)}
.bp-cell.sel{border-color:var(--teal);background:rgba(26,138,125,.08)}
.bp-sym{font-size:22px;font-weight:900;color:var(--ink);display:block}
.bp-py{font-size:11px;color:var(--red);margin-top:2px}
.bp-detail{background:#fff;border:2px solid var(--teal);border-radius:14px;padding:16px;margin-bottom:16px}
.bp-detail-sym{font-size:36px;font-weight:900;color:var(--ink);text-align:center;margin-bottom:4px}
.bp-detail-py{font-size:14px;color:var(--red);text-align:center;margin-bottom:2px}
.bp-detail-ipa{font-size:12px;color:var(--brown-light);text-align:center;margin-bottom:10px}
.bp-detail-ex{font-size:14px;color:var(--brown);text-align:center}
.bp-detail-ex b{color:var(--ink);font-family:'Noto Serif TC',serif}
.tw-tip-box{background:#fff;border:2px solid var(--cream-dark);border-radius:16px;padding:18px;margin-bottom:12px}
.tw-tip-title{font-weight:700;font-size:14px;color:var(--ink);margin-bottom:10px;display:flex;align-items:center;gap:6px}
.tw-tip-item{font-size:13px;color:var(--brown);line-height:1.6;padding:4px 0;padding-left:20px;position:relative}
.tw-tip-item::before{content:'•';position:absolute;left:6px;color:var(--teal);font-weight:900}
@keyframes fi{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes su{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.ai{animation:fi .4s ease forwards}
.d1{animation-delay:.1s;opacity:0}.d2{animation-delay:.2s;opacity:0}.d3{animation-delay:.3s;opacity:0}.d4{animation-delay:.4s;opacity:0}
.ba{animation:su .4s ease forwards;opacity:0}
.quiz-hub{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px}
.quiz-hub-card{background:#fff;border:2px solid var(--cream-dark);border-radius:16px;padding:20px 14px;text-align:center;cursor:pointer;transition:all .25s}
.quiz-hub-card:hover{border-color:var(--teal);transform:translateY(-2px);box-shadow:0 6px 20px rgba(26,138,125,.15)}
.qhc-icon{font-size:36px;display:block;margin-bottom:8px}
.qhc-label{font-family:'Noto Serif TC',serif;font-size:16px;font-weight:700;color:var(--ink)}
.qhc-sub{font-size:11px;color:var(--brown-light);margin-top:3px}
.quiz-q{background:#fff;border:2px solid var(--cream-dark);border-radius:18px;padding:24px;text-align:center;margin-bottom:20px;position:relative;overflow:hidden}
.quiz-q::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--teal),var(--gold))}
.quiz-q-label{font-size:12px;color:var(--brown-light);margin-bottom:10px;font-weight:500}
.quiz-q-main{font-family:'Noto Serif TC',serif;font-size:36px;font-weight:900;color:var(--ink);line-height:1.3;margin-bottom:6px}
.quiz-q-sub{font-size:14px;color:var(--brown-light)}
.quiz-q-speaker{width:56px;height:56px;border-radius:50%;background:var(--teal);color:#fff;border:none;font-size:24px;cursor:pointer;margin:0 auto 10px;display:flex;align-items:center;justify-content:center;transition:all .2s;box-shadow:0 4px 12px rgba(26,138,125,.3)}
.quiz-q-speaker:hover{transform:scale(1.08)}
.quiz-q-speaker.playing{animation:pulse .8s ease infinite}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
.quiz-opts{display:flex;flex-direction:column;gap:10px;margin-bottom:20px}
.quiz-opt{padding:16px 18px;background:#fff;border:2px solid var(--cream-dark);border-radius:14px;cursor:pointer;transition:all .2s;text-align:left;font-family:'Noto Sans TC',sans-serif;font-size:15px;font-weight:500;color:var(--ink);display:flex;align-items:center;gap:12px}
.quiz-opt:hover:not(.answered){border-color:var(--teal);background:rgba(26,138,125,.03)}
.quiz-opt.correct{border-color:#27ae60;background:rgba(39,174,96,.1);color:#27ae60}
.quiz-opt.wrong{border-color:var(--red);background:rgba(192,57,43,.08);color:var(--red)}
.quiz-opt.dim{opacity:.5}
.quiz-opt-num{width:28px;height:28px;border-radius:50%;background:var(--cream-dark);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0}
.quiz-opt.correct .quiz-opt-num{background:#27ae60;color:#fff}
.quiz-opt.wrong .quiz-opt-num{background:var(--red);color:#fff}
.quiz-feedback{text-align:center;padding:12px;border-radius:12px;margin-bottom:16px;font-size:14px;font-weight:700}
.quiz-feedback.ok{background:rgba(39,174,96,.1);color:#27ae60}
.quiz-feedback.ng{background:rgba(192,57,43,.08);color:var(--red)}
.quiz-next{display:block;width:100%;padding:14px;background:var(--teal);color:#fff;border:none;border-radius:14px;font-size:15px;font-weight:700;cursor:pointer;font-family:'Noto Sans TC',sans-serif;transition:all .2s}
.quiz-next:hover{background:var(--teal-dark)}
.conv-quiz-ctx{background:#fff;border:2px solid var(--cream-dark);border-radius:16px;padding:16px;margin-bottom:16px}
.conv-quiz-bubble{padding:10px 14px;border-radius:14px;margin-bottom:8px;max-width:85%}
.conv-quiz-bubble.oth{background:var(--cream-dark);border-bottom-left-radius:4px}
.conv-quiz-bubble.you{background:linear-gradient(135deg,var(--teal),var(--teal-dark));color:#fff;margin-left:auto;border-bottom-right-radius:4px}
.conv-quiz-bubble .cqb-zh{font-size:15px;font-weight:700;line-height:1.4}
.conv-quiz-bubble .cqb-jp{font-size:11px;opacity:.7;margin-top:2px}
.conv-quiz-blank{padding:10px 14px;border:2px dashed var(--teal);border-radius:14px;text-align:center;font-size:14px;color:var(--teal);font-weight:500;max-width:85%;margin-left:auto}
.gram-quiz-sentence{font-family:'Noto Serif TC',serif;font-size:22px;font-weight:700;color:var(--ink);line-height:1.6}
.gram-quiz-blank{display:inline-block;min-width:60px;border-bottom:3px solid var(--teal);margin:0 4px;text-align:center}
`;

function Header() {
  return (<div className="hdr"><div className="hdr-l">🏮🏮</div><div className="hdr-t">台灣華語</div><div className="hdr-s">Táiwān Huáyǔ ── 台湾華語学習</div></div>);
}

function NavBar({ screen, onNav }) {
  const tabs = [{ id:"home",icon:"🏠",label:"首頁" },{ id:"flashcard",icon:"📇",label:"單字" },{ id:"phrases",icon:"💬",label:"會話" },{ id:"grammar",icon:"📖",label:"文法" },{ id:"quiz",icon:"🏆",label:"測驗" },{ id:"progress",icon:"📊",label:"記録" }];
  const quizScreens=["quiz","vocabQuiz","convQuiz","grammarQuiz","listenVocab","listenConv"];
  return (<div className="nav">{tabs.map(t=><button key={t.id} className={`nav-i ${screen===t.id||(screen==="flashcardSelect"&&t.id==="flashcard")||(screen==="dialogue"&&t.id==="phrases")||(screen==="grammarDetail"&&t.id==="grammar")||(quizScreens.includes(screen)&&t.id==="quiz")?"on":""}`} onClick={()=>onNav(t.id)}><span className="nav-ic">{t.icon}</span>{t.label}</button>)}</div>);
}

function HomeScreen({ onStartFC, onNav }) {
  return (
    <div className="sec">
      <div className="gc ai"><div className="gc-t">歡迎回來！</div><div className="gc-s">今日も台湾華語を学びましょう 🇹🇼</div><div className="streak">🔥 連続学習 1日目</div></div>
      <div className="st ai d1">學習功能</div>
      <div className="fg ai d2">{FEATURES.map(f=><div key={f.id} className={`fc ${f.disabled?"dis":""}`} onClick={()=>!f.disabled&&onNav(f.id)}><span className="fc-i">{f.icon}</span><div className="fc-l">{f.label}</div><div className="fc-sl">{f.sublabel}</div>{f.disabled&&<span className="fc-cs">Coming Soon</span>}</div>)}</div>
    </div>
  );
}

function FlashcardSelectScreen({ onSelect }) {
  return (
    <div className="sec">
      <div className="st">單字カテゴリを選ぶ</div>
      <div className="scl">{CATEGORIES.map((c,i)=>(
        <div key={c.id} className="scc ai" style={{animationDelay:`${i*.05}s`,opacity:0}} onClick={()=>onSelect(c.id)}>
          <div className="siw" style={{background:"rgba(26,138,125,0.1)"}}>{c.icon}</div>
          <div className="sci"><div className="sct">{c.label}</div><div className="sctz">{c.labelZh}</div></div>
          <span style={{fontSize:13,color:"#8d6e63"}}>{VOCAB_BY_CAT[c.id].length}語</span>
        </div>
      ))}</div>
    </div>
  );
}

function FlashcardScreen({ level, onBack, rm, setRm }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);
  const words = VOCAB_BY_CAT[level] || [];
  const cur = words[idx];
  const prog = (idx / words.length) * 100;
  const catInfo = CATEGORIES.find(c=>c.id===level);
  const handleAnswer = useCallback((ok) => {
    setResults(p=>[...p,{word:cur,correct:ok}]);
    setFlipped(false);
    if(idx+1>=words.length){setTimeout(()=>setDone(true),300)} else {setTimeout(()=>setIdx(i=>i+1),300)}
  },[cur,idx,words.length]);
  const cc = results.filter(r=>r.correct).length;
  if(done){
    const pct=Math.round((cc/words.length)*100);
    const em=pct>=80?"🎉":pct>=50?"👍":"💪";
    return(<div className="sec"><div className="ss ai"><span className="ss-e">{em}</span><div className="ss-t">練習完了！</div><div className="ss-d">{words.length}問中{cc}問正解<br/>正解率：{pct}%</div><div className="ss-a"><button className="rb" onClick={()=>{setIdx(0);setFlipped(false);setResults([]);setDone(false)}}>もう一度挑戦 🔄</button><button className="hlb" onClick={onBack}>← ホームに戻る</button></div></div></div>);
  }
  if(!cur)return null;
  return(
    <div className="sec">
      <button className="bb" onClick={onBack}>← 戻る</button>
      <div className="rt"><button className={rm==="bopomofo"?"on":""} onClick={()=>setRm("bopomofo")}>注音</button><button className={rm==="pinyin"?"on":""} onClick={()=>setRm("pinyin")}>拼音</button><button className={rm==="both"?"on":""} onClick={()=>setRm("both")}>両方</button></div>
      <div className="cp">{catInfo?.icon} {catInfo?.label} ── {idx+1} / {words.length}</div>
      <div className="pbw"><div className="pbf" style={{width:`${prog}%`}}/></div>
      <div className="fcc" onClick={()=>setFlipped(!flipped)}>
        <div className={`fcard ${flipped?"flip":""}`}>
          <div className="ff ff-f">
            <span className="ccat">{catInfo?.icon} {catInfo?.labelZh}</span>
            <div className="chz">{cur.hanzi}</div>
            {(rm==="bopomofo"||rm==="both")&&<div className="cbp">{cur.bopomofo}</div>}
            {(rm==="pinyin"||rm==="both")&&<div className="cpy">{cur.pinyin}</div>}
            <div className="cth">タップして意味を確認 →</div>
          </div>
          <div className="ff ff-b">
            <div className="bm">{cur.meaning}</div>
            <div className="beb"><div className="bel">例文</div><div className="bex">{cur.example}</div><div className="bem">{cur.exampleMeaning}</div></div>
          </div>
        </div>
      </div>
      <div className="ca">
        <button className="ab ab-a" onClick={e=>{e.stopPropagation();handleAnswer(false)}}>😅 もう一度</button>
        <button className="ab ab-g" onClick={e=>{e.stopPropagation();handleAnswer(true)}}>✅ 覚えた！</button>
      </div>
    </div>
  );
}

function PhrasesListScreen({ onSelect, rm, setRm }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter==="all" ? PHRASE_SCENARIOS : PHRASE_SCENARIOS.filter(s=>s.level===filter);
  return (
    <div className="sec">
      <div className="st">會話場景</div>
      <div className="ft">
        {["all","beginner","intermediate","advanced"].map(f=><button key={f} className={`ftb ${filter===f?"on":""}`} onClick={()=>setFilter(f)}>{f==="all"?"すべて":f==="beginner"?"初級":f==="intermediate"?"中級":"上級"}</button>)}
      </div>
      <div className="scl">
        {filtered.map((sc,i)=>(
          <div key={sc.id} className="scc ai" style={{animationDelay:`${i*.08}s`,opacity:0}} onClick={()=>onSelect(sc)}>
            <div className="siw" style={{background:`${sc.color}15`}}>{sc.icon}</div>
            <div className="sci"><div className="sct">{sc.title}</div><div className="sctz">{sc.titleZh}</div><div className="scd">{sc.description}</div></div>
            <span className="slt" style={{background:sc.color}}>{sc.level==="beginner"?"初級":sc.level==="intermediate"?"中級":"上級"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DialogueScreen({ scenario, onBack, rm, setRm }) {
  const [revealed, setRevealed] = useState({});
  const toggle = i => setRevealed(p=>({...p,[i]:!p[i]}));
  const reading = d => rm==="bopomofo"?d.bopomofo:rm==="pinyin"?d.pinyin:`${d.bopomofo}\n${d.pinyin}`;
  return (
    <div className="sec">
      <button className="bb" onClick={onBack}>← シーン一覧</button>
      <div className="rt"><button className={rm==="bopomofo"?"on":""} onClick={()=>setRm("bopomofo")}>注音</button><button className={rm==="pinyin"?"on":""} onClick={()=>setRm("pinyin")}>拼音</button><button className={rm==="both"?"on":""} onClick={()=>setRm("both")}>両方</button></div>
      <div className="dh"><span className="dhi">{scenario.icon}</span><div className="dhf"><h3>{scenario.title}</h3><p>{scenario.titleZh} ── {scenario.description}</p></div></div>
      <div className="bth">💡 吹き出しをタップで日本語訳を表示</div>
      <div className="dbs">
        {scenario.dialogues.map((d,i)=>(
          <div key={i} className={`br ${d.speaker==="you"?"you":"oth"} ba`} style={{animationDelay:`${i*.15}s`}}>
            <div className="bsp">{d.speaker==="you"?"🙋 あなた":"🙎 相手"}</div>
            <div className="bbl" onClick={()=>toggle(i)}>
              <div className="bhz">{d.hanzi}</div>
              <div className="brd" style={{whiteSpace:"pre-line"}}>{reading(d)}</div>
              <div className={`bmn ${revealed[i]?"":"hid"}`}>🇯🇵 {d.meaning}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="kps ai">
        <div className="kpt">🔑 キーフレーズ</div>
        {scenario.keyPhrases.map((kp,i)=><div key={i} className="kpi"><div className="kph">{kp.hanzi}</div><div className="kpm">{kp.meaning}</div><div className="kpn">💡 {kp.note}</div></div>)}
      </div>
    </div>
  );
}

function GrammarListScreen({ onSelect }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter==="all" ? GRAMMAR_LESSONS : GRAMMAR_LESSONS.filter(g=>g.level===filter);
  return (
    <div className="sec">
      <div className="st">文法レッスン</div>
      <div className="ft">
        {["all","beginner","intermediate","advanced"].map(f=><button key={f} className={`ftb ${filter===f?"on":""}`} onClick={()=>setFilter(f)}>{f==="all"?"すべて":f==="beginner"?"初級":f==="intermediate"?"中級":"上級"}</button>)}
      </div>
      <div className="glc">
        {filtered.map((g,i)=>(
          <div key={g.id} className="glcard ai" style={{animationDelay:`${i*.08}s`,opacity:0}} onClick={()=>onSelect(g)}>
            <div className="gliw" style={{background:`${g.color}15`}}>{g.icon}</div>
            <div className="gli"><div className="glt">{g.title}</div><div className="gltz">{g.titleZh}</div></div>
            <span className="slt" style={{background:g.color}}>{g.level==="beginner"?"初級":g.level==="intermediate"?"中級":"上級"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GrammarDetailScreen({ lesson, onBack }) {
  return (
    <div className="sec">
      <button className="bb" onClick={onBack}>← レッスン一覧</button>
      <div className="dh"><span className="dhi">{lesson.icon}</span><div className="dhf"><h3>{lesson.title}</h3><p>{lesson.titleZh}</p></div></div>
      <div className="gbox ai">
        <div className="gbox-t">📘 解説</div>
        <div className="gbox-exp">{lesson.explanation}</div>
        <div className="gstruct">{lesson.structure}</div>
      </div>
      <div className="gbox ai" style={{animationDelay:".15s",opacity:0}}>
        <div className="gbox-t">📝 例文</div>
        {lesson.examples.map((ex,i)=><div key={i} className="gex-item"><div className="gex-zh">{ex.zh}</div><div className="gex-rd">{ex.reading}</div><div className="gex-jp">{ex.jp}</div></div>)}
      </div>
      <div className="gbox ai" style={{animationDelay:".3s",opacity:0}}>
        <div className="gbox-t">🎯 ポイント</div>
        {lesson.tips.map((tip,i)=><div key={i} className="gtip-item">{tip}</div>)}
      </div>
    </div>
  );
}

function PronunciationScreen() {
  const [tab, setTab] = useState("tones");
  const [selSymbol, setSelSymbol] = useState(null);
  return (
    <div className="sec">
      <div className="st">發音練習</div>
      <div className="pron-tabs">
        <button className={`pron-tab ${tab==="tones"?"on":""}`} onClick={()=>setTab("tones")}>四聲（声調）</button>
        <button className={`pron-tab ${tab==="chart"?"on":""}`} onClick={()=>{setTab("chart");setSelSymbol(null)}}>注音表</button>
        <button className={`pron-tab ${tab==="tips"?"on":""}`} onClick={()=>setTab("tips")}>台湾の発音</button>
      </div>

      {tab==="tones"&&<div className="ai">
        <div className="gbox"><div className="gbox-t">🎵 声調について</div><div className="gbox-exp">台湾華語には4つの声調＋軽声があります。同じ音でも声調が変わると意味が全く変わります。「媽（mā）」「麻（má）」「馬（mǎ）」「罵（mà）」「嗎（ma）」はすべて音が違います。</div></div>
        {PRONUNCIATION.tones.map((t,i)=>(
          <div key={i} className="tone-card">
            <div className="tone-mark" style={{background:t.color}}>{t.mark}</div>
            <div className="tone-info">
              <div className="tone-name">{t.tone}</div>
              <div className="tone-desc">{t.desc}</div>
              <div className="tone-ex"><b>{t.bopomofo}</b> / {t.pinyin} ── {t.meaning}</div>
            </div>
          </div>
        ))}
      </div>}

      {tab==="chart"&&<div className="ai">
        {selSymbol&&<div className="bp-detail ai">
          <div className="bp-detail-sym">{selSymbol.symbol}</div>
          <div className="bp-detail-py">ピンイン: {selSymbol.pinyin}</div>
          <div className="bp-detail-ipa">IPA: [{selSymbol.ipa}]</div>
          <div className="bp-detail-ex"><b>{selSymbol.example.split(" ")[0]}</b> {selSymbol.example} ── {selSymbol.exMeaning}</div>
        </div>}
        {PRONUNCIATION.bopomofo_chart.map((grp,gi)=>(
          <div key={gi}>
            <div className="bp-group-title">{grp.group}</div>
            <div className="bp-grid">
              {grp.items.map((item,ii)=>(
                <div key={ii} className={`bp-cell ${selSymbol?.symbol===item.symbol?"sel":""}`} onClick={()=>setSelSymbol(selSymbol?.symbol===item.symbol?null:item)}>
                  <span className="bp-sym">{item.symbol}</span>
                  <span className="bp-py">{item.pinyin}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>}

      {tab==="tips"&&<div className="ai">
        <div className="gbox" style={{marginBottom:16}}><div className="gbox-t">🇹🇼 台湾華語の発音の特徴</div><div className="gbox-exp">台湾の発音は中国大陸の普通話とは異なる特徴があります。台湾で自然に聞こえる発音を身につけましょう。</div></div>
        {PRONUNCIATION.tw_tips.map((section,i)=>(
          <div key={i} className="tw-tip-box ai" style={{animationDelay:`${i*.12}s`,opacity:0}}>
            <div className="tw-tip-title">🎯 {section.title}</div>
            {section.items.map((item,j)=><div key={j} className="tw-tip-item">{item}</div>)}
          </div>
        ))}
      </div>}
    </div>
  );
}

function WordListScreen({ rm }) {
  const [cat, setCat] = useState("greetings");
  const words = VOCAB_BY_CAT[cat] || [];
  const catInfo = CATEGORIES.find(c=>c.id===cat);
  return (
    <div>
      <div style={{padding:"16px 16px 8px"}}>
        <div className="st">單字一覽</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
          {CATEGORIES.map(c=><button key={c.id} className={`ftb ${cat===c.id?"on":""}`} onClick={()=>setCat(c.id)}>{c.icon} {c.labelZh}</button>)}
        </div>
        <div style={{fontSize:13,color:"#8d6e63",marginBottom:8}}>{catInfo?.label} ── {words.length}語</div>
      </div>
      <div className="wls">{words.map(w=><div key={w.id} className="wli"><div className="whs">{w.hanzi}</div><div className="wd"><div className="wr">{rm==="bopomofo"?w.bopomofo:rm==="pinyin"?w.pinyin:`${w.bopomofo}  ${w.pinyin}`}</div><div className="wms">{w.meaning}</div></div></div>)}</div>
    </div>
  );
}

// === QUIZ UTILITIES ===
function shuffle(arr) { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]} return a; }

function speakZh(text, rate=1) {
  const src = AUDIO_MAP[text];
  if (src) {
    const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    const audio = new Audio(base + src);
    audio.playbackRate = rate;
    audio.play().catch(()=>{});
    return;
  }
  // フォールバック: Web Speech API
  if(!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "zh-TW";
  u.rate = rate;
  u.pitch = 1;
  window.speechSynthesis.speak(u);
}

// === QUIZ HUB ===
const CONV_QUIZ_DATA = [
  {context:[{speaker:"other",zh:"歡迎光臨！請問要喝什麼？"}],blank:"you",answer:"我要一杯珍珠奶茶。",options:["我要一杯珍珠奶茶。","我是日本人。","對不起，我遲到了。"],explain:"「要喝什麼」＝何を飲む？注文は「我要＋量詞＋品名」。"},
  {context:[{speaker:"other",zh:"要不要加辣？"}],blank:"you",answer:"小辣就好，謝謝！",options:["小辣就好，謝謝！","我要一份。","多少錢？"],explain:"「〜就好」は控えめに希望を伝える便利な表現。"},
  {context:[{speaker:"you",zh:"不好意思，請問台北101怎麼去？"}],blank:"other",answer:"搭紅線到台北101站就到了。",options:["搭紅線到台北101站就到了。","一份五十塊。","半糖少冰。"],explain:"「搭〜線」＝〜線に乗る。MRTは色で路線を区別。"},
  {context:[{speaker:"you",zh:"你好，我有訂房，姓田中。"}],blank:"other",answer:"好的，請給我看一下護照。",options:["好的，請給我看一下護照。","要不要加辣？","太貴了！"],explain:"「請給我看一下」＝見せてください。チェックインの定番。"},
  {context:[{speaker:"other",zh:"甜度冰塊呢？"}],blank:"you",answer:"半糖少冰，謝謝。",options:["半糖少冰，謝謝。","搭紅線就到了。","我有訂房。"],explain:"甜度＝甘さ、冰塊＝氷の量。台湾ドリンク注文の必須知識。"},
  {context:[{speaker:"other",zh:"你哪裡不舒服？"}],blank:"you",answer:"我頭痛，而且有一點發燒。",options:["我頭痛，而且有一點發燒。","我要一杯珍珠奶茶。","太貴了！"],explain:"「而且」＝その上。症状を重ねて伝える時に使う。"},
  {context:[{speaker:"you",zh:"老闆，這件衣服怎麼賣？"},{speaker:"other",zh:"算你八百。"}],blank:"you",answer:"太貴了！可以算便宜一點嗎？",options:["太貴了！可以算便宜一點嗎？","半糖少冰。","我有訂房。"],explain:"「太貴了」→「算便宜一點」が値切りの黄金パターン。"},
  {context:[{speaker:"you",zh:"請問有位子嗎？兩位。"}],blank:"other",answer:"有的，這邊請。",options:["有的，這邊請。","我要外帶。","需要轉車嗎？"],explain:"「這邊請」＝こちらへどうぞ。レストランの案内。"},
  {context:[{speaker:"other",zh:"內用還是外帶？"}],blank:"you",answer:"內用，謝謝。",options:["內用，謝謝。","我迷路了。","可以刷卡嗎？"],explain:"「內用」＝店内、「外帶」＝テイクアウト。台湾で必ず聞かれる。"},
  {context:[{speaker:"you",zh:"可以結帳嗎？"}],blank:"other",answer:"一共兩百五十塊。",options:["一共兩百五十塊。","請稍等。","你要去哪裡？"],explain:"「一共」＝合計。「結帳」＝お会計。"},
  {context:[{speaker:"you",zh:"你好，我要去台北車站。"}],blank:"other",answer:"好，大概十五分鐘。",options:["好，大概十五分鐘。","半糖少冰。","一份五十塊。"],explain:"タクシーで「大概」＝約〜分と所要時間を教えてくれる。"},
  {context:[{speaker:"you",zh:"不好意思，可以幫我們拍照嗎？"}],blank:"other",answer:"當然可以！按哪裡？",options:["當然可以！按哪裡？","我要訂位。","太貴了！"],explain:"「按」＝押す。写真を頼む時の自然なやり取り。"},
  {context:[{speaker:"you",zh:"你週末有空嗎？"}],blank:"other",answer:"有啊，你想做什麼？",options:["有啊，你想做什麼？","一天吃三次。","找你五十塊。"],explain:"「有空」＝暇がある。友達との会話の自然な流れ。"},
  {context:[{speaker:"other",zh:"你好，鼎泰豐，請問幾位？"}],blank:"you",answer:"我要訂位，四個人，明天晚上七點。",options:["我要訂位，四個人，明天晚上七點。","我迷路了。","小辣就好。"],explain:"「訂位」＝予約。人数＋日時をまとめて伝える。"},
  {context:[{speaker:"other",zh:"好的，請問貴姓？"}],blank:"you",answer:"我姓田中。",options:["我姓田中。","半糖少冰。","我要結帳。"],explain:"「貴姓」＝お名前は？（丁寧）。「我姓〜」で答える。"},
  {context:[{speaker:"you",zh:"不好意思，我迷路了。"}],blank:"other",answer:"你要去哪裡？",options:["你要去哪裡？","甜度冰塊呢？","算你八百。"],explain:"道に迷った時、まず行き先を確認するのが自然。"},
  {context:[{speaker:"other",zh:"往前走，到路口左轉就到了。"}],blank:"you",answer:"好的，謝謝你！",options:["好的，謝謝你！","我要一份。","可以試穿嗎？"],explain:"道案内をもらった後のお礼。「往前走」＝まっすぐ。"},
  {context:[{speaker:"you",zh:"可以刷卡嗎？"}],blank:"other",answer:"不好意思，我們只收現金。",options:["不好意思，我們只收現金。","好的，請稍等。","搭紅線就到了。"],explain:"「只收現金」＝現金のみ。小さい店では多い。"},
  {context:[{speaker:"other",zh:"需要袋子嗎？"}],blank:"you",answer:"不用，謝謝。",options:["不用，謝謝。","我要訂房。","往前走。"],explain:"「不用」＝いりません。台湾ではレジ袋は有料。"},
  {context:[{speaker:"other",zh:"從什麼時候開始的？"}],blank:"you",answer:"昨天晚上開始的。",options:["昨天晚上開始的。","我要去台北車站。","半糖少冰。"],explain:"病院で症状の時期を聞かれた場面。「從〜開始」。"},
  {context:[{speaker:"you",zh:"請問洗手間在哪裡？"}],blank:"other",answer:"在那邊，左轉就到了。",options:["在那邊，左轉就到了。","一杯五十塊。","我姓田中。"],explain:"「洗手間」＝トイレ。「在哪裡」＝どこですか。"},
  {context:[{speaker:"other",zh:"你想吃什麼？"}],blank:"you",answer:"我想吃小籠包。",options:["我想吃小籠包。","我有訂房。","需要轉車。"],explain:"「想吃」＝食べたい。「想＋動詞」は願望を表す。"},
  {context:[{speaker:"you",zh:"這附近有便利商店嗎？"}],blank:"other",answer:"有，前面右轉就有一家。",options:["有，前面右轉就有一家。","半糖少冰。","一天吃三次。"],explain:"「這附近」＝この近く。「一家」＝一軒。"},
  {context:[{speaker:"other",zh:"你會說中文嗎？"}],blank:"you",answer:"會一點點，我還在學。",options:["會一點點，我還在學。","我要結帳。","太貴了。"],explain:"「一點點」＝少しだけ。「還在學」＝まだ勉強中。謙虚な表現。"},
  {context:[{speaker:"you",zh:"請問這個怎麼吃？"}],blank:"other",answer:"沾這個醬，很好吃喔！",options:["沾這個醬，很好吃喔！","搭紅線就到了。","我姓田中。"],explain:"「沾」＝つける。「醬」＝タレ。夜市で食べ方を聞く場面。"},
  {context:[{speaker:"other",zh:"你來台灣多久了？"}],blank:"you",answer:"大概三個月了。",options:["大概三個月了。","我要外帶。","可以拍照嗎？"],explain:"「多久」＝どのくらい。「大概」＝約〜。期間を聞かれた時。"},
  {context:[{speaker:"you",zh:"我對海鮮過敏。"}],blank:"other",answer:"好的，我幫你換一道菜。",options:["好的，我幫你換一道菜。","要不要加辣？","算你八百。"],explain:"「過敏」＝アレルギー。「換」＝替える。「一道菜」＝一品。"},
  {context:[{speaker:"other",zh:"今天天氣好熱喔！"}],blank:"you",answer:"對啊，去喝杯冰的吧！",options:["對啊，去喝杯冰的吧！","我有訂房。","我迷路了。"],explain:"「好熱」＝とても暑い。「冰的」＝冷たいもの。日常会話。"},
  {context:[{speaker:"you",zh:"我吃飽了，謝謝。"}],blank:"other",answer:"不客氣，歡迎再來！",options:["不客氣，歡迎再來！","甜度冰塊呢？","你要去哪裡？"],explain:"「吃飽了」＝お腹いっぱい。「歡迎再來」＝またお越しください。"},
  {context:[{speaker:"other",zh:"這個有辣嗎？"}],blank:"you",answer:"有一點點辣，你可以試試看。",options:["有一點點辣，你可以試試看。","我要訂位。","左轉就到了。"],explain:"「試試看」＝試してみて。「一點點」＝少しだけ。"},
  {context:[{speaker:"you",zh:"請問捷運幾點收班？"}],blank:"other",answer:"最後一班大概十二點。",options:["最後一班大概十二點。","半糖少冰。","我姓田中。"],explain:"「收班」＝終電。「最後一班」＝最終便。"},
  {context:[{speaker:"other",zh:"你有悠遊卡嗎？"}],blank:"you",answer:"有，我用悠遊卡付。",options:["有，我用悠遊卡付。","我要去台北101。","太貴了。"],explain:"「悠遊卡」＝ICカード。交通・コンビニで使える。"},
  {context:[{speaker:"you",zh:"不好意思，可以幫我叫計程車嗎？"}],blank:"other",answer:"沒問題，大概五分鐘就到。",options:["沒問題，大概五分鐘就到。","半糖少冰。","你哪裡不舒服？"],explain:"「叫計程車」＝タクシーを呼ぶ。「沒問題」＝問題ない。"},
  {context:[{speaker:"other",zh:"你想去哪裡玩？"}],blank:"you",answer:"我想去九份和花蓮。",options:["我想去九份和花蓮。","我要結帳。","昨天開始的。"],explain:"「想去」＝行きたい。「和」＝と（〜と〜）。"},
  {context:[{speaker:"you",zh:"這裡可以拍照嗎？"}],blank:"other",answer:"可以，但是不能開閃光燈。",options:["可以，但是不能開閃光燈。","我要一份。","請問貴姓？"],explain:"「不能」＝〜できない（禁止）。「閃光燈」＝フラッシュ。"},
  {context:[{speaker:"other",zh:"你住在哪裡？"}],blank:"you",answer:"我住在台北的大安區。",options:["我住在台北的大安區。","要不要加辣？","一共三百塊。"],explain:"「住在」＝〜に住んでいる。「〜的〜區」で地域を表す。"},
  {context:[{speaker:"you",zh:"明天會下雨嗎？"}],blank:"other",answer:"好像會，記得帶傘。",options:["好像會，記得帶傘。","我要外帶。","往前走就到了。"],explain:"「好像」＝〜みたい。「記得」＝忘れないで。「帶傘」＝傘を持つ。"},
  {context:[{speaker:"other",zh:"你的中文說得很好耶！"}],blank:"you",answer:"沒有啦，還要多練習。",options:["沒有啦，還要多練習。","我要一杯奶茶。","太貴了。"],explain:"「沒有啦」＝そんなことないよ。台湾式の謙虚な返し方。"},
  {context:[{speaker:"you",zh:"我手機沒電了。"}],blank:"other",answer:"你可以用我的充電器。",options:["你可以用我的充電器。","甜度冰塊呢？","一天吃三次。"],explain:"「沒電」＝充電切れ。「充電器」＝充電器。日常でよくある場面。"},
  {context:[{speaker:"other",zh:"你想喝什麼？我請你。"}],blank:"you",answer:"真的嗎？那我要一杯拿鐵。",options:["真的嗎？那我要一杯拿鐵。","我有訂房。","搭紅線。"],explain:"「我請你」＝おごるよ。「真的嗎」＝本当？「拿鐵」＝ラテ。"},
  {context:[{speaker:"you",zh:"這個多少錢？"}],blank:"other",answer:"一個三十塊，三個一百。",options:["一個三十塊，三個一百。","半糖少冰。","你要去哪裡？"],explain:"まとめ買い割引。「三個一百」＝3つで100元。夜市でよくある。"},
  {context:[{speaker:"other",zh:"你吃過臭豆腐嗎？"}],blank:"you",answer:"還沒，但是我想試試看。",options:["還沒，但是我想試試看。","我要訂位。","我迷路了。"],explain:"「還沒」＝まだ〜ない。「想試試看」＝試してみたい。"},
  {context:[{speaker:"you",zh:"不好意思，我聽不懂。"}],blank:"other",answer:"沒關係，我說慢一點。",options:["沒關係，我說慢一點。","一共五百塊。","要不要加辣？"],explain:"「聽不懂」＝聞いて分からない。「說慢一點」＝ゆっくり話す。"},
  {context:[{speaker:"other",zh:"加我的LINE好不好？"}],blank:"you",answer:"好啊！我掃你的QR code。",options:["好啊！我掃你的QR code。","我要結帳。","昨天開始的。"],explain:"「加LINE」＝LINE交換。「掃」＝スキャンする。台湾の定番。"},
  {context:[{speaker:"you",zh:"請問附近有藥局嗎？"}],blank:"other",answer:"有，便利商店旁邊就有。",options:["有，便利商店旁邊就有。","半糖少冰。","算你八百。"],explain:"「藥局」＝薬局。「旁邊」＝隣。台湾はコンビニの近くに薬局が多い。"},
  {context:[{speaker:"other",zh:"你要買什麼紀念品？"}],blank:"you",answer:"我想買鳳梨酥和茶葉。",options:["我想買鳳梨酥和茶葉。","我要去台北車站。","不用，謝謝。"],explain:"「鳳梨酥」＝パイナップルケーキ。「茶葉」＝茶葉。台湾の定番お土産。"},
  {context:[{speaker:"you",zh:"我想去北投泡溫泉。"}],blank:"other",answer:"好主意！那裡的溫泉很有名。",options:["好主意！那裡的溫泉很有名。","甜度冰塊呢？","請問貴姓？"],explain:"「泡溫泉」＝温泉に入る。「好主意」＝いいアイデア！"},
  {context:[{speaker:"other",zh:"你明天有什麼計畫？"}],blank:"you",answer:"我想去故宮博物院。",options:["我想去故宮博物院。","我有訂房。","小辣就好。"],explain:"「計畫」＝計画・予定。「故宮博物院」は台北の有名観光地。"},
  {context:[{speaker:"you",zh:"這班公車到士林夜市嗎？"}],blank:"other",answer:"到，大概二十分鐘。",options:["到，大概二十分鐘。","我姓田中。","一天吃三次。"],explain:"「這班公車」＝このバス。「到」＝着く・行く。バス利用の定番。"},
  {context:[{speaker:"other",zh:"要不要一起去KTV？"}],blank:"you",answer:"好啊，我很喜歡唱歌！",options:["好啊，我很喜歡唱歌！","我要外帶。","太貴了。"],explain:"「KTV」＝カラオケ。「唱歌」＝歌を歌う。台湾ではKTVが人気。"},
];

const GRAMMAR_QUIZ_DATA = [
  {sentence:"我___日本人。",answer:"是",options:["是","有","在","很"],explain:"「是」はA是Bの形。名詞をつなぐbe動詞的な役割。"},
  {sentence:"我吃___早餐。",answer:"了",options:["了","的","得","著"],explain:"動詞の直後の「了」は完了。「吃了」＝食べた。"},
  {sentence:"我___書（私の本）",answer:"的",options:["的","得","地","了"],explain:"「的」は名詞を修飾。「我的書」＝私の本。"},
  {sentence:"跑___很快。",answer:"得",options:["得","的","地","了"],explain:"「得」は動詞の後で程度を表す。「跑得很快」＝速く走る。"},
  {sentence:"請___門關起來。",answer:"把",options:["把","被","讓","給"],explain:"「把」構文は処置を強調。把＋目的語＋動詞＋結果。"},
  {sentence:"我的手機___偷了。",answer:"被",options:["被","把","是","給"],explain:"「被」は受身。「被偷了」＝盗まれた。"},
  {sentence:"天氣變冷___。",answer:"了",options:["了","的","著","過"],explain:"文末の「了」は状態の変化。「變冷了」＝寒くなった。"},
  {sentence:"開心___笑。",answer:"地",options:["地","的","得","了"],explain:"「地」は形容詞を副詞化。「開心地笑」＝楽しそうに笑う。"},
  {sentence:"一___咖啡",answer:"杯",options:["杯","碗","個","份"],explain:"「杯」は飲み物の量詞。カップに入るものに使う。"},
  {sentence:"一___麵",answer:"碗",options:["碗","杯","盤","份"],explain:"「碗」は丼・椀もの。麺やスープに使う量詞。"},
  {sentence:"台北___台中大。",answer:"比",options:["比","跟","和","很"],explain:"「比」はA>Bの比較。「A比B＋形容詞」。"},
  {sentence:"她跟我___高。",answer:"一樣",options:["一樣","比較","更","很"],explain:"「跟⋯一樣」＝〜と同じ。同等比較の文型。"},
  {sentence:"我吃___了。",answer:"完",options:["完","到","好","見"],explain:"「完」は結果補語で「〜し終わる」。"},
  {sentence:"你聽___了嗎？",answer:"懂",options:["懂","完","到","會"],explain:"「懂」は理解の結果補語。「聽懂」＝聞いて分かった。"},
  {sentence:"這裡___拍照嗎？",answer:"可以",options:["可以","會","能","要"],explain:"「可以」は許可。〜していいですか？"},
  {sentence:"我___說中文。（話せます）",answer:"會",options:["會","可以","能","要"],explain:"「會」は習得した能力。学んで身につけた技能。"},
  {sentence:"你___來一下。",answer:"過來",options:["過來","過去","起來","下去"],explain:"「過來」は話者の方へ近づく方向補語。"},
  {sentence:"他不___學生。",answer:"是",options:["是","有","在","會"],explain:"「不是」＝〜ではない。「是」の否定は「不是」。"},
  {sentence:"我___去過台灣。（行ったことがない）",answer:"沒",options:["沒","不","別","無"],explain:"「沒」は経験・完了の否定。「沒去過」＝行ったことがない。"},
  {sentence:"我把作業寫___了。",answer:"完",options:["完","了","好","著"],explain:"「把」構文では結果補語が必要。「寫完」＝書き終えた。"},
  {sentence:"你___在做什麼？",answer:"正",options:["正","很","就","才"],explain:"「正在」＝〜している最中。進行形の表現。"},
  {sentence:"我___去過日本三次。",answer:"已經",options:["已經","正在","快要","還沒"],explain:"「已經」＝すでに。「已經去過三次」＝すでに3回行った。"},
  {sentence:"他___要到了。",answer:"快",options:["快","已經","正在","剛"],explain:"「快要」＝もうすぐ。「快要到了」＝もうすぐ着く。"},
  {sentence:"你___吃飯了嗎？",answer:"還沒",options:["還沒","不會","沒有","不要"],explain:"「還沒」＝まだ〜ない。「還沒吃」＝まだ食べてない。"},
  {sentence:"我___學中文學了一年。",answer:"已經",options:["已經","正在","快要","還沒"],explain:"「已經⋯了」＝もう〜した。期間を表す時によく使う。"},
  {sentence:"這個___那個好吃。（〜より）",answer:"比",options:["比","和","跟","很"],explain:"「A比B＋形容詞」の比較文。〜より〜だ。"},
  {sentence:"她唱歌唱___很好聽。",answer:"得",options:["得","的","地","了"],explain:"「動詞＋得＋形容詞」で程度を表す。歌が上手い。"},
  {sentence:"我___他很高。（彼は背が高いと思う）",answer:"覺得",options:["覺得","知道","希望","以為"],explain:"「覺得」＝〜と思う（主観的な感想）。"},
  {sentence:"___你喜歡，就買吧！",answer:"如果",options:["如果","雖然","因為","所以"],explain:"「如果」＝もし。条件を表す接続詞。"},
  {sentence:"___下雨了，___我帶了傘。",answer:"雖然",options:["雖然","因為","如果","不但"],explain:"「雖然⋯但是⋯」＝〜だけど〜。逆接の表現。"},
  {sentence:"___他很忙，___還是來了。",answer:"雖然",options:["雖然","因為","如果","不但"],explain:"「雖然⋯還是⋯」＝〜だけどやはり〜。"},
  {sentence:"___下雨，我們___去吧。",answer:"就算",options:["就算","因為","如果","雖然"],explain:"「就算⋯也⋯」＝たとえ〜でも。強い仮定。"},
  {sentence:"我___想去，___沒有時間。",answer:"很",options:["很","不","沒","才"],explain:"「很想去但是沒有時間」＝行きたいけど時間がない。"},
  {sentence:"請你___說一次。",answer:"再",options:["再","又","還","才"],explain:"「再說一次」＝もう一度言って。「再」は未来の繰り返し。"},
  {sentence:"他昨天___遲到了。",answer:"又",options:["又","再","還","才"],explain:"「又」は過去の繰り返し。「又遲到了」＝また遅刻した。"},
  {sentence:"我___他一樣喜歡台灣。",answer:"跟",options:["跟","比","和","對"],explain:"「跟⋯一樣」＝〜と同じ。同等を表す。"},
  {sentence:"三___衣服（3着の服）",answer:"件",options:["件","個","杯","條"],explain:"「件」は服の量詞。上着・シャツなどに使う。"},
  {sentence:"一___褲子（1本のズボン）",answer:"條",options:["條","件","個","雙"],explain:"「條」は細長いものの量詞。ズボン・道・魚など。"},
  {sentence:"兩___鞋子（2足の靴）",answer:"雙",options:["雙","條","件","個"],explain:"「雙」はペアのものの量詞。靴・靴下・手など。"},
  {sentence:"我看___他了。（彼が見えた）",answer:"見",options:["見","完","到","好"],explain:"「見」は知覚の結果補語。「看見」＝見えた。"},
  {sentence:"東西都準備___了。",answer:"好",options:["好","完","到","了"],explain:"「好」は準備完了の結果補語。「準備好」＝準備できた。"},
  {sentence:"我找___那家店了！",answer:"到",options:["到","好","完","見"],explain:"「到」は達成の結果補語。「找到」＝見つけた。"},
  {sentence:"今天___昨天冷。",answer:"沒有",options:["沒有","不是","很","比"],explain:"「沒有⋯那麼⋯」＝〜ほど〜でない。否定比較。"},
  {sentence:"你___什麼時候來的？",answer:"是",options:["是","在","有","會"],explain:"「是⋯的」構文。過去の事実の詳細を強調する。"},
  {sentence:"我是昨天___的。（昨日来たのです）",answer:"來",options:["來","去","到","走"],explain:"「是⋯的」構文で時間・方法・場所を強調。"},
  {sentence:"他___在看書。",answer:"正",options:["正","很","就","才"],explain:"「正在」＝ちょうど〜している。進行中の動作。"},
  {sentence:"___走___聊吧。（歩きながら話そう）",answer:"一邊",options:["一邊","一起","一直","一定"],explain:"「一邊⋯一邊⋯」＝〜しながら〜する。同時動作。"},
  {sentence:"你___吃___看。（食べてみて）",answer:"試",options:["試","想","要","會"],explain:"「動詞＋試試看」＝〜してみる。「吃吃看」でも可。"},
  {sentence:"我___台灣住了三年。",answer:"在",options:["在","到","從","去"],explain:"「在＋場所＋動詞」＝〜で〜する。「在台灣住」＝台湾に住む。"},
  {sentence:"他___台北來的。",answer:"從",options:["從","在","到","去"],explain:"「從」＝〜から。起点を表す。「從台北來」＝台北から来た。"},
];

// === QUIZ HUB ===
function QuizHubScreen({ onNav }) {
  const quizzes = [
    { id:"vocabQuiz", icon:"📇", label:"単語4択", sub:"漢字→意味を選ぶ" },
    { id:"convQuiz", icon:"💬", label:"会話3択", sub:"適切な返答を選ぶ" },
    { id:"grammarQuiz", icon:"📖", label:"文法穴埋め", sub:"正しい語を選ぶ" },
    { id:"listenVocab", icon:"🔊", label:"リスニング単語", sub:"音声→単語を選ぶ" },
    { id:"listenConv", icon:"🎧", label:"リスニング会話", sub:"音声→返答を選ぶ" },
  ];
  return (
    <div className="sec">
      <div className="st">クイズ挑戰</div>
      <div className="quiz-hub">{quizzes.map(q=>(
        <div key={q.id} className="quiz-hub-card" onClick={()=>onNav(q.id)}>
          <span className="qhc-icon">{q.icon}</span>
          <div className="qhc-label">{q.label}</div>
          <div className="qhc-sub">{q.sub}</div>
        </div>
      ))}</div>
    </div>
  );
}

// === SHARED RESULT SCREEN ===
// === 学習記録（localStorage）===
const STORAGE_KEY = "taiwan_huayu_progress";
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {quizHistory:[],totalCorrect:0,totalQuestions:0,lastStudied:null}; }
  catch { return {quizHistory:[],totalCorrect:0,totalQuestions:0,lastStudied:null}; }
}
function saveQuizResult(title, score, total) {
  const p = loadProgress();
  p.quizHistory = [{title, score, total, pct:Math.round(score/total*100), date:new Date().toLocaleDateString("ja-JP")},...p.quizHistory].slice(0,20);
  p.totalCorrect = (p.totalCorrect||0) + score;
  p.totalQuestions = (p.totalQuestions||0) + total;
  p.lastStudied = new Date().toLocaleDateString("ja-JP");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function QuizResult({icon,title,total,score,wrongs,onRetry,onNew,onBack,retryLabel}){
  const pct=Math.round((score/total)*100);const em=pct>=80?"🎉":pct>=50?"👍":"💪";
  useEffect(()=>{ saveQuizResult(title,score,total); },[]);
  return(<div className="sec"><div className="ss ai"><span className="ss-e">{em}</span><div className="ss-t">{title}</div><div className="ss-d">{total}問中{score}問正解<br/>正解率：{pct}%</div><div className="ss-a">
    {wrongs>0&&<button className="rb" onClick={onRetry}>😅 間違えた{wrongs}問を復習</button>}
    <button className={wrongs>0?"hlb":"rb"} onClick={onNew}>🔄 新しいクイズ</button>
    <button className="hlb" onClick={onBack}>← クイズ一覧に戻る</button>
  </div></div></div>);
}

// === 学習記録画面 ===
function ProgressScreen() {
  const p = loadProgress();
  const totalPct = p.totalQuestions > 0 ? Math.round(p.totalCorrect/p.totalQuestions*100) : 0;
  return (
    <div className="sec">
      <div className="st">📊 学習記録</div>
      <div style={{background:"#fff",borderRadius:12,padding:16,marginBottom:12,boxShadow:"0 1px 4px rgba(0,0,0,.08)"}}>
        <div style={{fontSize:14,color:"#8d6e63",marginBottom:8}}>累計成績</div>
        <div style={{fontSize:28,fontWeight:700,color:"#c0392b"}}>{totalPct}%</div>
        <div style={{fontSize:13,color:"#666"}}>{p.totalQuestions}問中{p.totalCorrect}問正解</div>
        {p.lastStudied&&<div style={{fontSize:12,color:"#aaa",marginTop:4}}>最終学習日：{p.lastStudied}</div>}
      </div>
      <div className="st" style={{fontSize:15,marginTop:16}}>最近のクイズ履歴</div>
      {p.quizHistory.length===0 && <div style={{color:"#aaa",textAlign:"center",padding:20}}>まだ記録がありません</div>}
      {p.quizHistory.map((h,i)=>(
        <div key={i} style={{background:"#fff",borderRadius:10,padding:"10px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 1px 3px rgba(0,0,0,.06)"}}>
          <div>
            <div style={{fontWeight:600,fontSize:14}}>{h.title}</div>
            <div style={{fontSize:12,color:"#aaa"}}>{h.date}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontWeight:700,color:h.pct>=80?"#27ae60":h.pct>=50?"#f39c12":"#c0392b",fontSize:16}}>{h.pct}%</div>
            <div style={{fontSize:12,color:"#888"}}>{h.total}問中{h.score}問</div>
          </div>
        </div>
      ))}
      {p.quizHistory.length>0&&<button className="rb" style={{marginTop:8}} onClick={()=>{localStorage.removeItem(STORAGE_KEY);window.location.reload();}}>🗑️ 記録をリセット</button>}
    </div>
  );
}

// === VOCAB QUIZ (4択 + 復習) ===
function mkQs(pool,n){return shuffle(pool).slice(0,n).map(w=>{const wr=shuffle(pool.filter(x=>x.id!==w.id)).slice(0,3).map(x=>x.meaning);return{word:w,options:shuffle([w.meaning,...wr]),answer:w.meaning}})}

function VocabQuizScreen({ onBack }) {
  const all=getAllWords();
  const [qs,setQs]=useState(()=>mkQs(all,10));
  const [idx,setIdx]=useState(0);const [sel,setSel]=useState(null);const [sc,setSc]=useState(0);const [done,setDone]=useState(false);const [wrongs,setWrongs]=useState([]);const [retry,setRetry]=useState(false);
  const q=qs[idx];
  const pick=o=>{if(sel!==null)return;setSel(o);if(o===q.answer)setSc(s=>s+1);else setWrongs(p=>[...p,q])};
  const next=()=>{if(idx+1>=qs.length)setDone(true);else{setIdx(i=>i+1);setSel(null)}};
  const doRetry=()=>{setQs(wrongs.map(w=>({...w,options:shuffle(w.options)})));setIdx(0);setSel(null);setSc(0);setDone(false);setWrongs([]);setRetry(true)};
  const doNew=()=>{setQs(mkQs(all,10));setIdx(0);setSel(null);setSc(0);setDone(false);setWrongs([]);setRetry(false)};
  if(done) return <QuizResult icon="📇" title={retry?"復習完了！":"クイズ完了！"} total={qs.length} score={sc} wrongs={wrongs.length} onRetry={doRetry} onNew={doNew} onBack={onBack}/>;
  return (
    <div className="sec">
      <button className="bb" onClick={onBack}>← 戻る</button>
      <div className="cp">{retry?"🔁 復習モード":"📇 単語クイズ"} ── {idx+1} / {qs.length}</div>
      <div className="pbw"><div className="pbf" style={{width:`${(idx/qs.length)*100}%`}}/></div>
      <div className="quiz-q"><div className="quiz-q-label">この漢字の意味は？</div><div className="quiz-q-main">{q.word.hanzi}</div><div className="quiz-q-sub">{q.word.bopomofo}</div></div>
      <div className="quiz-opts">{q.options.map((o,i)=>{
        let c="quiz-opt";if(sel!==null){c+=" answered";if(o===q.answer)c+=" correct";else if(o===sel)c+=" wrong";else c+=" dim"}
        return <button key={i} className={c} onClick={()=>pick(o)}><span className="quiz-opt-num">{sel!==null?(o===q.answer?"✓":o===sel?"✗":i+1):i+1}</span>{o}</button>
      })}</div>
      {sel!==null&&<><div className={`quiz-feedback ${sel===q.answer?"ok":"ng"}`}>{sel===q.answer?"正解！🎉":`不正解… 正解は「${q.answer}」`}</div>
        <button className="quiz-next" onClick={next}>{idx+1>=qs.length?"結果を見る →":"次の問題 →"}</button></>}
    </div>
  );
}

// === CONV QUIZ (3択 + 復習) ===
function ConvQuizScreen({ onBack }) {
  const [qs,setQs]=useState(()=>shuffle(CONV_QUIZ_DATA).slice(0,10).map(q=>({...q,options:shuffle(q.options)})));
  const [idx,setIdx]=useState(0);const [sel,setSel]=useState(null);const [sc,setSc]=useState(0);const [done,setDone]=useState(false);const [wrongs,setWrongs]=useState([]);const [retry,setRetry]=useState(false);
  const q=qs[idx];
  const pick=o=>{if(sel!==null)return;setSel(o);if(o===q.answer)setSc(s=>s+1);else setWrongs(p=>[...p,q])};
  const next=()=>{if(idx+1>=qs.length)setDone(true);else{setIdx(i=>i+1);setSel(null)}};
  const doRetry=()=>{setQs(wrongs.map(w=>({...w,options:shuffle(w.options)})));setIdx(0);setSel(null);setSc(0);setDone(false);setWrongs([]);setRetry(true)};
  const doNew=()=>{setQs(shuffle(CONV_QUIZ_DATA).slice(0,10).map(q=>({...q,options:shuffle(q.options)})));setIdx(0);setSel(null);setSc(0);setDone(false);setWrongs([]);setRetry(false)};
  if(done) return <QuizResult title={retry?"復習完了！":"クイズ完了！"} total={qs.length} score={sc} wrongs={wrongs.length} onRetry={doRetry} onNew={doNew} onBack={onBack}/>;
  return (
    <div className="sec">
      <button className="bb" onClick={onBack}>← 戻る</button>
      <div className="cp">{retry?"🔁 復習モード":"💬 会話クイズ"} ── {idx+1} / {qs.length}</div>
      <div className="pbw"><div className="pbf" style={{width:`${(idx/qs.length)*100}%`}}/></div>
      <div className="conv-quiz-ctx">
        {q.context.map((c,i)=><div key={i} className={`conv-quiz-bubble ${c.speaker==="you"?"you":"oth"}`}><div className="cqb-zh">{c.zh}</div></div>)}
        <div className="conv-quiz-blank">❓ {q.blank==="you"?"あなたの返答は？":"相手の返答は？"}</div>
      </div>
      <div className="quiz-opts">{q.options.map((o,i)=>{
        let c="quiz-opt";if(sel!==null){c+=" answered";if(o===q.answer)c+=" correct";else if(o===sel)c+=" wrong";else c+=" dim"}
        return <button key={i} className={c} onClick={()=>pick(o)}><span className="quiz-opt-num">{sel!==null?(o===q.answer?"✓":o===sel?"✗":i+1):i+1}</span><span style={{fontSize:14}}>{o}</span></button>
      })}</div>
      {sel!==null&&<>
        <div className={`quiz-feedback ${sel===q.answer?"ok":"ng"}`}>{sel===q.answer?"正解！🎉":"不正解…"}</div>
        <div className="gbox" style={{marginBottom:12}}><div className="gbox-t">📘 解説</div><div className="gbox-exp">{q.explain}</div></div>
        <button className="quiz-next" onClick={next}>{idx+1>=qs.length?"結果を見る →":"次の問題 →"}</button></>}
    </div>
  );
}

// === GRAMMAR QUIZ (穴埋め + 復習) ===
function GrammarQuizScreen({ onBack }) {
  const [qs,setQs]=useState(()=>shuffle(GRAMMAR_QUIZ_DATA).slice(0,10).map(q=>({...q,options:shuffle(q.options)})));
  const [idx,setIdx]=useState(0);const [sel,setSel]=useState(null);const [sc,setSc]=useState(0);const [done,setDone]=useState(false);const [wrongs,setWrongs]=useState([]);const [retry,setRetry]=useState(false);
  const q=qs[idx];
  const pick=o=>{if(sel!==null)return;setSel(o);if(o===q.answer)setSc(s=>s+1);else setWrongs(p=>[...p,q])};
  const next=()=>{if(idx+1>=qs.length)setDone(true);else{setIdx(i=>i+1);setSel(null)}};
  const doRetry=()=>{setQs(wrongs.map(w=>({...w,options:shuffle(w.options)})));setIdx(0);setSel(null);setSc(0);setDone(false);setWrongs([]);setRetry(true)};
  const doNew=()=>{setQs(shuffle(GRAMMAR_QUIZ_DATA).slice(0,10).map(q=>({...q,options:shuffle(q.options)})));setIdx(0);setSel(null);setSc(0);setDone(false);setWrongs([]);setRetry(false)};
  if(done) return <QuizResult title={retry?"復習完了！":"クイズ完了！"} total={qs.length} score={sc} wrongs={wrongs.length} onRetry={doRetry} onNew={doNew} onBack={onBack}/>;
  const parts=q.sentence.split("___");
  return (
    <div className="sec">
      <button className="bb" onClick={onBack}>← 戻る</button>
      <div className="cp">{retry?"🔁 復習モード":"📖 文法クイズ"} ── {idx+1} / {qs.length}</div>
      <div className="pbw"><div className="pbf" style={{width:`${(idx/qs.length)*100}%`}}/></div>
      <div className="quiz-q"><div className="quiz-q-label">空欄に入る正しい語は？</div><div className="gram-quiz-sentence">{parts[0]}<span className="gram-quiz-blank">{sel!==null?q.answer:"？"}</span>{parts[1]}</div></div>
      <div className="quiz-opts">{q.options.map((o,i)=>{
        let c="quiz-opt";if(sel!==null){c+=" answered";if(o===q.answer)c+=" correct";else if(o===sel)c+=" wrong";else c+=" dim"}
        return <button key={i} className={c} onClick={()=>pick(o)} style={{textAlign:"center",justifyContent:"center",fontSize:20,fontWeight:700}}><span className="quiz-opt-num">{sel!==null?(o===q.answer?"✓":o===sel?"✗":i+1):i+1}</span>{o}</button>
      })}</div>
      {sel!==null&&<>
        <div className={`quiz-feedback ${sel===q.answer?"ok":"ng"}`}>{sel===q.answer?"正解！🎉":`不正解… 正解は「${q.answer}」`}</div>
        <div className="gbox" style={{marginBottom:12}}><div className="gbox-t">📘 解説</div><div className="gbox-exp">{q.explain}</div></div>
        <button className="quiz-next" onClick={next}>{idx+1>=qs.length?"結果を見る →":"次の問題 →"}</button></>}
    </div>
  );
}

// === LISTENING VOCAB QUIZ (単語 + 復習) ===
function ListenVocabScreen({ onBack }) {
  const all=getAllWords();
  const mkLQ=(pool,n)=>shuffle(pool).slice(0,n).map(w=>{const wr=shuffle(pool.filter(x=>x.id!==w.id)).slice(0,3);return{word:w,options:shuffle([w,...wr])}});
  const [qs,setQs]=useState(()=>mkLQ(all,10));
  const [idx,setIdx]=useState(0);const [sel,setSel]=useState(null);const [sc,setSc]=useState(0);const [done,setDone]=useState(false);const [wrongs,setWrongs]=useState([]);const [retry,setRetry]=useState(false);const [playing,setPlaying]=useState(false);
  const q=qs[idx];
  const play=()=>{setPlaying(true);speakZh(q.word.hanzi,0.8);setTimeout(()=>setPlaying(false),1500)};
  useEffect(()=>{const t=setTimeout(()=>play(),500);return()=>clearTimeout(t)},[idx]);
  const pick=w=>{if(sel!==null)return;setSel(w.id);if(w.id===q.word.id)setSc(s=>s+1);else setWrongs(p=>[...p,q])};
  const next=()=>{if(idx+1>=qs.length)setDone(true);else{setIdx(i=>i+1);setSel(null)}};
  const doRetry=()=>{setQs(wrongs.map(w=>({...w,options:shuffle(w.options)})));setIdx(0);setSel(null);setSc(0);setDone(false);setWrongs([]);setRetry(true)};
  const doNew=()=>{setQs(mkLQ(all,10));setIdx(0);setSel(null);setSc(0);setDone(false);setWrongs([]);setRetry(false)};
  if(done) return <QuizResult title={retry?"復習完了！":"クイズ完了！"} total={qs.length} score={sc} wrongs={wrongs.length} onRetry={doRetry} onNew={doNew} onBack={onBack}/>;
  return (
    <div className="sec">
      <button className="bb" onClick={onBack}>← 戻る</button>
      <div className="cp">{retry?"🔁 復習モード":"🔊 リスニング単語"} ── {idx+1} / {qs.length}</div>
      <div className="pbw"><div className="pbf" style={{width:`${(idx/qs.length)*100}%`}}/></div>
      <div className="quiz-q">
        <div className="quiz-q-label">音声を聞いて正しい単語を選んでください</div>
        <button className={`quiz-q-speaker ${playing?"playing":""}`} onClick={play}>🔊</button>
        <div className="quiz-q-sub">タップして再生</div>
      </div>
      <div className="quiz-opts">{q.options.map((w,i)=>{
        let c="quiz-opt";if(sel!==null){c+=" answered";if(w.id===q.word.id)c+=" correct";else if(w.id===sel)c+=" wrong";else c+=" dim"}
        return <button key={i} className={c} onClick={()=>pick(w)}><span className="quiz-opt-num">{sel!==null?(w.id===q.word.id?"✓":w.id===sel?"✗":i+1):i+1}</span><b style={{fontSize:18}}>{w.hanzi}</b></button>
      })}</div>
      {sel!==null&&<>
        <div className={`quiz-feedback ${sel===q.word.id?"ok":"ng"}`}>{sel===q.word.id?"正解！🎉":`不正解… 正解は「${q.word.hanzi}」`}</div>
        <div className="gbox" style={{marginBottom:12}}><div className="gbox-t">📘 解説</div><div className="gbox-exp"><b>{q.word.hanzi}</b>（{q.word.bopomofo} / {q.word.pinyin}）<br/>意味：{q.word.meaning}<br/>例文：{q.word.example}（{q.word.exampleMeaning}）</div></div>
        <button className="quiz-next" onClick={next}>{idx+1>=qs.length?"結果を見る →":"次の問題 →"}</button></>}
    </div>
  );
}

// === LISTENING CONV QUIZ (会話 + 復習) ===
function ListenConvScreen({ onBack }) {
  const [qs,setQs]=useState(()=>shuffle(CONV_QUIZ_DATA).slice(0,10).map(q=>({...q,options:shuffle(q.options)})));
  const [idx,setIdx]=useState(0);const [sel,setSel]=useState(null);const [sc,setSc]=useState(0);const [done,setDone]=useState(false);const [wrongs,setWrongs]=useState([]);const [retry,setRetry]=useState(false);const [playing,setPlaying]=useState(false);
  const q=qs[idx];
  const playAll=()=>{setPlaying(true);const texts=q.context.map(c=>c.zh).join("。");speakZh(texts,0.75);setTimeout(()=>setPlaying(false),2500)};
  useEffect(()=>{const t=setTimeout(()=>playAll(),500);return()=>clearTimeout(t)},[idx]);
  const pick=o=>{if(sel!==null)return;setSel(o);if(o===q.answer)setSc(s=>s+1);else setWrongs(p=>[...p,q])};
  const next=()=>{if(idx+1>=qs.length)setDone(true);else{setIdx(i=>i+1);setSel(null)}};
  const doRetry=()=>{setQs(wrongs.map(w=>({...w,options:shuffle(w.options)})));setIdx(0);setSel(null);setSc(0);setDone(false);setWrongs([]);setRetry(true)};
  const doNew=()=>{setQs(shuffle(CONV_QUIZ_DATA).slice(0,10).map(q=>({...q,options:shuffle(q.options)})));setIdx(0);setSel(null);setSc(0);setDone(false);setWrongs([]);setRetry(false)};
  if(done) return <QuizResult title={retry?"復習完了！":"クイズ完了！"} total={qs.length} score={sc} wrongs={wrongs.length} onRetry={doRetry} onNew={doNew} onBack={onBack}/>;
  return (
    <div className="sec">
      <button className="bb" onClick={onBack}>← 戻る</button>
      <div className="cp">{retry?"🔁 復習モード":"🎧 リスニング会話"} ── {idx+1} / {qs.length}</div>
      <div className="pbw"><div className="pbf" style={{width:`${(idx/qs.length)*100}%`}}/></div>
      <div className="quiz-q">
        <div className="quiz-q-label">会話を聞いて、適切な返答を選んでください</div>
        <button className={`quiz-q-speaker ${playing?"playing":""}`} onClick={playAll}>🔊</button>
        <div className="quiz-q-sub">タップして再生</div>
      </div>
      <div className="quiz-opts">{q.options.map((o,i)=>{
        let c="quiz-opt";if(sel!==null){c+=" answered";if(o===q.answer)c+=" correct";else if(o===sel)c+=" wrong";else c+=" dim"}
        return <button key={i} className={c} onClick={()=>pick(o)}><span className="quiz-opt-num">{sel!==null?(o===q.answer?"✓":o===sel?"✗":i+1):i+1}</span><span style={{fontSize:14}}>{o}</span></button>
      })}</div>
      {sel!==null&&<>
        <div className={`quiz-feedback ${sel===q.answer?"ok":"ng"}`}>{sel===q.answer?"正解！🎉":"不正解…"}</div>
        <div className="gbox" style={{marginBottom:12}}><div className="gbox-t">📘 解説</div><div className="gbox-exp">{q.context.map(c=>c.zh).join(" → ")}→<b>{q.answer}</b><br/>{q.explain}</div></div>
        <button className="quiz-next" onClick={next}>{idx+1>=qs.length?"結果を見る →":"次の問題 →"}</button></>}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [fcLevel, setFcLevel] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [grammarLesson, setGrammarLesson] = useState(null);
  const [rm, setRm] = useState("bopomofo");
  const nav = t => { if(t==="flashcard"){setFcLevel(null);setScreen("flashcardSelect");return} if(t==="phrases")setScenario(null); if(t==="grammar")setGrammarLesson(null); setScreen(t); };
  const quizScreens=["quiz","vocabQuiz","convQuiz","grammarQuiz","listenVocab","listenConv"];
  return (
    <><style>{S}</style>
    <div className="app-bg"><div className="cw">
      <Header/>
      <NavBar screen={screen} onNav={nav}/>
      {screen==="home"&&<HomeScreen onStartFC={l=>{setFcLevel(l);setScreen("flashcard")}} onNav={nav}/>}
      {screen==="flashcardSelect"&&<FlashcardSelectScreen onSelect={l=>{setFcLevel(l);setScreen("flashcard")}}/>}
      {screen==="flashcard"&&fcLevel&&<FlashcardScreen level={fcLevel} onBack={()=>setScreen("flashcardSelect")} rm={rm} setRm={setRm}/>}
      {screen==="phrases"&&<PhrasesListScreen onSelect={s=>{setScenario(s);setScreen("dialogue")}} rm={rm} setRm={setRm}/>}
      {screen==="dialogue"&&scenario&&<DialogueScreen scenario={scenario} onBack={()=>setScreen("phrases")} rm={rm} setRm={setRm}/>}
      {screen==="grammar"&&<GrammarListScreen onSelect={g=>{setGrammarLesson(g);setScreen("grammarDetail")}}/>}
      {screen==="grammarDetail"&&grammarLesson&&<GrammarDetailScreen lesson={grammarLesson} onBack={()=>setScreen("grammar")}/>}
      {screen==="pronunciation"&&<PronunciationScreen/>}
      {screen==="wordlist"&&<WordListScreen rm={rm}/>}
      {screen==="quiz"&&<QuizHubScreen onNav={setScreen}/>}
      {screen==="vocabQuiz"&&<VocabQuizScreen onBack={()=>setScreen("quiz")}/>}
      {screen==="convQuiz"&&<ConvQuizScreen onBack={()=>setScreen("quiz")}/>}
      {screen==="grammarQuiz"&&<GrammarQuizScreen onBack={()=>setScreen("quiz")}/>}
      {screen==="listenVocab"&&<ListenVocabScreen onBack={()=>setScreen("quiz")}/>}
      {screen==="listenConv"&&<ListenConvScreen onBack={()=>setScreen("quiz")}/>}
      {screen==="progress"&&<ProgressScreen/>}
    </div></div></>
  );
}
