const baseRouteUrls = {
  sysAdmin: "/sys-admin",
  codeInput: "/code-input",
  user: "/user",
};

export const routeUrl = {
  codeInput: `${baseRouteUrls.codeInput}`,
  sysAdmin: {
    root: `${baseRouteUrls.sysAdmin}`,
    viewUsers: `view-users`,
    addUsers: `add-users`,
  },
  user: {
    root: `${baseRouteUrls.user}`,
    codeInput: `code-input`,
    codeRequest: `code-request`,
    activityHistory: `activity-history`,
  },
};
