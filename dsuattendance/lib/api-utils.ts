/**
 * Utility functions for API data handling
 */

/**
 * Safely extracts an array from API response data that might be in different formats
 * @param data The API response data
 * @param idProperty The property name to use as ID if converting objects to array
 * @returns An array of items and debug information
 */
export function extractArrayFromResponse(
  data: any,
  idProperty = "id",
): {
  items: any[]
  debugInfo: string
} {
  if (!data) {
    return { items: [], debugInfo: "Received empty data from API" }
  }

  // If data is already an array, use it directly
  if (Array.isArray(data)) {
    return {
      items: data,
      debugInfo: `Data is an array with ${data.length} items`,
    }
  }

  // If data is an object, try to find an array property
  if (typeof data === "object") {
    // Look for array properties
    const possibleArrays = Object.values(data).filter((val) => Array.isArray(val))
    if (possibleArrays.length > 0) {
      return {
        items: possibleArrays[0] as any[],
        debugInfo: `Found array in data object with ${possibleArrays[0].length} items`,
      }
    }

    // If no array found, try to convert the object to an array
    const convertedArray = Object.entries(data).map(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        return { ...value, [idProperty]: key }
      }
      return { [idProperty]: key, value }
    })

    return {
      items: convertedArray,
      debugInfo: `Converted object to array with ${convertedArray.length} items`,
    }
  }

  // If data is neither an array nor an object, return empty array
  return {
    items: [],
    debugInfo: `Unexpected data format: ${typeof data}`,
  }
}

/**
 * Safely gets a property value from an object
 * @param obj The object to get the property from
 * @param path The property path (e.g. 'user.name')
 * @param defaultValue The default value to return if the property doesn't exist
 * @returns The property value or the default value
 */
export function getProperty(obj: any, path: string, defaultValue: any = undefined): any {
  if (!obj || typeof obj !== "object") return defaultValue

  const parts = path.split(".")
  let current = obj

  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") {
      return defaultValue
    }
    current = current[part]
  }

  return current !== undefined ? current : defaultValue
}

/**
 * Determines the most likely ID property from a sample object
 * @param sampleObject An object to analyze for ID properties
 * @param possibleProps Array of possible property names that might contain IDs
 * @returns The most likely ID property name or null if none found
 */
export function determineIdProperty(
  sampleObject: any,
  possibleProps = ["ID No", "id", "ID", "studentId", "student_id", "rollNo", "roll_no"],
): string | null {
  if (!sampleObject || typeof sampleObject !== "object") {
    return null
  }

  for (const prop of possibleProps) {
    if (sampleObject[prop] !== undefined) {
      return prop
    }
  }

  return null
}

