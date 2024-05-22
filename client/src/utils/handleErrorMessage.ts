export const handleErrorMessage = (res: any, message: any) => {
  const _res: any = res;
  message.open({
    type: "error",
    content: _res?.error?.message ?? "Action failed",
    duration: 1,
  });
};
