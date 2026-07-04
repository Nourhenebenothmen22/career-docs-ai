const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');

class AuditService {
  async log({ userId, action, resource, resourceId = null, ipAddress = null, details = null }) {
    try {
      await AuditLog.create({
        userId,
        action,
        resource,
        resourceId,
        ipAddress,
        details,
      });
    } catch (err) {
      logger.warn('Failed to create audit log entry', { message: err.message });
    }
  }
}

module.exports = new AuditService();
