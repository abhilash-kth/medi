// /lib/parser.ts

// ---------------- NORMALIZE ----------------
const TYPO_FIX: Record<string, string> = {
  TAB: "TABLET",
  TABS: "TABLET",
  CAP: "CAPSULE",
  CAPS: "CAPSULE",
  OINMENT: "OINTMENT",
  OINT: "OINTMENT",
  SYP: "SYRUP",
  INJ: "INJECTION"
}

function normalize(text: string): string {
  text = text.toUpperCase()
  text = text.replace(/-/g, " ")
  text = text.replace(/\+/g, " + ")
  text = text.replace(/\//g, " / ")
  text = text.replace(/[()]/g, " ")
  text = text.replace(/\s+/g, " ")

  for (const [k, v] of Object.entries(TYPO_FIX)) {
    const regex = new RegExp(`\\b${k}\\b`, "g")
    text = text.replace(regex, v)
  }

  return text.trim()
}

// ---------------- REMOVE PACK INFO ----------------
const PACK_PATTERNS = [
  /\d+\s*'S/g,
  /\d+\s*TABS?/g,
  /\d+\s*CAPS?/g,
  /\d+\s*TABLETS?/g,
  /\d+\s*CAPSULES?/g,
  /STRIP OF \d+/g,
  /BOTTLE OF \d+/g,
  /PACK OF \d+/g,
  /\d+\s*ML BOTTLE/g,
  /\d+\s*ML\b/g,
  /\d+ML\b/g,
  /\d+X\d+(?:\.\d+)?ML?/g,
  /\d+ X \d+ ML?/g
]

function removePack(text: string): string {
  for (const pattern of PACK_PATTERNS) {
    text = text.replace(pattern, "")
  }
  return text.replace(/\s+/g, " ").trim()
}

// ---------------- TOKENIZER ----------------
function tokenize(text: string): string[] {
  return text.split(/\s+/)
}

// ---------------- CLEAN DUPLICATE STRENGTHS ----------------
function cleanDuplicateStrengths(tokens: string[]): string[] {
  const seen = new Set<string>()
  const cleaned: string[] = []

  for (const t of tokens) {
    const normalized = t.replace(/\s/g, "").toUpperCase()

    if (/^\d+(\.\d+)?(MG|MCG|G|ML|IU|%|MIU|MU)$/.test(normalized)) {
      if (seen.has(normalized)) continue
      seen.add(normalized)
      cleaned.push(normalized)
    } else {
      cleaned.push(t)
    }
  }

  return cleaned
}

// ---------------- STRENGTH ----------------
const UNIT_REGEX = "(MG|MCG|G|GM|ML|IU|%|MIU|MU)"

const STRENGTH_REGEX = new RegExp(`\\b\\d+(?:\\.\\d+)?\\s?${UNIT_REGEX}\\b`)
const COMBO_STRENGTH_REGEX = new RegExp(
  `\\b\\d+(?:\\.\\d+)?\\s?${UNIT_REGEX}(?:\\s?[+/]\\s?\\d+(?:\\.\\d+)?\\s?${UNIT_REGEX})+`
)
const SLASH_COMBO_REGEX = new RegExp(
  `\\b\\d+(?:\\.\\d+)?(?:\\s*/\\s*\\d+(?:\\.\\d+)?)*\\s?${UNIT_REGEX}\\b`
)

function extractStrength(text: string): string | null {
  const combo = text.match(COMBO_STRENGTH_REGEX)
  if (combo) return combo[0].replace(/\s/g, "")

  const slash = text.match(SLASH_COMBO_REGEX)
  if (slash) return slash[0].replace(/\s/g, "")

  const match = text.match(STRENGTH_REGEX)
  if (match) return match[0].replace(/\s/g, "")

  return null
}

function extractNumericStrength(tokens: string[]): string | null {
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]

    if (/^\d{1,4}$/.test(t)) {
      if (i === 0) continue

      const prev = tokens[i - 1] || ""

      if (/^[A-Z]\d+$/.test(prev)) continue
      if (VARIANTS.has(prev)) continue
      if (parseInt(t) > 2000) continue

      return t
    }
  }
  return null
}

// ---------------- FORMS ----------------
const FORMS = [
  "CHEWABLE TABLET","DISPERSIBLE TABLET","EFFERVESCENT TABLET",
  "SUBLINGUAL TABLET","BUCCAL TABLET","FILM COATED TABLET",
  "TABLET","HARD CAPSULE","SOFT GEL CAPSULE","SOFTGEL CAPSULE",
  "CAPSULE","ORAL SUSPENSION","ORAL SOLUTION","SUSPENSION","SYRUP",
  "SOLUTION","EYE DROPS","EAR DROPS","NASAL DROPS","DROPS",
  "NASAL SPRAY","MOUTH SPRAY","SPRAY","CREAM","OINTMENT","GEL",
  "LOTION","FACE WASH","MOUTH WASH","SHAMPOO","SOAP","SCRUB",
  "POWDER","INHALER","ROTACAP","RESPULE","VAPOCAP",
  "PREFILLED SYRINGE","INJECTION","SACHET","GRANULES",
  "PASTILLE","LOZENGE","KIT","PATCH","BALM","LINIMENT",
  "LIQUID","GUM","OINT","SPRINKLE"
].sort((a, b) => b.length - a.length)

function extractForm(text: string): string | null {
  const padded = ` ${text} `
  for (const form of FORMS) {
    if (padded.includes(` ${form} `)) return form
  }
  return null
}

// ---------------- VARIANTS ----------------
const VARIANTS = new Set([
  "XR","SR","CR","ER","MR","IR","DR","PR","TR","BR",
  "XL","LA","OD","BD","TD","D","DX","N","DT","AL","M","TG",
  "MD","ODT","FX","HP","FORTE","PLUS","MAX","EXTRA","ULTRA","SUPER",
  "DUO","DSR","LS","LC","LB","CV","AV","AZ","H","CT","AT","MT","TZ",
  "SP","MF","PG","VG","GM","G","O","OZ","OF","A","C","K","Z","B","L","AM","PM","FT","IT",
  "FLEX","SRX","EX","DS","XT","D3"
])

function extractVariant(tokens: string[]): string | null {
  const found = tokens.filter((t, i) => VARIANTS.has(t) && i !== 0)
  return found.length ? found.join(" ") : null
}

// ---------------- BRAND ----------------
function extractBrand(
  tokens: string[],
  strength: string | null,
  form: string | null,
  variant: string | null
): string {
  const stop = new Set<string>()

  if (strength) stop.add(strength)
  if (variant) variant.split(" ").forEach(v => stop.add(v))
  if (form) form.split(" ").forEach(f => stop.add(f))

  const brand: string[] = []

  for (const t of tokens) {
    if (stop.has(t)) break
    if (/^\d+$/.test(t)) break
    brand.push(t)
  }

  return brand.length ? brand.join(" ") : "UNKNOWN"
}

// ---------------- CANONICAL ----------------
function buildCanonical(
  brand: string,
  variant: string,
  strength: string,
  form: string
): string {
  const parts: string[] = []

  brand = (brand || "UNKNOWN").toUpperCase()
  variant = (variant || "NORMAL").toUpperCase()
  strength = (strength || "UNKNOWN").toUpperCase()
  form = (form || "NORMAL").toUpperCase()

  if (brand) parts.push(brand)
  if (!["NORMAL","UNKNOWN"].includes(variant) && !brand.includes(variant)) parts.push(variant)
  if (!["NORMAL","UNKNOWN"].includes(strength) && !brand.includes(strength)) parts.push(strength)
  if (!["NORMAL","UNKNOWN"].includes(form)) parts.push(form)

  return [...new Set(parts)].join(" ")
}

// ---------------- MAIN ----------------
export function parseMedicine(rawName: string, debug = false) {
  let name = normalize(rawName)
  name = removePack(name)

  let tokens = tokenize(name)
  tokens = cleanDuplicateStrengths(tokens)

  let strength = extractStrength(name)
  if (!strength) strength = extractNumericStrength(tokens)
  if (strength) strength = strength.replace("GM", "G")

  let form = extractForm(name)
  let variant = extractVariant(tokens)
  let brand = extractBrand(tokens, strength, form, variant)

  if (!variant) variant = "NORMAL"
  if (!form) form = "NORMAL"
  if (!strength) strength = "UNKNOWN"

  const canonical = buildCanonical(brand, variant, strength, form)

  const result = {
    brand,
    variant,
    strength,
    form,
    canonicalName: canonical
  }

  if (debug) {
    console.log("RAW:", rawName)
    console.log("PARSED:", result)
    console.log("------")
  }

  return result
}
