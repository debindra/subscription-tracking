import { Subscription } from '../api/subscriptions';
import { formatCurrency, formatDate } from './format';

export function exportToCSV(subscriptions: Subscription[], filename: string = 'subscriptions.csv') {
  // CSV headers
  const headers = [
    'Name',
    'Amount',
    'Currency',
    'Billing Cycle',
    'Next Renewal Date',
    'Category',
    'Description',
    'Website',
    'Active',
    'Reminder Enabled',
    'Reminder Days Before',
  ];

  // Convert subscriptions to CSV rows
  const rows = subscriptions.map(sub => [
    sub.name,
    sub.amount.toString(),
    sub.currency,
    sub.billingCycle,
    sub.nextRenewalDate,
    sub.category,
    sub.description || '',
    sub.website || '',
    sub.isActive ? 'Yes' : 'No',
    sub.reminderEnabled ? 'Yes' : 'No',
    sub.reminderDaysBefore.toString(),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

interface ExportSummaryData {
  subscriptions: Subscription[];
  monthlyTotal: number;
  yearlyTotal: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
}

export function exportSummaryToHTML(data: ExportSummaryData): string {
  const { subscriptions, monthlyTotal, yearlyTotal, totalSubscriptions, activeSubscriptions } = data;

  // Generate HTML for the summary
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Subscription Report - ${new Date().toLocaleDateString()}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9fafb;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      text-align: center;
      margin-bottom: 30px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .summary-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .summary-card h3 {
      margin: 0 0 10px 0;
      font-size: 14px;
      color: #6b7280;
      text-transform: uppercase;
    }
    .summary-card p {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
      color: #111827;
    }
    .subscriptions-list {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .subscription-item {
      padding: 15px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .subscription-item:last-child {
      border-bottom: none;
    }
    .subscription-info h4 {
      margin: 0 0 5px 0;
      color: #111827;
    }
    .subscription-info p {
      margin: 0;
      font-size: 14px;
      color: #6b7280;
    }
    .subscription-amount {
      font-size: 18px;
      font-weight: bold;
      color: #4f46e5;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      margin-right: 5px;
    }
    .badge-active {
      background-color: #d1fae5;
      color: #065f46;
    }
    .badge-inactive {
      background-color: #fee2e2;
      color: #991b1b;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
    }
    @media print {
      body {
        background-color: white;
      }
      .summary-card, .subscriptions-list {
        box-shadow: none;
        border: 1px solid #e5e7eb;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>💳 Subscription Report</h1>
    <p>Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>

  <div class="summary-grid">
    <div class="summary-card">
      <h3>Monthly Total</h3>
      <p>${formatCurrency(monthlyTotal, 'USD')}</p>
    </div>
    <div class="summary-card">
      <h3>Yearly Total</h3>
      <p>${formatCurrency(yearlyTotal, 'USD')}</p>
    </div>
    <div class="summary-card">
      <h3>Total Subscriptions</h3>
      <p>${totalSubscriptions}</p>
    </div>
    <div class="summary-card">
      <h3>Active Subscriptions</h3>
      <p>${activeSubscriptions}</p>
    </div>
  </div>

  <div class="subscriptions-list">
    <h2 style="margin-top: 0;">All Subscriptions</h2>
    ${subscriptions.map(sub => `
      <div class="subscription-item">
        <div class="subscription-info">
          <h4>
            ${sub.name}
            <span class="badge ${sub.isActive ? 'badge-active' : 'badge-inactive'}">
              ${sub.isActive ? 'Active' : 'Inactive'}
            </span>
          </h4>
          <p>${sub.category} • ${sub.billingCycle} • Next renewal: ${formatDate(sub.nextRenewalDate)}</p>
          ${sub.description ? `<p style="margin-top: 5px;">${sub.description}</p>` : ''}
        </div>
        <div class="subscription-amount">
          ${formatCurrency(sub.amount, sub.currency)}
        </div>
      </div>
    `).join('')}
  </div>

  <div class="footer">
    <p>This report was generated by SubTracker</p>
    <p>&copy; ${new Date().getFullYear()} All rights reserved</p>
  </div>
</body>
</html>
  `.trim();
}

export function printHTML(htmlContent: string) {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

export function downloadHTML(htmlContent: string, filename: string = 'subscription-report.html') {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

