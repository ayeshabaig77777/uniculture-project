// The ONE place on the website side where the admin is defined.
//
// How to fill it in:
//   Firebase Console -> Authentication -> Users -> copy the "User UID" of your admin account
//   and paste it between the quotes below.
//
// The same UID must also be pasted into the Firestore rules (function isAdmin).
//
// A UID is not a password. Nobody can become admin just by knowing it:
// they would still have to log in as that account.

export const ADMIN_UID = "I5sU4wHnM9eKelZfRWYdGimn4du1";