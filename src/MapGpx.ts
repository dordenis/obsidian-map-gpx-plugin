import {MapGpxSettings} from "./MapGpxSettings";
import {MapGpxTrackProperty} from "./MapGpxTrackProperty";
import {StorageTileLayer} from "./MapGpxStorageLayer";

// @ts-ignore
import L, {Control} from 'leaflet'
require('./gpx');
//require("leaflet-providers")

export class MapGpx {

	private setting: MapGpxSettings
	private el: HTMLElement

	constructor(el: HTMLElement, setting: MapGpxSettings)
	{
		this.el = el
		this.setting = setting
	}

	private createBox(): HTMLDivElement
	{
		const style = "height: " + this.setting.height + "; width: " + this.setting.width;
		return this.el.createDiv({
			cls: "map",
			attr: {text: "text", style: style}
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
			this.setting.providers.filter(p => p.enable).forEach(p => {
				baseMaps[p.name] = new StorageTileLayer(p.url,
					{cacheFolder: this.setting.cacheFolder, name: p.name}
				)
			})
		} else {
			this.setting.providers.filter(p => p.enable).forEach(p => {
				baseMaps[p.name] = L.tileLayer(p.url, this.setting)
			})
		}

		const providers: Array<Control.LayersObject> = Object.values(baseMaps);
		if (providers[0]) {
			const provider: Control.LayersObject = providers[0]
			// @ts-ignore
			provider.addTo(map) //default layer

			L.control.layers(baseMaps).addTo(map)
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
			const prop = new MapGpxTrackProperty(e.target);

			el?.setText( prop.distance().toString() );
		}).addTo(map);
	}

}
