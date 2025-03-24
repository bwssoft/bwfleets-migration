export function parseFormData<TResult>(formData: FormData) {
  return Object.fromEntries(formData.entries()) as TResult;
}
