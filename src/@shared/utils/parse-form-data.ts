export function parseFormData<TResult>(formData: FormData, asBody?: boolean) {
  if (asBody) {
    const data = Object.fromEntries(formData.entries()) as { body: string };
    return JSON.parse(data.body) as TResult;
  }

  return Object.fromEntries(formData.entries()) as TResult;
}

export function generateFormData<TData>(data: TData) {
  const formData = new FormData();
  formData.append("body", JSON.stringify(data));
  return formData;
}
