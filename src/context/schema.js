const today = new Date().toISOString().slice(0, 10)

export const todayISO = today
export const fieldDefs = {
  projects: [['name', 'Project name'], ['client', 'Client name'], ['location', 'Location'], ['start', 'Start date', 'date'], ['end', 'End date', 'date'], ['budget', 'Budget (₹)', 'number'], ['status', 'Status', 'select', ['Planning', 'In Progress', 'On Hold', 'Completed']], ['progress', 'Progress (%)', 'number'], ['manager', 'Project manager']],
  workers: [['name', 'Full name'], ['employee_id', 'Employee ID'], ['age', 'Age', 'number'], ['experience', 'Experience (years)', 'number'], ['role', 'Department / role', 'select', ['Site Supervisor', 'Civil Engineer', 'Engineer', 'Supervisor', 'Mason', 'Electrician', 'Plumber', 'Carpenter', 'Laborer']], ['salary', 'Monthly salary (₹)', 'number'], ['join_date', 'Join date', 'date'], ['phone', 'Phone number'], ['project', 'Project', 'select', 'projects'], ['status', 'Status', 'select', ['On site', 'On leave']], ['wage', 'Daily wage (₹)', 'number'], ['notes', 'Notes', 'textarea', null, false]],
  materials: [['name', 'Material name'], ['category', 'Category', 'select', ['Cement', 'Steel', 'Aggregates', 'Masonry', 'Electrical', 'Plumbing', 'Other']], ['quantity', 'Quantity', 'number'], ['unit', 'Unit'], ['threshold', 'Low stock alert at', 'number'], ['cost', 'Cost per unit (₹)', 'number'], ['supplier', 'Supplier'], ['project', 'Project', 'select', 'projects']],
  expenses: [['title', 'Expense description'], ['category', 'Category', 'select', ['Materials', 'Labour', 'Equipment', 'Transportation', 'Other']], ['amount', 'Amount (₹)', 'number'], ['date', 'Date', 'date'], ['project', 'Project', 'select', 'projects'], ['notes', 'Notes', 'text', null, false]],
  tasks: [['title', 'Task name'], ['project', 'Project', 'select', 'projects'], ['assignee', 'Assign worker', 'select', 'workers'], ['start', 'Start date', 'date'], ['due', 'Due date', 'date'], ['status', 'Status', 'select', ['Pending', 'In Progress', 'Completed']], ['priority', 'Priority', 'select', ['High', 'Medium', 'Low']]],
}

export const initialData = {
  projects: [],
  workers: [],
  materials: [],
  expenses: [],
  tasks: [],
  activities: [
    { id: 1, text: 'Steel delivery recorded', project: 'Riverside Residences', time: '12 min ago', color: 'orange' },
    { id: 2, text: 'Slab inspection passed', project: 'Oakwood Community Center', time: '1 hour ago', color: 'green' },
    { id: 3, text: 'Task assigned to Neha Kulkarni', project: 'Greenfield Office Park', time: '3 hours ago', color: 'blue' },
    { id: 4, text: 'Weekly payroll expense added', project: 'Riverside Residences', time: 'Yesterday', color: 'purple' },
  ],
}
