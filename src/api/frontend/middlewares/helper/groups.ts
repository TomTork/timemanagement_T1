export const groupEndPointsForManager: (RegExp | string)[] = [
  /^\/?worktime\/.+$/,
  /^\/?update-work\/.+$/,
  /^\/?update-worktime\/.+$/,
  /^\/?update-work\/?(\?.*)?$/,
  'worktimes',
  'work'
]
export const groupEndPointsForAdmin: (RegExp | string)[] = [
  'workers',
  'worker',
  /^\/?work\/.+$/,
  /^\/?delete-worktime\/.+$/,
  /^\/?worker\/.+$/,
  /^\/?worker\/?(\?.*)?$/,
  ...groupEndPointsForManager
]
