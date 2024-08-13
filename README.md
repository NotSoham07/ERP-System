# ERP System
- **You can test it out live by creating an account at**: [https://notanerpsystem.netlify.app/signup](https://notanerpsystem.netlify.app/signup)
- **Or using email: `employee@erp.com` & pass: `employee` at**: [https://notanerpsystem.netlify.app/login](https://notanerpsystem.netlify.app/login)

## Project Overview
The ERP System is a comprehensive application designed to manage various aspects of a business, including Human Resources (HR), Finance, Inventory, and Projects. The system is built with a modular approach, allowing different departments to manage their data and processes efficiently. The application is equipped with role-based access control to ensure that sensitive data and functionalities are restricted to authorized users.

## Features
- **User Authentication and Authorization**: Secure login and signup with role-based access control.
- **Dashboard**: Overview of all modules with quick access links.
- **HR Module**: Manage employee data including adding, updating, and deleting employee records.
- **Finance Module**: Track financial transactions with options to add, update, and delete records.
- **Inventory Module**: Manage inventory items, including stock levels, pricing, and supplier information.
- **Projects Module**: Track and manage various projects within the organization.
- **Role Management**: Admin functionality to manage user roles and permissions.
- **Real-Time Updates**: Automatic updates of data across the application using Supabase's real-time features.
- **Responsive Design**: A user-friendly interface designed with Material UI, optimized for various devices.

## Technology Stack
- **Frontend**: 
  - React.js
  - Material UI
- **Backend**: 
  - Supabase (Database and Authentication)
- **Other Libraries**:
  - `react-router-dom` for routing
  - `@mui/icons-material` for icons

## Routing
The application uses `react-router-dom` for navigation with the following routes:
- `/login`: Login page
- `/signup`: Signup page
- `/dashboard`: Main dashboard (protected)
- `/hr`: HR Module (protected)
- `/finance`: Finance Module (protected)
- `/inventory`: Inventory Module (protected)
- `/projects`: Projects Module (protected)
- `/admin/roles`: Manage User Roles (admin only)
- `/admin/signup`: Admin Signup page (admin only)

## Role-Based Access Control
- **Roles**: Admin, Manager, Employee
- **Permissions**:
  - Admin: Full access to all modules, including role management.
  - Manager: Access to HR, Finance, Inventory, and Projects modules.
  - Employee: Access to view-only data in HR, Finance, Inventory, and Projects modules.

## Real-Time Data Handling
The application uses Supabase for real-time data updates. Data changes are automatically reflected in the UI without requiring a manual refresh.

## UI/UX Enhancements
- **Material UI**: The entire application UI is built using Material UI components for a consistent and responsive design.
- **Icons**: Icons from `@mui/icons-material` are used in the sidebar and action buttons.
- **Notifications**: Toast notifications are used to provide feedback to the user.

## Error Handling and Validation
- **Form Validation**: All forms include basic validation to ensure required fields are filled.
- **Error Messages**: Clear error messages are displayed to users in case of any issues (e.g., failed login, invalid data).

## Deployment

### Netlify (Frontend)
1. Create a Netlify Account.
2. Connect the GitHub Repository.
3. Set Environment Variables:
   - Add `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY` in Netlify's environment settings.
4. Deploy the Site: The site will be automatically built and deployed after pushing changes to the main branch.

### Supabase (Backend)
- Supabase handles the backend, including the database and authentication. Ensure your Supabase project is correctly configured with the necessary tables and roles.

## Contributing
1. Fork the Repository: Create a fork of this repository on GitHub.
2. Create a Branch: Create a new branch for your feature or bug fix.
3. Submit a Pull Request: Once your changes are ready, submit a pull request for review.

## License
This project is licensed under the MIT License.

## Contact Information
- **Author**: Soham Patil
- **Email**: [sohammpatil0711@gmail.com](mailto:sohammpatil0711@gmail.com)
- **GitHub**: [NotSoham07](https://github.com/NotSoham07)
