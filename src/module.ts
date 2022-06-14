import axios from "axios";
import { URLSearchParams } from "url";

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

class Acure {
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
    console.log(res.data);
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
  async regist(url: `https://members.acure-fun.net/wbam/mem_entry.php?id=${string}`) {
    const { headers } = await axios.get(url);
    const cookie1 = headers["set-cookie"]?.join("; ");
  }
}

export default new Acure();