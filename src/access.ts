/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser }) {
  const { currentUser } = initialState || {};
  const role = localStorage.getItem('role');
  const manageInfo = JSON.parse(localStorage.getItem('manageInfo') || '[]');

  return {
    canAdmin: currentUser && currentUser.role === 'admin',
    canViewVideoList: () => role === '44' && manageInfo[0]?.status === true && manageInfo[1]?.status === true,
    canViewAuthList: () => role === '44' && manageInfo[0]?.status === true,
    canViewVolunteerList: () => role >= '42' && manageInfo[0]?.status === true,
    canViewApplicationList: () => role >= '42' && manageInfo[0]?.status === true,
  };
}
