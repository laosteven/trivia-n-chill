import { toast } from "svelte-sonner";

export function useNotifications() {
  function info(message: string) {
    toast.info(message, { dismissable: true });
  }
  function success(message: string) {
    toast.success(message, { dismissable: true });
  }
  function error(message: string) {
    toast.error(message, { dismissable: true });
  }
  return { info, success, error };
}
