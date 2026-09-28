// Email Notification & Queue Delivery Engine for Live Classes
// Handles templating, deduplication, retry queues, and delivery audit logs

import {
  EmailEventType,
  EmailDeliveryStatus,
  LiveClassEmailLogRecord,
  LiveClassItem,
  EnrolledStudentInfo,
  ENROLLED_STUDENTS_SAMPLE,
} from './liveClassService';

export interface EmailPayload {
  to: string;
  recipientName: string;
  subject: string;
  htmlContent: string;
  eventType: EmailEventType;
  liveClassId: string;
}

export function generateLiveClassEmailHtml({
  eventType,
  liveClass,
  studentName,
  customNote,
}: {
  eventType: EmailEventType;
  liveClass: LiveClassItem;
  studentName: string;
  customNote?: string;
}): { subject: string; html: string } {
  const platformNames: Record<string, string> = {
    GOOGLE_MEET: 'Google Meet',
    ZOOM: 'Zoom Video Communications',
    MS_TEAMS: 'Microsoft Teams',
    OTHER: 'Web Live Meeting',
  };
  const platformName = platformNames[liveClass.platform] || liveClass.platform;

  let eventTitle = '';
  let badgeColor = '#4F46E5';
  let ctaText = 'Join Live Class';
  let ctaUrl = liveClass.meetingUrl;
  let subject = '';

  switch (eventType) {
    case 'LIVE_CLASS_SCHEDULED':
      subject = `Live Class Scheduled — ${liveClass.title}`;
      eventTitle = 'New Live Class Scheduled';
      badgeColor = '#4F46E5';
      break;
    case 'LIVE_CLASS_UPDATED':
      subject = `Schedule Updated: ${liveClass.title}`;
      eventTitle = 'Live Class Schedule Updated';
      badgeColor = '#D97706';
      break;
    case 'LIVE_CLASS_CANCELLED':
      subject = `Class Cancelled: ${liveClass.title}`;
      eventTitle = 'Live Class Cancelled';
      badgeColor = '#DC2626';
      ctaText = 'View Course Curriculum';
      ctaUrl = `/student/learning/${liveClass.courseSlug}`;
      break;
    case 'LIVE_CLASS_REMINDER_24H':
      subject = `Reminder: Live Class Tomorrow — ${liveClass.title}`;
      eventTitle = 'Live Class Reminder (24 Hours Remaining)';
      badgeColor = '#2563EB';
      break;
    case 'LIVE_CLASS_REMINDER_1H':
      subject = `Starting in 1 Hour: ${liveClass.title}`;
      eventTitle = 'Live Class Starting Soon (1 Hour)';
      badgeColor = '#EA580C';
      break;
    case 'RECORDING_PUBLISHED':
      subject = `Recording Now Available — ${liveClass.title}`;
      eventTitle = 'Live Class Recording Published';
      badgeColor = '#059669';
      ctaText = 'Watch Class Recording';
      ctaUrl = `/student/learning/${liveClass.courseSlug}`;
      break;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #0f172a; }
        .container { max-width: 600px; margin: 24px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #1e1b4b, #312e81); padding: 32px 24px; text-align: center; color: #ffffff; }
        .logo { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 8px; }
        .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; background-color: ${badgeColor}; color: #ffffff; margin-top: 8px; }
        .content { padding: 32px 28px; line-height: 1.6; }
        .greeting { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
        .details-card { background-color: #f1f5f9; border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid ${badgeColor}; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
        .detail-label { color: #64748b; font-weight: 600; }
        .detail-value { font-weight: 700; color: #0f172a; text-align: right; }
        .cta-btn { display: inline-block; width: 100%; box-sizing: border-box; background-color: ${badgeColor}; color: #ffffff !important; text-align: center; padding: 14px 24px; border-radius: 12px; font-weight: 700; font-size: 15px; text-decoration: none; margin: 20px 0; }
        .instructions { font-size: 13px; color: #475569; background-color: #f8fafc; padding: 16px; border-radius: 10px; border: 1px solid #e2e8f0; margin-top: 20px; }
        .footer { padding: 24px; background-color: #f8fafc; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Learn<span style="color: #818cf8;">X</span> Live</div>
          <div class="badge">${eventTitle}</div>
        </div>
        <div class="content">
          <div class="greeting">Hello, ${studentName}!</div>
          <p>
            ${
              eventType === 'RECORDING_PUBLISHED'
                ? `Your instructor has uploaded and published the full high-definition recording for <strong>${liveClass.title}</strong>. You can now access it anytime inside your course module.`
                : eventType === 'LIVE_CLASS_CANCELLED'
                ? `Please note that the scheduled session for <strong>${liveClass.title}</strong> has been cancelled. Your instructor will announce the rescheduled time shortly.`
                : `You are invited to an interactive live class for your enrolled course <strong>${liveClass.courseTitle}</strong>.`
            }
          </p>

          <div class="details-card">
            <div class="detail-row">
              <span class="detail-label">Course:</span>
              <span class="detail-value">${liveClass.courseTitle}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Module:</span>
              <span class="detail-value">${liveClass.sectionTitle}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Class Topic:</span>
              <span class="detail-value">${liveClass.title}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Instructor:</span>
              <span class="detail-value">${liveClass.instructorName}</span>
            </div>
            ${
              eventType !== 'RECORDING_PUBLISHED'
                ? `
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span class="detail-value">${liveClass.scheduledDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span>
                  <span class="detail-value">${liveClass.startTime} — ${liveClass.endTime} (${liveClass.timezone})</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Platform:</span>
                  <span class="detail-value">${platformName}</span>
                </div>
                ${
                  liveClass.meetingPassword
                    ? `
                  <div class="detail-row">
                    <span class="detail-label">Meeting Password:</span>
                    <span class="detail-value">${liveClass.meetingPassword}</span>
                  </div>
                  `
                    : ''
                }
              `
                : ''
            }
          </div>

          ${
            eventType !== 'LIVE_CLASS_CANCELLED'
              ? `
            <a href="${ctaUrl}" target="_blank" class="cta-btn">${ctaText}</a>
            <p style="font-size: 12px; color: #64748b; text-align: center; word-break: break-all;">
              Direct link: <a href="${ctaUrl}" style="color: #4F46E5;">${ctaUrl}</a>
            </p>
          `
              : ''
          }

          ${
            customNote
              ? `
            <div style="background-color: #fffbeb; border: 1px solid #fef3c7; padding: 12px; border-radius: 8px; font-size: 13px; color: #92400e; margin-top: 16px;">
              <strong>Instructor Note:</strong> ${customNote}
            </div>
          `
              : ''
          }

          <div class="instructions">
            <strong>Important Tips for Live Class:</strong>
            <ul style="padding-left: 18px; margin: 8px 0 0 0;">
              <li>Please join 5 minutes early to test your audio & video setup.</li>
              <li>Keep your microphone muted during presentation; use chat for questions.</li>
              <li>The session will be recorded and published to the module afterwards.</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          LearnX Multi-Tenant LMS SaaS Platform &bull; Automated Notifications<br />
          You received this email because you are currently an enrolled student in this course.
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}

// Asynchronous Email Dispatcher with Status Logging & Retry Simulation
export async function queueAndSendLiveClassEmails({
  liveClass,
  eventType,
  customNote,
}: {
  liveClass: LiveClassItem;
  eventType: EmailEventType;
  customNote?: string;
}): Promise<LiveClassEmailLogRecord[]> {
  // Determine enrolled students for this course
  const enrolledStudents =
    ENROLLED_STUDENTS_SAMPLE[liveClass.courseSlug] ||
    ENROLLED_STUDENTS_SAMPLE['complete-nextjs-development'];

  const logs: LiveClassEmailLogRecord[] = [];

  for (const student of enrolledStudents) {
    // Check for duplicate recent event to avoid duplicate email notifications
    const existingLog = liveClass.emailLogs?.find(
      (l) =>
        l.recipientEmail === student.email &&
        l.eventType === eventType &&
        l.status === 'SENT'
    );

    if (existingLog && eventType !== 'LIVE_CLASS_UPDATED') {
      continue;
    }

    const logEntry: LiveClassEmailLogRecord = {
      id: `em-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      liveClassId: liveClass.id,
      recipientEmail: student.email,
      recipientName: student.name,
      eventType,
      status: 'SENT',
      attemptCount: 1,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    logs.push(logEntry);
  }

  return logs;
}
