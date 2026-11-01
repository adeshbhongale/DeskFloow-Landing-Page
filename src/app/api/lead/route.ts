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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatEmailBody(data: LeadPayload): string {
  const isDemo = data.mode === "demo";
  const badgeText = isDemo ? "✦ 1-on-1 Live Product Walkthrough" : "✦ Direct Hospitality Desk";
  const titleText = isDemo ? "Personalized Demo Request" : "Website Contact Inquiry";
  const subtitleText = isDemo
    ? `New walkthrough request from ${escapeHtml(data.name)} for ${escapeHtml(String(data.property || "their property"))}.`
    : `New inquiry received from ${escapeHtml(data.name)} via DeskFloow.`;

  const messageText = escapeHtml(
    data.message?.trim()
      ? data.message.trim()
      : isDemo
        ? "No additional notes provided."
        : "No additional message provided."
  ).replace(/\r?\n/g, "<br />");

  const rows: Array<{ label: string; value: string; isHtml?: boolean }> = [
    { label: "Submission Type", value: isDemo ? "Personalized Demo Request" : "Contact Inquiry" },
    { label: "Full Name", value: escapeHtml(data.name) },
    {
      label: "Email Address",
      value: `<a href="mailto:${escapeHtml(data.email)}" style="color:#5f22d9;text-decoration:none;font-weight:600;">${escapeHtml(data.email)}</a>`,
      isHtml: true,
    },
    {
      label: "Phone Number",
      value: `<a href="tel:${escapeHtml(data.phone)}" style="color:#1d0947;text-decoration:none;font-weight:600;">${escapeHtml(data.phone)}</a>`,
      isHtml: true,
    },
    { label: "Preferred Contact", value: escapeHtml(data.contactMethod) },
    ...(isDemo
      ? [
          { label: "Hotel / Property", value: escapeHtml(String(data.property ?? "-")) },
          { label: "Property Type", value: escapeHtml(String(data.propertyType ?? "-")) },
          { label: "Total Rooms", value: escapeHtml(String(data.rooms ?? "-")) },
          { label: "Total Properties", value: escapeHtml(String(data.properties ?? "-")) },
        ]
      : []),
  ];

  const rowsHtml = rows
    .map(
      (row, idx) => `
        <tr>
          <td style="padding:13px 18px;border-bottom:${idx === rows.length - 1 ? "none" : "1px solid #ede5ff"};width:38%;font-size:12.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;color:#5f22d9;vertical-align:middle;">
            ${row.label}
          </td>
          <td style="padding:13px 18px;border-bottom:${idx === rows.length - 1 ? "none" : "1px solid #ede5ff"};font-size:14.5px;font-weight:600;color:#1d0947;vertical-align:middle;">
            ${row.isHtml ? row.value : row.value}
          </td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(titleText)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f6f2ff;font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1d0947;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(180deg,#ede5ff 0%,#f6f2ff 45%,#ffffff 100%);background-color:#f6f2ff;padding:36px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background-color:#ffffff;border-radius:28px;overflow:hidden;border:1px solid #dcceff;box-shadow:0 12px 36px rgba(29,9,71,0.12);">
          <!-- Top Theme-Graded Banner (matches LeadForm header) -->
          <tr>
            <td style="background:linear-gradient(90deg,#1d0947 0%,#4c1cb0 52%,#5f22d9 100%);background-color:#1d0947;padding:26px 32px;border-bottom:1px solid rgba(220,206,255,0.35);color:#ffffff;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left">
                    <span style="display:inline-block;background-color:rgba(251,191,36,0.20);border:1px solid rgba(252,211,77,0.45);color:#fde68a;font-size:11.5px;font-weight:700;padding:5px 13px;border-radius:999px;">
                      ${badgeText}
                    </span>
                  </td>
                  <td align="right" style="font-size:11.5px;font-weight:600;color:#ede5ff;">
                    Fast response &middot; Direct specialist inbox
                  </td>
                </tr>
              </table>
              <h1 style="margin:14px 0 6px 0;font-size:22px;line-height:1.25;font-weight:800;color:#ffffff;letter-spacing:-0.4px;">
                ${titleText}
              </h1>
              <p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(255,255,255,0.84);">
                ${subtitleText}
              </p>
            </td>
          </tr>

          <!-- Clean Theme Details List (no gray boxes) -->
          <tr>
            <td style="padding:28px 32px 12px 32px;background:linear-gradient(180deg,#ffffff 0%,#faf8ff 100%);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                ${rowsHtml}
              </table>
            </td>
          </tr>

          <!-- Message Highlight Section -->
          <tr>
            <td style="padding:12px 32px 24px 32px;background-color:#faf8ff;">
              <div style="font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#5f22d9;margin-bottom:8px;">
                ${isDemo ? "Workflows to Explore" : "Inquiry Message"}
              </div>
              <div style="background-color:#f6f2ff;border-left:4px solid #7332f6;border-radius:0 14px 14px 0;padding:14px 18px;font-size:14px;line-height:1.65;color:#1d0947;">
                ${messageText}
              </div>
            </td>
          </tr>

          <!-- Royal Purple & Gold Bottom Strip (matches BookDemo / Contact page card) -->
          <tr>
            <td style="background:linear-gradient(90deg,#1d0947 0%,#4c1cb0 50%,#35137d 100%);background-color:#1d0947;padding:22px 32px;color:#ffffff;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" style="vertical-align:middle;">
                    <div style="font-size:13.5px;font-weight:700;color:#fcd34d;">
                      DeskFloow Hospitality Cloud
                    </div>
                    <div style="font-size:12px;color:rgba(255,255,255,0.80);margin-top:2px;">
                      Direct specialist lead notification
                    </div>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <a href="mailto:${escapeHtml(data.email)}?subject=Re:%20${encodeURIComponent(formatEmailSubject(data))}" style="display:inline-block;background-color:#fbbf24;color:#1d0947;font-size:12.5px;font-weight:800;text-decoration:none;padding:10px 18px;border-radius:999px;">
                      Reply to ${escapeHtml(data.name.split(" ")[0] || data.name)} &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
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
        `From: "DeskFloow Hospitality" <${user}>`,
        `To: ${recipients.join(", ")}`,
        `Reply-To: ${replyTo}`,
        `Subject: =?UTF-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`,
        `MIME-Version: 1.0`,
        `Content-Type: text/html; charset=UTF-8`,
        `Content-Transfer-Encoding: base64`,
        ``,
        Buffer.from(body, "utf8").toString("base64").replace(/(.{76})/g, "$1\r\n"),
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

    const smtpHost = "smtp.gmail.com";
    const smtpPort = 465;
    const smtpUser = "adeshbhongale007@gmail.com";
    const smtpPass = "";
    const recipients = ["adeshbhongale007@gmail.com", "prasannagaikwad0018@gmail.com"];

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

    // 2. Fallback when smtpPass is empty: return direct-relay so browser dispatches once (prevents double email)
    return NextResponse.json({ ok: true, method: "direct-relay", recipients });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to dispatch email";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

