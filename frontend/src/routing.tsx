// Define base routes
export const baseRouteUrls = {
  codeInput: "/code-input",
  sysAdmin: "/sys-admin",
  user: "/user",
};

// Define route structure
export const routes = {
  codeInput: baseRouteUrls.codeInput,
  sysAdmin: {
    root: baseRouteUrls.sysAdmin,
    viewUsers: "view-users",
    addUsers: "add-users",
  },
  user: {
    root: baseRouteUrls.user,
    codeInput: "code-input",
    codeRequest: "code-request",
    activityHistory: "activity-history",
    profile: "profile",
  },
};

// Generate absolute paths automatically
export const routeUrl = {
  ...routes,
  absolutes: {
    sysAdminViewUsers: `${routes.sysAdmin.root}/${routes.sysAdmin.viewUsers}`,
    sysAdminAddUsers: `${routes.sysAdmin.root}/${routes.sysAdmin.addUsers}`,
    userRoot: routes.user.root,
    userCodeInput: `${routes.user.root}/${routes.user.codeInput}`,
    userCodeRequest: `${routes.user.root}/${routes.user.codeRequest}`,
    userActivityHistory: `${routes.user.root}/${routes.user.activityHistory}`,
    userProfile: `${routes.user.root}/${routes.user.profile}`,
  },
};
