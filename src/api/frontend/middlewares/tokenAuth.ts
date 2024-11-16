import {checkValidate} from "./helper/checkValidate";
import {checkEndpoint} from "./helper/checkEndPoint";
import {groupEndPointsForAdmin, groupEndPointsForManager} from "./helper/groups";

export default (config, { strapi }: { strapi }) => {
  return async (ctx, next) => {
    const token = ctx.request.headers['authorization']
    if (!token) {
      return ctx.unauthorized('No token provided')
    }
    const customToken = await checkValidate(token.split(' ')[1])
    if (customToken.state) {
      switch (customToken.level) {
        case 0:
          if (checkEndpoint(ctx.request.path.replace('/api/', ''), groupEndPointsForManager)) {
            await next()
          }
          break
        case 1:
          if (checkEndpoint(ctx.request.path.replace('/api/', ''), groupEndPointsForAdmin)) {
            await next()
          }
          break
        case 2:
          await next()
          break
        default:
          return ctx.unauthorized('Invalid, expired token or role is undefined')
      }
      return
    }
    try {
      let state: boolean = false
      const bearerToken = token.substring('Bearer '.length)
      if (!bearerToken) {
        state = false
      }
      const apiTokenService = strapi.services['admin::api-token']
      const accessKey = await apiTokenService.hash(bearerToken)
      const storedToken = await apiTokenService.getBy({accessKey: accessKey})
      if (!storedToken) {
        state = false
      }
      if (storedToken.expiresAt && storedToken.expiresAt < new Date()) {
        state = false
      }
      if (storedToken.type === 'full-access') {
        state = true
      }
      if (state) await next()
    } catch (error) {
      return ctx.unauthorized('Invalid or expired token')
    }
  };
};
