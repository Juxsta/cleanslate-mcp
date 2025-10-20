/**
 * Represents a food entry in the CleanSlate system
 */
export interface FoodEntry {
  /** Unique identifier for the food entry */
  id: string;

  /** Name or description of the food */
  name: string;

  /** Calories in the food entry */
  calories: number;

  /** Protein in grams */
  protein: number;

  /** ISO 8601 timestamp when the entry was created */
  timestamp: string;
}
