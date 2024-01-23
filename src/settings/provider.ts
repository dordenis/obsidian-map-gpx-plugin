export interface ProviderOptions {
	url: string
	options: {
		maxZoom? : number
		attribution?: string
		subdomains?: string
		variant?: string
		ext?: string
	}
	variants?: Record<string, string>
	enable: boolean
}

export type Provider = Record<string, ProviderOptions>

export const  DEFAULT_PROVIDER: Provider = {
	OpenStreetMap: {
		url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
		options: {
			maxZoom: 19,
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		},
		enable: true
	},
	OpenTopoMap: {
		url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
		options: {
			maxZoom: 17,
			attribution: 'Map data: {attribution.OpenStreetMap}, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
		},
		enable: true
	},
	CyclOSM: {
		url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
		options: {
			maxZoom: 20,
			attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: {attribution.OpenStreetMap}'
		},
		enable: true
	},
	MtbMap: {
		url: 'http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png',
		options: {
			attribution:
				'{attribution.OpenStreetMap} &amp; USGS'
		},
		enable: true
	},
	CartoDB: {
		url: 'https://{s}.basemaps.cartocdn.com/{variant}/{z}/{x}/{y}{r}.png',
		options: {
			attribution: '{attribution.OpenStreetMap} &copy; <a href="https://carto.com/attributions">CARTO</a>',
			subdomains: 'abcd',
			maxZoom: 20,
			variant: 'light_all'
		},
		variants: {
			light_all: "Positron",
			dark_all: "Dark matter",
			'rastertiles/voyager': "Voyager",
		},
		enable: true
	}
}
