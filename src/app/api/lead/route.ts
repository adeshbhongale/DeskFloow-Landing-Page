import { NextResponse } from "next/server";
import tls from "node:tls";

const RECIPIENTS = ["adeshbhongale007@gmail.com", "prasannagaikwad0018@gmail.com"];

interface LeadPayload {
  mode?: "demo" | "contact";
  name: string;
  email: string;
  phone: string;
  property?: string;
  propertyType?: string;
  rooms?: number | string;
  properties?: number | string;
  contactMethod: string;
  message?: string;
}

function formatEmailSubject(data: LeadPayload): string {
  return data.mode === "demo"
    ? `[DeskFloow Demo Request] ${data.property || "Hotel"} — ${data.name}`
    : `[DeskFloow Contact Inquiry] ${data.name}`;
}

function formatEmailBody(data: LeadPayload): string {
  if (data.mode === "demo") {
    return [
      `==================================================`,
      `DESKFLOOW PERSONALIZED DEMO REQUEST`,
      `==================================================`,
      ``,
      `Full Name          : ${data.name}`,
      `Work Email         : ${data.email}`,
      `Phone Number       : ${data.phone}`,
      `Hotel / Property   : ${data.property ?? "-"}`,
      `Property Type      : ${data.propertyType ?? "-"}`,
      `Total Rooms        : ${data.rooms ?? "-"}`,
      `Total Properties   : ${data.properties ?? "-"}`,
      `Preferred Contact  : ${data.contactMethod}`,
      ``,
      `--------------------------------------------------`,
      `Message / Workflows to Explore:`,
      `${data.message?.trim() ? data.message.trim() : "No additional notes provided."}`,
      `--------------------------------------------------`,
    ].join("\r\n");
  }

  return [
    `==================================================`,
    `DESKFLOOW CONTACT INQUIRY`,
    `==================================================`,
    ``,
    `Full Name          : ${data.name}`,
    `Email Address      : ${data.email}`,
    `Phone Number       : ${data.phone}`,
    `Preferred Contact  : ${data.contactMethod}`,
    ``,
    `--------------------------------------------------`,
    `Message:`,
    `${data.message?.trim() ? data.message.trim() : "No additional message provided."}`,
    `--------------------------------------------------`,
  ].join("\r\n");
}

/**
 * Direct SMTP over TLS (port 465) using Node's standard library `node:tls`.
 * No third-party npm packages required.
 */
function sendDirectSmtp({
  host,
  port,
  user,
  pass,
  recipients,
  replyTo,
  subject,
  body,
}: {
  host: string;
  port: number;
  user: string;
  pass: string;
  recipients: string[];
  replyTo: string;
  subject: string;
  body: string;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect({ host, port, servername: host }, () => {
      // Connected; wait for 220 greeting
    });

    socket.setEncoding("utf8");
    socket.setTimeout(12000);

    const commands: string[] = [
      `EHLO deskfloow.local`,
      `AUTH LOGIN`,
      Buffer.from(user).toString("base64"),
      Buffer.from(pass.replace(/\s+/g, "")).toString("base64"),
      `MAIL FROM:<${user}>`,
      ...recipients.map((rcpt) => `RCPT TO:<${rcpt}>`),
      `DATA`,
      [
        `From: "DeskFloow Website" <${user}>`,
        `To: ${recipients.join(", ")}`,
        `Reply-To: ${replyTo}`,
        `Subject: ${subject}`,
        `MIME-Version: 1.0`,
        `Content-Type: text/plain; charset=UTF-8`,
        ``,
        body,
        `.`,
      ].join("\r\n"),
      `QUIT`,
    ];

    let step = 0;
    let buffer = "";

    socket.on("data", (chunk: string) => {
      buffer += chunk;
      const lines = buffer.split("\r\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line) continue;
        // Multi-line response continues with '-' at index 3 (e.g. "250-...")
        if (line.length >= 4 && line[3] === "-") continue;

        const code = Number.parseInt(line.slice(0, 3), 10);
        if (code >= 400) {
          socket.destroy();
          reject(new Error(`SMTP Error (${code}): ${line}`));
          return;
        }

        if (step < commands.length) {
          const cmd = commands[step++];
          socket.write(`${cmd}\r\n`);
        } else {
          socket.end();
          resolve();
        }
      }
    });

    socket.on("timeout", () => {
      socket.destroy();
      reject(new Error("SMTP connection timed out"));
    });

    socket.on("error", (err) => {
      reject(err);
    });
  });
}

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as LeadPayload;
    const subject = formatEmailSubject(data);
    const body = formatEmailBody(data);

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const smtpUser = process.env.SMTP_USER || "adeshbhongale007@gmail.com";
    const smtpPass = process.env.SMTP_PASS || "";
    const recipients = process.env.MAIL_TO
      ? process.env.MAIL_TO.split(",").map((s) => s.trim()).filter(Boolean)
      : RECIPIENTS;

    // 1. If SMTP_PASS (Gmail App Password) is configured in .env.local, send directly via Node TLS SMTP
    if (smtpPass.trim()) {
      await sendDirectSmtp({
        host: smtpHost,
        port: smtpPort,
        user: smtpUser,
        pass: smtpPass,
        recipients,
        replyTo: data.email,
        subject,
        body,
      });

      return NextResponse.json({ ok: true, method: "smtp", recipients });
    }

    // 2. Fallback if SMTP_PASS is not yet set in .env.local: dispatch in background via AJAX
    const payload: Record<string, string> = {
      _subject: subject,
      _cc: recipients.slice(1).join(","),
      _template: "box",
      _captcha: "false",
      "Submission Type": data.mode === "demo" ? "Personalized Demo Request" : "Contact Inquiry",
      "Full Name": data.name,
      "Email Address": data.email,
      "Phone Number": data.phone,
      "Preferred Contact": data.contactMethod,
      ...(data.mode === "demo"
        ? {
            "Hotel / Property": String(data.property ?? "-"),
            "Property Type": String(data.propertyType ?? "-"),
            "Total Rooms": String(data.rooms ?? "-"),
            "Total Properties": String(data.properties ?? "-"),
          }
        : {}),
      Message: data.message?.trim() || "No additional notes provided.",
    };

    await fetch(`https://formsubmit.co/ajax/${recipients[0]}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    }).catch(() => null);

    return NextResponse.json({ ok: true, method: "direct-relay", recipients });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to dispatch email";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

