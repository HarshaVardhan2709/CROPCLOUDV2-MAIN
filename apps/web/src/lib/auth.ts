export function getDashboardPath(role?: string | null) {
  switch (role) {
    case 'ADMIN':
      return '/dashboard/admin';
    case 'SELLER':
      return '/dashboard/seller';
    case 'LOGISTICS':
      return '/dashboard/logistics';
    case 'BUYER':
    default:
      return '/dashboard/buyer';
  }
}
