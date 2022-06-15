import axios from "axios";
import { URLSearchParams, URL } from "url";
import { load as cheerioLoad } from "cheerio";

type UUID = `${string}-${string}-4${string}-${string}-${string}`;

type TempMailMailBody = {
  id: UUID,
  from: string,
  to: string,
  cc: string | null,
  subject: string | null,
  body_text: string | null,
  body_html: string | null,
  created_at: string,
  attachments: string[],
};

type TempMailNew = {
  email: string,
  token: string,
}

type Headers = {
  'Accept': string,
  'Accept-Language': string,
  'Connection': 'keep-alive',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
  'sec-ch-ua': '"Google Chrome";v="105", ")Not;A=Brand";v="8", "Chromium";v="105"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  "cookie"?: string,
  "Content-Type": "application/x-www-form-urlencoded",
}

class Acure {
  static randomString(length: number) {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
  async newMail() {
    const { data } = await axios.post<TempMailNew>(`https://api.internal.temp-mail.io/api/v3/email/new`, {});
    return data.email;
  }
  async checkMailInbox(email: string) {
    const { data } = await axios.get<TempMailMailBody[]>(`https://api.internal.temp-mail.io/api/v3/email/${email}/messages`);
    return data;
  }
  async requestBlankMail(email: string) {
    const { headers } = await axios.get("https://members.acure-fun.net/wbam/PC/member/mem_kmail.php?");
    const PT_JEIS_MGSID = headers["set-cookie"]?.find((c) => c.startsWith("PT_JEIS_MGSID="))?.split(";")[0].split("=")[1];
    const params = new URLSearchParams();
    params.append("Submit_Flag", "UPDATE");
    params.append("PT_JEIS_MGSID", PT_JEIS_MGSID!);
    params.append("mail", email);
    const res = await axios.post(`https://members.acure-fun.net/wbam/PC/member/mem_kmail_fin.php`, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.115 Safari/537.36",
        "cookie": headers["set-cookie"]!.join("; "),
      },
    });
    if (res.data.indexOf("送信しました") > -1) {
      return true;
    } else {
      return false;
    }
  }
  async findRegistMail(email: string): Promise<`https://members.acure-fun.net/wbam/mem_entry.php?id=${string}`> {
    while (true) {
      const mails = await this.checkMailInbox(email);
      if (mails.length > 0) {
        const mail = mails.find(x => x.body_text?.includes("https://members.acure-fun.net/wbam/mem_entry.php"));
        if (mail) {
          const r = mail.body_text?.match(/https?:\/\/members\.acure-fun\.net\/wbam\/mem_entry\.php\?id=[0-9a-f]{32}/)?.[0];
          if (r) { return r as `https://members.acure-fun.net/wbam/mem_entry.php?id=${string}`; } 
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  async regist(url: `https://members.acure-fun.net/wbam/mem_entry.php?id=${string}`, mail: string, memReg1Callback: () => void, memReg2Callback: () => void, memRegConfCallback: () => void, doneCallback: () => void) {
    const tempId = new URL(url).searchParams.get("id") as string;
    const headers: Headers = {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'Accept-Language': 'ja',
      'Connection': 'keep-alive',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
      'sec-ch-ua': '"Google Chrome";v="105", ")Not;A=Brand";v="8", "Chromium";v="105"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const { headers: resHeaders, data: kMailData } = await axios.get(url);
    const cookie1 = resHeaders["set-cookie"]?.join("; ");
    headers["cookie"] = cookie1;
    const params1 = new URLSearchParams({
      "Submit_Flag": "NEXT",
      agree: "on"
    });
    const { data: kMailData2, request: kMailRequest } = await axios.post(`https://members.acure-fun.net/wbam/PC/member/mem_agreement.php?id=${tempId}`, params1, { headers });
    if (kMailRequest.res.responseUrl.includes("mem_reg1")) {
      memReg1Callback();
      const params2 = new URLSearchParams({
        'Submit_Flag': 'NEXT',
        'PASSWORD': 'KohnoseLami1234',
        'PASSWORD2': 'KohnoseLami1234',
        'WORK': '',
        'WORK2': '',
        'MAIL1': mail,
        'INFOFLG1': '0',
        'REMARK4': '0',
        'SEX': '0',
        'BIRTHYEAR': '1980',
        'BIRTHMONTH': '1',
        'BIRTHDAY': '1',
        'CARD_A': '',
        'CARD_A1': '',
        'CARD_A2': '',
        'CARD_A3': '',
        'CARD_A4': '',
        'CARD_B': '',
        'CARD_B1': '',
        'CARD_B2': '',
        'CARD_B3': '',
        'CARD_B4': '',
        'CARD_C': '',
        'CARD_C1': '',
        'CARD_C2': '',
        'CARD_C3': '',
        'CARD_C4': '',
        'REMARK1': '',
      });
      const { data: kMailData3, request: kMailRequest3 } = await axios.post(`https://members.acure-fun.net/wbam/PC/member/mem_reg1.php`, params2, { headers });
      if (kMailRequest3.res.responseUrl.includes("mem_reg2")) {
        memReg2Callback();
        const params3 = new URLSearchParams({
          'hid_addr': '',
          'Submit_Flag': 'ON',
          'NAMEL': '鈴木',
          'NAMEF': '隆',
          'NAMEKANAL': 'スズキ',
          'NAMEKANAF': 'タカシ',
          'ZIP1': '757',
          'ZIP2': '0213',
          'ADDR1': '山口県',
          'ADDR2': '宇部市奥万倉',
          'ADDR3': '',
          'PHONE_1': '',
          'PHONE_2': '',
          'PHONE_3': '',
          'REMARK6': Acure.randomString(10),
          'REMARK5': 'jx19121',
        });
        const { data: kMailData4, request: kMailRequest4 } = await axios.post(`https://members.acure-fun.net/wbam/PC/member/mem_reg2.php`, params3, { headers });
        if (kMailRequest4.res.responseUrl.includes("mem_reg_conf")) {
          memRegConfCallback();
          const $2 = cheerioLoad(kMailData4);
          const params4 = new URLSearchParams({
            "Submit_Flag": "ON",
            "ERR_FLG_VALUE": "\xA0\xA0",
            "ConfBack_Flag": "ON",
            "token": $2("input[name=token]").val() as string
          });
          const { data: kMailData5, request: kMailRequest5 } = await axios.post(`https://members.acure-fun.net/wbam/PC/member/mem_reg_conf.php`, params4, { headers });
          if (kMailRequest5.res.responseUrl.includes("mem_reg_fin")) {
            doneCallback();
          }
        }
      }
    }
  }
}

export default new Acure();