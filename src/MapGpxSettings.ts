export interface Provider {
	name: string
	url: string
	enable: boolean
}

export const DEFAULT_PROVIDER: Array<Provider> = [
	{
		name: "OSM",
		url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
		enable: true
	}, {
		name: "OSM Hot",
		url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
		enable: true
	}, {
		name: "Opentopomap",
		url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
		enable: true
	}
]

export interface MapGpxSettings {
	cache: boolean
	cacheFolder: string
	track: string
	color: string
	providers: Array<Provider>
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
	providers: DEFAULT_PROVIDER,
	height: "600px",
	width: "100%",
	zoomControl: true,
	icon: false,
	startIconUrl: "",
	endIconUrl: "",
	wptIconUrl: "",
	shadowUrl: "",
};
