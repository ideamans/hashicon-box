import {createCanvas} from './utils';
import {Light} from "./sprite";

export interface Range {
	min: number;
	max: number;
}

export interface OptionalParam {
	enabled: boolean;
}

// to use Keccak (legacy) hasher, please add dependency to js-sha3:
// npm install js-sha3
export type HasherType = 'blake2' | 'keccak' | 'legacy';

export interface Params {
	hasher: HasherType;
	size: number;
	hue: Range;
	saturation: Range;
	lightness: Range;
	variation: Range & OptionalParam;
	shift: Range;
	figureAlpha: Range;
	light: Record<Light, number> & OptionalParam;
	createCanvas: (width: number, height: number) => HTMLCanvasElement;
}

export const DefaultParams: Partial<Params> = {
	hasher: "blake2",
	hue: {min: 0, max: 360},
	saturation: {min: 70, max: 100},
	lightness: {min: 50, max: 60},
	variation: {min: 3, max: 10, enabled: true},
	shift: {min: 60, max: 300},
	figureAlpha: {min: .3, max: .7},
	light: {top: 15, right: -18, left: -8, enabled: true},
	createCanvas,
}
