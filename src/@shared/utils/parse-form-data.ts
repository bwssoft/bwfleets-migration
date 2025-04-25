export function parseFormData<TResult>(formData: FormData, asBody?: boolean) {
  if (asBody) {
    const data = Object.fromEntries(formData.entries()) as { body: string };
    return JSON.parse(data.body) as TResult;
  }

  return Object.fromEntries(formData.entries()) as TResult;
}
