import { NavItem } from '@/types';

export type Policy = {
  purpose_description: any;
  policy_id: string;
  policy_name: string;
  policy_description: string;
  version: string;
  jurisdiction: string;
  industrySector: string;
  created_at: string;
  updated_at?: string;
}

export type DataAttribute = {
  id: number;
  name: string;
  description: string;
}

export type Agreement = {
  agreement_id: string;
  agreement_name: string;
  policy_id: string;
  purpose: string;
  purpose_description: string;
  is_active: boolean;
  data_attributes: DataAttribute[];
  version: string;
}

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] 
  },
  // {
  //   title: 'Employee',
  //   url: '/dashboard/employee',
  //   icon: 'user',
  //   shortcut: ['e', 'e'],
  //   isActive: false,
  //   items: [] // No child items
  // },
  {
    title: 'Policies',
    url: '/dashboard/policies',
    icon: 'scrolltext',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Agreements',
    url: '/dashboard/agreement',
    icon: 'handshake',
    shortcut: ['a', 'a'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Users',
    url: '/dashboard/users',
    icon: 'users',
    shortcut: ['u', 'u'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Consent',
    url: '/dashboard/consent',
    icon: 'filecheck',
    shortcut: ['c', 'c'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Audit',
    url: '/dashboard/audit',
    icon: 'clipboard',
    shortcut: ['a', 'u'],
    isActive: false,
    items: [] // No child items
  },
];
