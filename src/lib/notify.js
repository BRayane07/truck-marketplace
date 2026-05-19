/**
 * lib/notify.js
 * Toast notifications via Sonner.
 */
import { toast } from 'sonner'

export const notify = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  info: (message) => toast.info(message),
}
