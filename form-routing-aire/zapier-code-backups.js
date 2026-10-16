// Safely escape user-submitted content before placing it into HTML.
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function hasValue(value) {
  return value !== undefined &&
         value !== null &&
         String(value).trim() !== "";
}

// Handles checkbox values such as true, false, on, off, yes, no, etc.
function isSelected(value) {
  if (!hasValue(value)) return false;

  const normalizedValue = String(value).trim().toLowerCase();

  return ![
    "false",
    "no",
    "0",
    "off",
    "unchecked",
    "null",
    "undefined"
  ].includes(normalizedValue);
}

function field(label, value) {
  if (!hasValue(value)) return "";

  return `
    <div style="
      font-size:12px;
      font-weight:bold;
      text-transform:uppercase;
      letter-spacing:1px;
      color:#7b8794;
    ">
      ${escapeHtml(label)}
    </div>

    <div style="
      font-size:18px;
      color:#24292e;
      padding:8px 0 18px 0;
      border-bottom:1px solid #eceff3;
    ">
      ${escapeHtml(String(value).trim())}
    </div>

    <div style="height:18px;line-height:18px;">&nbsp;</div>
  `;
}

function sectionHeading(title) {
  return `
    <table role="presentation"
           width="100%"
           cellpadding="0"
           cellspacing="0"
           border="0">
      <tr>
        <td style="
          background:#f3f6fb;
          border-left:4px solid #1f2b4d;
          padding:14px 18px;
          font-size:15px;
          font-weight:bold;
          letter-spacing:1px;
          text-transform:uppercase;
          color:#1f2b4d;
        ">
          ${escapeHtml(title)}
        </td>
      </tr>
    </table>

    <div style="height:22px;line-height:22px;">&nbsp;</div>
  `;
}


// Form fields.
const firstName = inputData.first_name;
const lastName = inputData.last_name;
const email = inputData.email;
const phone = inputData.phone;
const broker = inputData.broker;
const message = inputData.message;

const condos = inputData.condos;
const townhomes = inputData.townhomes;


// Because the field name contains hyphens, bracket notation is required.
const isFromBlog = inputData["is_from_blog"];

// If the field exists and is checked, identify the submission as coming
// from the HHH Corp Blog. Otherwise, identify it as coming from Communities.
const submissionSource = isSelected(isFromBlog)
  ? "From HHH Corp Blog"
  : "From Communities Site";


// Build a list containing only the selected home types.
const selectedHomeTypes = [];

if (isSelected(condos)) {
  selectedHomeTypes.push("Condos");
}

if (isSelected(townhomes)) {
  selectedHomeTypes.push("Townhomes");
}


// Contact Information section.
// Fields without values are automatically omitted.
const contactSection = `
  ${sectionHeading("Contact Information")}
  ${field("First Name", firstName)}
  ${field("Last Name", lastName)}
  ${field("Email Address", email)}
  ${field("Phone Number", phone)}
`;


// Show selected home types only when at least one is selected.
const homeTypesBlock = selectedHomeTypes.length > 0
  ? `
      <div style="
        font-size:12px;
        font-weight:bold;
        text-transform:uppercase;
        letter-spacing:1px;
        color:#7b8794;
        margin-bottom:10px;
      ">
        Interested Home Types
      </div>

      <table role="presentation"
             width="100%"
             cellpadding="0"
             cellspacing="0"
             border="0"
             style="margin-bottom:18px;">

        ${selectedHomeTypes.map(homeType => `
          <tr>
            <td width="24"
                valign="top"
                style="
                  padding:7px 0;
                  font-size:18px;
                  line-height:22px;
                  color:#1f2b4d;
                ">
              &#10003;
            </td>

            <td valign="top"
                style="
                  padding:7px 0;
                  font-size:18px;
                  line-height:22px;
                  color:#24292e;
                ">
              ${escapeHtml(homeType)}
            </td>
          </tr>
        `).join("")}

      </table>

      <div style="
        height:1px;
        line-height:1px;
        background:#eceff3;
        margin-bottom:24px;
      ">&nbsp;</div>
    `
  : "";


// Show Preferences if Broker has a value or a home type is selected.
const preferencesSection =
  hasValue(broker) || selectedHomeTypes.length > 0
    ? `
        <div style="height:10px;line-height:10px;">&nbsp;</div>

        ${sectionHeading("Preferences")}

        ${homeTypesBlock}

        ${field("Broker", broker)}
      `
    : "";


// Only show the Message heading and box if a message exists.
const messageSection = hasValue(message)
  ? `
      <div style="height:10px;line-height:10px;">&nbsp;</div>

      ${sectionHeading("Message")}

      <div style="
        background:#fafbfc;
        border:1px solid #e6eaef;
        border-radius:6px;
        padding:20px;
        font-size:17px;
        line-height:28px;
        color:#24292e;
        white-space:pre-wrap;
      ">${escapeHtml(String(message).trim())}</div>
    `
  : "";


const htmlBody = `
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style="
  margin:0;
  padding:32px;
  background:#f6f7f9;
  font-family:Arial,Helvetica,sans-serif;
">

  <table role="presentation"
         cellpadding="0"
         cellspacing="0"
         border="0"
         width="100%"
         style="width:100%;background:#f6f7f9;">
    <tr>
      <td align="center">

        <table role="presentation"
               cellpadding="0"
               cellspacing="0"
               border="0"
               width="600"
               style="
                 width:100%;
                 max-width:600px;
                 background:#ffffff;
                 border:1px solid #e6eaef;
                 border-radius:8px;
                 border-collapse:separate;
                 overflow:hidden;
               ">

          <!-- Header -->
          <tr>
            <td style="
              padding:32px;
              border-bottom:1px solid #eceff3;
            ">

              <div style="
                font-size:13px;
                font-weight:bold;
                letter-spacing:2px;
                text-transform:uppercase;
                color:#8b96a3;
                margin-bottom:12px;
              ">
                New Interest List Submission - ${escapeHtml(submissionSource)}
              </div>

              <div style="
                font-family:Georgia,serif;
                font-size:46px;
                line-height:50px;
                color:#1f2b4d;
              ">
                The Aire
              </div>

            </td>
          </tr>

          <!-- Submission content -->
          <tr>
            <td style="padding:32px;">

              ${contactSection}
              ${preferencesSection}
              ${messageSection}

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;


// Plain-text fallback.
const plainTextFields = [
  ["First Name", firstName],
  ["Last Name", lastName],
  ["Email Address", email],
  ["Phone Number", phone]
];

const plainBodyLines = [
  `NEW INTEREST LIST SUBMISSION - ${submissionSource.toUpperCase()}`,
  "The Aire",
  "",
  ...plainTextFields
    .filter(([, value]) => hasValue(value))
    .map(([label, value]) => `${label}: ${String(value).trim()}`)
];

if (selectedHomeTypes.length > 0) {
  plainBodyLines.push(
    "",
    "INTERESTED HOME TYPES",
    ...selectedHomeTypes.map(homeType => `- ${homeType}`)
  );
}

if (hasValue(broker)) {
  plainBodyLines.push(
    "",
    `Broker: ${String(broker).trim()}`
  );
}

if (hasValue(message)) {
  plainBodyLines.push(
    "",
    "MESSAGE",
    String(message).trim()
  );
}

const plainBody = plainBodyLines.join("\n");


return {
  html_body: htmlBody,
  plain_body: plainBody
};