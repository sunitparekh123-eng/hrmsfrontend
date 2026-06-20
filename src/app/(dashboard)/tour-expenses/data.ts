export const BRANCHES = [
  "Indore – HQ", "Mumbai", "Delhi", "Pune", "Hyderabad",
  "Ahmedabad", "Surat", "Bhopal", "Jaipur", "Chennai"
];

export const EXPENSE_CATEGORIES = [
  "Travel (Air/Train/Bus)", "Local Conveyance", "Hotel / Accommodation",
  "Meals & Per Diem", "Fuel & Vehicle", "Toll / Parking",
  "Client Entertainment", "Miscellaneous",
];

export const POLICY_RULES = [
  { label: "Air Travel (Economy)",   limit: "₹ 12,000 / trip",    note: "Business class requires VP approval" },
  { label: "Hotel Stay",             limit: "₹ 3,500 / night",    note: "Metro cities: ₹ 5,000 / night"      },
  { label: "Meals & Per Diem",       limit: "₹ 800 / day",        note: "Receipts mandatory above ₹ 300"     },
  { label: "Local Conveyance",       limit: "₹ 500 / day",        note: "Cab receipts required"              },
  { label: "Fuel / Own Vehicle",     limit: "₹ 8 / km",           note: "Log sheet mandatory"                },
  { label: "Client Entertainment",   limit: "₹ 5,000 / occasion", note: "Manager approval required"          },
];

export type ExpenseStatus = "Approved" | "Pending" | "Rejected";

export interface Receipt {
  id: string;
  name: string;
  size: string;
  type: string;
}

export interface Expense {
  id: string;
  employee: string;
  dept: string;
  branch: string;
  purpose: string;
  from: string;
  to: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: ExpenseStatus;
  category: string;
  receipts: Receipt[];
  submittedOn: string;
  remarks: string;
  approvedBy?: string;
  rejectedReason?: string;
  company?: string;
  db_id?: number | string;
}

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: "TE001", employee: "Arjun Singh", dept: "Sales", branch: "Indore – HQ",
    purpose: "Client visit – Mumbai", from: "Indore", to: "Mumbai",
    startDate: "May 05, 2026", endDate: "May 07, 2026", amount: 14250,
    status: "Approved", category: "Travel (Air/Train/Bus)",
    receipts: [
      { id: "R1", name: "flight_ticket.pdf", size: "245 KB", type: "PDF" },
      { id: "R2", name: "hotel_invoice.pdf", size: "128 KB", type: "PDF" },
      { id: "R3", name: "meal_receipt.jpg",  size: "84 KB",  type: "IMG" },
    ],
    submittedOn: "May 08, 2026", remarks: "Client meeting successful.", approvedBy: "Rakesh Gupta",
  },
  {
    id: "TE002", employee: "Priya Sharma", dept: "Operations", branch: "Mumbai",
    purpose: "Vendor meeting – Delhi", from: "Mumbai", to: "Delhi",
    startDate: "May 10, 2026", endDate: "May 11, 2026", amount: 9800,
    status: "Pending", category: "Hotel / Accommodation",
    receipts: [
      { id: "R4", name: "train_ticket.pdf", size: "112 KB", type: "PDF" },
      { id: "R5", name: "hotel_bill.pdf",   size: "95 KB",  type: "PDF" },
    ],
    submittedOn: "May 12, 2026", remarks: "Vendor negotiation completed.",
  },
  {
    id: "TE003", employee: "Rahul Mehta", dept: "Tech", branch: "Pune",
    purpose: "Conference – Pune", from: "Indore", to: "Pune",
    startDate: "Apr 22, 2026", endDate: "Apr 24, 2026", amount: 18500,
    status: "Approved", category: "Travel (Air/Train/Bus)",
    receipts: [
      { id: "R6", name: "flight_pune.pdf",  size: "200 KB", type: "PDF" },
      { id: "R7", name: "hotel_pune.pdf",   size: "150 KB", type: "PDF" },
      { id: "R8", name: "conf_fee.pdf",     size: "60 KB",  type: "PDF" },
      { id: "R9", name: "taxi_receipt.jpg", size: "45 KB",  type: "IMG" },
    ],
    submittedOn: "Apr 25, 2026", remarks: "Tech conference attendance.", approvedBy: "Rakesh Gupta",
  },
  {
    id: "TE004", employee: "Kavita Joshi", dept: "HR", branch: "Bhopal",
    purpose: "Training – Bhopal", from: "Indore", to: "Bhopal",
    startDate: "May 14, 2026", endDate: "May 14, 2026", amount: 2100,
    status: "Rejected", category: "Local Conveyance",
    receipts: [{ id: "R10", name: "fuel_receipt.jpg", size: "30 KB", type: "IMG" }],
    submittedOn: "May 15, 2026", remarks: "Day trip for training.",
    rejectedReason: "Receipts insufficient. Please resubmit with detailed fuel log.",
  },
  {
    id: "TE005", employee: "Suresh Patel", dept: "Logistics", branch: "Surat",
    purpose: "Depot audit – Surat", from: "Indore", to: "Surat",
    startDate: "May 01, 2026", endDate: "May 03, 2026", amount: 11600,
    status: "Approved", category: "Fuel & Vehicle",
    receipts: [
      { id: "R11", name: "fuel_log.pdf",    size: "88 KB", type: "PDF" },
      { id: "R12", name: "toll_receipt.jpg",size: "22 KB", type: "IMG" },
      { id: "R13", name: "hotel_surat.pdf", size: "110 KB",type: "PDF" },
    ],
    submittedOn: "May 04, 2026", remarks: "Annual depot audit.", approvedBy: "Rakesh Gupta",
  },
  {
    id: "TE006", employee: "Meera Rao", dept: "Finance", branch: "Hyderabad",
    purpose: "GST audit – Hyderabad", from: "Indore", to: "Hyderabad",
    startDate: "May 16, 2026", endDate: "May 17, 2026", amount: 21000,
    status: "Pending", category: "Hotel / Accommodation",
    receipts: [
      { id: "R14", name: "flight_hyd.pdf",  size: "195 KB", type: "PDF" },
      { id: "R15", name: "hotel_hyd.pdf",   size: "140 KB", type: "PDF" },
      { id: "R16", name: "gst_docs.pdf",    size: "320 KB", type: "PDF" },
    ],
    submittedOn: "May 17, 2026", remarks: "Statutory GST audit visit.",
  },
];
