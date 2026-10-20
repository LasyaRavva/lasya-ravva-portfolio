# Contact form setup (EmailJS)

The portfolio sends inquiries through EmailJS from the browser. This file contains the current variable contract and a paste-ready, business-style notification template. EmailJS stores the actual message layout in its dashboard, so edits here must also be pasted into the dashboard template.

## Premium project inquiry notification

In **EmailJS → Email Templates**, edit the template whose ID is `VITE_EMAILJS_TEMPLATE_ID`:

1. Set **To Email** to your inbox.
2. Set **Reply-To** to `{{reply_to}}` so replies go to the potential client.
3. Set **From Name** to `Lasya | Freelance Web Developer`.
4. Set **Subject** to:

   ```text
   New Project Inquiry — {{service}}
   ```

5. Switch the content editor to HTML and replace the old template body with the complete HTML below. It uses EmailJS conditional sections for optional fields; keep the section markers intact.

   ```html
   <style>
     @media only screen and (max-width: 600px) {
       .email-outer { padding: 12px 6px !important; }
       .email-content { padding: 22px 18px !important; }
       .stack-column { display: block !important; width: 100% !important; }
       .stack-column-inner { padding: 6px 0 !important; }
     }
   </style>
   <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#f4f4f7;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;color:#252438;">
     <tr>
       <td class="email-outer" align="center" style="padding:28px 12px;">
         <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #e5e5ec;border-radius:12px;border-collapse:separate;">
           <tr>
             <td style="padding:20px 28px;border-bottom:1px solid #ececf1;">
               <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                 <tr>
                   <td style="font-size:17px;font-weight:bold;color:#201d31;">Lasya.<br><span style="font-size:12px;font-weight:normal;color:#727180;">Freelance Web Developer</span></td>
                   <td align="right" style="font-size:10px;font-weight:bold;letter-spacing:1.5px;color:#6248d8;">NEW INQUIRY</td>
                 </tr>
               </table>
             </td>
           </tr>
           <tr>
             <td class="email-content" style="padding:28px;">
               <p style="margin:0 0 8px;font-size:11px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#777487;">New project inquiry</p>
               <h1 style="margin:0;font-size:25px;line-height:1.3;color:#201d31;">{{name}} is interested in working with you.</h1>
               <p style="margin:16px 0 0;padding:9px 13px;display:inline-block;border:1px solid #e5e0fb;border-radius:6px;background:#f7f5ff;color:#5740bd;font-size:14px;font-weight:bold;">{{service}}</p>

               <h2 style="margin:30px 0 12px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#777487;">Project summary</h2>
               <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border:1px solid #e9e8ef;border-radius:8px;border-collapse:separate;background:#fbfbfd;">
                 <tr>
                   <td colspan="2" style="padding:14px 16px;border-bottom:1px solid #e9e8ef;">
                     <span style="display:block;font-size:11px;color:#777487;">Project type</span>
                     <span style="display:block;margin-top:4px;font-size:15px;font-weight:bold;color:#252438;">{{service}}</span>
                   </td>
                 </tr>
               <tr>
                   <td class="stack-column" width="50%" style="width:50%;padding:14px 16px;">
                     <div class="stack-column-inner"><span style="display:block;font-size:11px;color:#777487;">Budget</span><span style="display:block;margin-top:4px;font-size:14px;font-weight:bold;color:#252438;">{{budget}}</span></div>
                   </td>
                   <td class="stack-column" width="50%" style="width:50%;padding:14px 16px;border-left:1px solid #e9e8ef;">
                     <div class="stack-column-inner"><span style="display:block;font-size:11px;color:#777487;">Timeline</span><span style="display:block;margin-top:4px;font-size:14px;font-weight:bold;color:#252438;">{{timeline}}</span></div>
                   </td>
                 </tr>
               </table>

               <h2 style="margin:28px 0 10px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#777487;">Client</h2>
               <p style="margin:0 0 5px;font-size:18px;font-weight:bold;color:#252438;">{{name}}</p>
               <p style="margin:4px 0;font-size:14px;overflow-wrap:anywhere;"><a href="mailto:{{email}}" style="color:#5740bd;text-decoration:underline;">{{email}}</a></p>
               {{#has_company}}<p style="margin:4px 0;font-size:14px;color:#555465;">{{company}}</p>{{/has_company}}
               {{#has_website}}<p style="margin:4px 0;font-size:14px;overflow-wrap:anywhere;"><a href="{{website}}" style="color:#5740bd;text-decoration:underline;">{{website}}</a></p>{{/has_website}}

               <h2 style="margin:28px 0 10px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#777487;">Project brief</h2>
               <div style="padding:17px 18px;border-left:3px solid #7658ef;background:#f7f6fb;color:#333244;font-size:15px;line-height:1.7;white-space:pre-line;">{{description}}</div>

               <p style="margin:26px 0 0;font-size:14px;line-height:1.6;color:#454354;">Ready to review the opportunity? Reply directly to this email to continue the conversation with {{name}}.</p>
             </td>
           </tr>
           <tr>
             <td style="padding:18px 28px;border-top:1px solid #ececf1;">
               <p style="margin:0;font-size:13px;font-weight:bold;color:#454354;">Lasya. <span style="font-weight:normal;color:#777487;">Freelance Web Developer</span></p>
               <p style="margin:8px 0;font-size:12px;">
                 <a href="{{portfolio_url}}" style="color:#5740bd;text-decoration:none;">Portfolio</a>
                 <span style="color:#aaa8b4;">&nbsp;·&nbsp;</span>
                 <a href="{{linkedin}}" style="color:#5740bd;text-decoration:none;">LinkedIn</a>
                 <span style="color:#aaa8b4;">&nbsp;·&nbsp;</span>
                 <a href="{{github}}" style="color:#5740bd;text-decoration:none;">GitHub</a>
               </p>
               <p style="margin:10px 0 0;font-size:11px;color:#8b8997;">Received on {{submitted_at}}</p>
             </td>
           </tr>
         </table>
       </td>
     </tr>
   </table>
   ```

EmailJS conditional sections use `{{#variable}}...{{/variable}}`; an empty or false value hides that section. Company and website remain optional, so the form sends empty strings plus `has_company` and `has_website` flags to hide those client details when not provided. Budget and timeline are now required and always appear in the project summary. This behavior is supported by [EmailJS dynamic variable templates](https://www.emailjs.com/docs/user-guide/dynamic-variables-templates/).

## Template variables sent by the form

Required values: `name`, `email`, `reply_to`, `service`, `description`, `budget`, `timeline`, and `submitted_at`.

Optional values and visibility flags: `company` / `has_company` and `website` / `has_website`.

Footer links: `portfolio_url`, `linkedin`, and `github`. The portfolio URL uses the live site's current origin; social links come from `src/data/site.js`.

## Configure and check delivery

1. Connect the inbox that should receive inquiries as an EmailJS Email Service.
2. Copy the Email Service ID, Email Template ID, and Public Key into `.env.local` and the deployment host's environment settings as `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY`.
3. Restrict allowed origins in EmailJS to your deployed domain. Add localhost only for local testing.
4. Save the template and use EmailJS's test preview with sample values. Then submit a real portfolio inquiry and verify the subject, Reply-To, optional field hiding, and mobile layout in Gmail or another email client.

Vite embeds `VITE_` values into the browser bundle. The EmailJS public key is designed for browser use, but never put a private key, password, or API secret in these variables. Keep the template recipient fixed in the dashboard. The HTML is designed with inline styles and table layout for broad email-client compatibility; individual clients may render minor differences.
