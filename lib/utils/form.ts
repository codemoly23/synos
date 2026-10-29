/**
 * react-hook-form helpers
 */

/**
 * `register` options for an optional numeric <input type="number">.
 *
 * Use instead of `{ valueAsNumber: true }`. With `valueAsNumber`, an empty
 * input becomes `NaN`, which `z.number().optional()` rejects (and which
 * Mongoose casts as an error) — silently blocking form submission. This maps
 * empty / non-numeric input to `undefined` so optional number fields save.
 */
export const optionalNumberField = {
	setValueAs: (v: unknown): number | undefined => {
		if (v === "" || v === null || v === undefined) return undefined;
		const n = Number(v);
		return Number.isNaN(n) ? undefined : n;
	},
};
