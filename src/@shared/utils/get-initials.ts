
export function getInitials(name: string): string {
  if (!name) return ""

  const parts = name.trim().split(" ").filter(Boolean)

  if (parts.length === 0) return ""

  if (parts.length === 1) {
    return parts[0][0].toUpperCase()
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function formatName(name?: string): string {
  if (!name) return ""

  const parts = name.trim().split(" ").filter(Boolean)

   if (parts.length === 0) return ""

   const partsWithCamelCase = parts.map((val) => capitalizeFirstLetter(val))

   return partsWithCamelCase.join(' ')
}

function capitalizeFirstLetter(text: string): string {
  if (!text) return ""
  return text.charAt(0).toUpperCase() + text.slice(1)
}