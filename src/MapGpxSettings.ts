
export interface MapGpxSettings {
	cache: boolean
	cacheFolder: string
	track: string
	color: string
	service: string
	height: string
	width: string
	zoomControl: boolean
	icon: boolean
	startIconUrl: string
	endIconUrl: string
	wptIconUrl: string
	shadowUrl: string
	trackFolder: string
}

export const DEFAULT_SETTINGS: Partial<MapGpxSettings> = {
	cache: false,
	cacheFolder: "",
	track: "",
	color: "blue",
	service: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
	height: "600px",
	width: "100%",
	zoomControl: true,
	icon: false,
	startIconUrl: "",
	endIconUrl: "",
	wptIconUrl: "",
	shadowUrl: "",
};
