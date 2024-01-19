import {DEFAULT_PROVIDER, Provider} from "./provider";

export interface Settings {
	cache: boolean
	cacheFolder: string
	track: string
	color: string
	providers: Provider
	height: string
	width: string
	zoomControl: boolean
	icon: boolean
	startIconUrl: string
	endIconUrl: string
	wptIconUrl: string
	shadowUrl: string
	trackFolder: string
	defaultProvider: string
}

export const DEFAULT_SETTINGS: Partial<Settings> = {
	cache: false,
	cacheFolder: "",
	track: "",
	color: "blue",
	providers: DEFAULT_PROVIDER,
	height: "600px",
	width: "100%",
	zoomControl: true,
	icon: false,
	startIconUrl: "",
	endIconUrl: "",
	wptIconUrl: "",
	shadowUrl: "",
	defaultProvider: "OpenStreetMap"
};
