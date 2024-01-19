import {Settings} from "./settings/settings";
import {Property} from "./track/property";
import {StorageTileLayer} from "./layers/storageLayer";

// @ts-ignore
import L, {Control} from 'leaflet'
require('./track/gpx');

export class MapGpx {

	private setting: Settings
	private el: HTMLElement

	constructor(el: HTMLElement, setting: Settings)
	{
		this.el = el
		this.setting = setting
	}

	private createBox(): HTMLDivElement
	{
		const style = "height: " + this.setting.height + "; width: " + this.setting.width;
		return this.el.createDiv({
			cls: "map",
			attr: {style: style}
		});
	}

	private createMap()
	{
		const map = L.map(this.createBox(), {
			zoomControl: this.setting.zoomControl,
			attributionControl: false
		});

		let baseMaps: Record<string, Control.LayersObject> = {};

		if (this.setting.cache) {
			Object.entries(this.setting.providers)
				.filter(([key, value]) => value.enable)
				.forEach(([key, value]) => {
					const opt = {cacheFolder: this.setting.cacheFolder, name: key}
					baseMaps[key] = new StorageTileLayer(value.url, {...value.options, ...opt})
				})

		} else {
			Object.entries(this.setting.providers)
				.filter(([key, value]) => value.enable)
				.forEach(([key, value]) => {
					baseMaps[key] = L.tileLayer(value.url, value.options)
				})
		}

		const providers: Array<Control.LayersObject> = Object.values(baseMaps);

		if (providers.length > 0) {
			const defaultProvider: L.tileLayer = baseMaps[this.setting.defaultProvider] ? baseMaps[this.setting.defaultProvider] : providers[0]
			defaultProvider.addTo(map) //default layer
			if (providers.length > 1) {
				L.control.layers(baseMaps).addTo(map)
			}
		}

		return map;
	}

	public renderMap(lat: number, lng: number, zoom: number): void
	{
		const map = this.createMap();
		map.setView([lat, lng], zoom);
	}

	public renderTrack(file: string, el ?:HTMLElement): void
	{
		const map = this.createMap();

		new L.GPX(file, {
			async: true,
			gpx_options: {
				joinTrackSegments: false
			},
			marker_options: {
				startIconUrl : this.setting.startIconUrl,
				endIconUrl: this.setting.endIconUrl,
				shadowUrl: this.setting.shadowUrl,
				//iconSize: this.setting.iconSize,
				wptIconUrls: {'' : this.setting.wptIconUrl},
				//pointMatchers: this.setting.pointMatchers
			},
			polyline_options: {
				color: this.setting.color,
				opacity: 1,
				weight: 2,
				lineCap: 'round'
			}

		}).on('loaded', function (e: L.GPX) {
			map.fitBounds(e.target.getBounds());
			const prop = new Property(e.target);

			el?.setText( prop.distance().toString() );
		}).addTo(map);
	}

}
