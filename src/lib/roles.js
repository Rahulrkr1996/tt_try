// The backend seeds two roles: "admin" and "ambassador" (the student-facing
// Campus Ambassador role — referred to as "student" in the UI). Every user
// has exactly one role, assigned server-side (self-signup always becomes
// "ambassador"; admins are provisioned directly in the database).

export function roleName(user) {
  return user?.role?.name || ''
}

export function isAdmin(user) {
  return roleName(user) === 'admin'
}

export function roleHome(user) {
  return isAdmin(user) ? '/admin/dashboard' : '/campus/dashboard'
}
