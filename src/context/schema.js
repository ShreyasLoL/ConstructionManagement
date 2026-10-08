const today = new Date().toISOString().slice(0, 10)
const days = (n) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10)

export const todayISO = today
export const fieldDefs = {
  projects: [['name', 'Project name'], ['client', 'Client name'], ['location', 'Location'], ['start', 'Start date', 'date'], ['end', 'End date', 'date'], ['budget', 'Budget (₹)', 'number'], ['status', 'Status', 'select', ['Planning', 'In Progress', 'On Hold', 'Completed']], ['progress', 'Progress (%)', 'number'], ['manager', 'Project manager']],
  workers: [['name', 'Full name'], ['role', 'Role', 'select', ['Engineer', 'Supervisor', 'Mason', 'Electrician', 'Plumber', 'Carpenter', 'Laborer']], ['phone', 'Phone number'], ['project', 'Project', 'select', 'projects'], ['status', 'Status', 'select', ['On site', 'On leave']], ['wage', 'Daily wage (₹)', 'number']],
  materials: [['name', 'Material name'], ['category', 'Category', 'select', ['Cement', 'Steel', 'Aggregates', 'Masonry', 'Electrical', 'Plumbing', 'Other']], ['quantity', 'Quantity', 'number'], ['unit', 'Unit'], ['threshold', 'Low stock alert at', 'number'], ['cost', 'Cost per unit (₹)', 'number'], ['supplier', 'Supplier'], ['project', 'Project', 'select', 'projects']],
  expenses: [['title', 'Expense description'], ['category', 'Category', 'select', ['Materials', 'Labour', 'Equipment', 'Transportation', 'Other']], ['amount', 'Amount (₹)', 'number'], ['date', 'Date', 'date'], ['project', 'Project', 'select', 'projects'], ['notes', 'Notes', 'text', null, false]],
  tasks: [['title', 'Task name'], ['project', 'Project', 'select', 'projects'], ['assignee', 'Assign worker', 'select', 'workers'], ['start', 'Start date', 'date'], ['due', 'Due date', 'date'], ['status', 'Status', 'select', ['Pending', 'In Progress', 'Completed']], ['priority', 'Priority', 'select', ['High', 'Medium', 'Low']]],
}

export const initialData = {
  projects: [
    { id: 1, name: 'Riverside Residences', client: 'Northstar Living', location: 'Pune, Maharashtra', start: '2025-11-10', end: days(28), budget: 4850000, status: 'In Progress', progress: 68, manager: 'Aarav Mehta' },
    { id: 2, name: 'Greenfield Office Park', client: 'Meridian Group', location: 'Bengaluru, Karnataka', start: '2025-08-01', end: days(52), budget: 7200000, status: 'In Progress', progress: 42, manager: 'Priya Nair' },
    { id: 3, name: 'Oakwood Community Center', client: 'City Development Corp.', location: 'Mumbai, Maharashtra', start: '2025-10-15', end: days(12), budget: 2650000, status: 'In Progress', progress: 84, manager: 'Rohan Shah' },
    { id: 4, name: 'Hillview School Extension', client: 'Hillview Education Trust', location: 'Nashik, Maharashtra', start: '2025-06-03', end: '2025-12-18', budget: 1950000, status: 'Completed', progress: 100, manager: 'Aarav Mehta' },
    { id: 5, name: 'Maple Street Townhomes', client: 'Cedar Homes', location: 'Hyderabad, Telangana', start: '2026-02-01', end: days(112), budget: 3800000, status: 'Planning', progress: 8, manager: 'Priya Nair' },
    { id: 6, name: 'Eastside Water Works', client: 'Municipal Works Dept.', location: 'Pune, Maharashtra', start: '2025-09-12', end: days(76), budget: 5600000, status: 'On Hold', progress: 31, manager: 'Rohan Shah' },
  ],
  workers: [
    { id: 1, name: 'Vikram Singh', role: 'Site Supervisor', phone: '+91 98765 43210', project: 'Riverside Residences', status: 'On site', wage: 1800 },
    { id: 2, name: 'Neha Kulkarni', role: 'Civil Engineer', phone: '+91 98234 56781', project: 'Greenfield Office Park', status: 'On site', wage: 2400 },
    { id: 3, name: 'Ramesh Patil', role: 'Mason', phone: '+91 97654 32109', project: 'Oakwood Community Center', status: 'On site', wage: 950 },
    { id: 4, name: 'Imran Khan', role: 'Electrician', phone: '+91 98901 23456', project: 'Riverside Residences', status: 'On leave', wage: 1250 },
    { id: 5, name: 'Sanjay Rao', role: 'Carpenter', phone: '+91 98123 45670', project: 'Greenfield Office Park', status: 'On site', wage: 1100 },
    { id: 6, name: 'Deepak Yadav', role: 'Laborer', phone: '+91 97412 34567', project: 'Oakwood Community Center', status: 'On site', wage: 700 },
    { id: 7, name: 'Anita Deshmukh', role: 'Plumber', phone: '+91 98876 54321', project: 'Riverside Residences', status: 'On site', wage: 1150 },
  ],
  materials: [
    { id: 1, name: 'OPC Cement (Grade 53)', category: 'Cement', quantity: 42, unit: 'bags', threshold: 50, cost: 390, supplier: 'BuildRight Supplies', project: 'Riverside Residences' },
    { id: 2, name: 'TMT Steel Bars (12mm)', category: 'Steel', quantity: 860, unit: 'kg', threshold: 200, cost: 68, supplier: 'Metro Steel Co.', project: 'Riverside Residences' },
    { id: 3, name: 'River Sand', category: 'Aggregates', quantity: 12, unit: 'tons', threshold: 5, cost: 1850, supplier: 'Shree Aggregates', project: 'Greenfield Office Park' },
    { id: 4, name: 'Red Clay Bricks', category: 'Masonry', quantity: 2800, unit: 'pcs', threshold: 500, cost: 9, supplier: 'Narmada Brickworks', project: 'Oakwood Community Center' },
    { id: 5, name: 'Electrical Conduit (20mm)', category: 'Electrical', quantity: 18, unit: 'lengths', threshold: 25, cost: 85, supplier: 'Electra Trade Hub', project: 'Riverside Residences' },
    { id: 6, name: 'Crushed Stone (20mm)', category: 'Aggregates', quantity: 28, unit: 'tons', threshold: 8, cost: 1250, supplier: 'Shree Aggregates', project: 'Oakwood Community Center' },
  ],
  expenses: [
    { id: 1, title: 'Foundation steel delivery', category: 'Materials', amount: 164000, date: days(-2), project: 'Riverside Residences', notes: 'TMT bars, phase 2' },
    { id: 2, title: 'Weekly crew payroll', category: 'Labour', amount: 87500, date: days(-3), project: 'Riverside Residences', notes: 'Site team, week 23' },
    { id: 3, title: 'Tower crane rental', category: 'Equipment', amount: 62000, date: days(-5), project: 'Greenfield Office Park', notes: 'Monthly hire' },
    { id: 4, title: 'Concrete mixer transport', category: 'Transportation', amount: 18500, date: days(-7), project: 'Oakwood Community Center', notes: '' },
    { id: 5, title: 'Cement and aggregates', category: 'Materials', amount: 94500, date: days(-8), project: 'Greenfield Office Park', notes: 'Supplier invoice #BR-442' },
    { id: 6, title: 'Safety equipment', category: 'Other', amount: 12800, date: days(-10), project: 'Oakwood Community Center', notes: 'PPE restock' },
  ],
  tasks: [
    { id: 1, title: 'Pour level 4 slab', project: 'Riverside Residences', assignee: 'Vikram Singh', start: today, due: days(2), status: 'In Progress', priority: 'High' },
    { id: 2, title: 'Electrical rough-in inspection', project: 'Riverside Residences', assignee: 'Imran Khan', start: days(1), due: days(4), status: 'Pending', priority: 'Medium' },
    { id: 3, title: 'Submit structural drawings', project: 'Greenfield Office Park', assignee: 'Neha Kulkarni', start: today, due: days(6), status: 'In Progress', priority: 'High' },
    { id: 4, title: 'Install fire safety systems', project: 'Oakwood Community Center', assignee: 'Sanjay Rao', start: days(2), due: days(12), status: 'Pending', priority: 'Medium' },
    { id: 5, title: 'Finish exterior masonry', project: 'Oakwood Community Center', assignee: 'Ramesh Patil', start: days(-3), due: days(-1), status: 'Completed', priority: 'Low' },
    { id: 6, title: 'Site utility coordination', project: 'Greenfield Office Park', assignee: 'Neha Kulkarni', start: days(3), due: days(17), status: 'Pending', priority: 'Low' },
  ],
  activities: [
    { id: 1, text: 'Steel delivery recorded', project: 'Riverside Residences', time: '12 min ago', color: 'orange' },
    { id: 2, text: 'Slab inspection passed', project: 'Oakwood Community Center', time: '1 hour ago', color: 'green' },
    { id: 3, text: 'Task assigned to Neha Kulkarni', project: 'Greenfield Office Park', time: '3 hours ago', color: 'blue' },
    { id: 4, text: 'Weekly payroll expense added', project: 'Riverside Residences', time: 'Yesterday', color: 'purple' },
  ],
}
