// @ts-ignore
import L from 'leaflet'
import * as fs from "fs";
import * as path from "path";
import axios from "axios";

// @ts-ignore
import {template} from "leaflet/src/core/Util";
// @ts-ignore
import {Browser, extend} from "leaflet/dist/leaflet-src.esm";

export const StorageTileLayer = L.TileLayer.extend({

	getTileUrl(coords: Object) {
		let data = {
			r: Browser.retina ? '@2x' : '',
			s: this._getSubdomain(coords),
			x: coords.x,
			y: coords.y,
			z: this._getZoomForUrl()
		};

		const variant = this.options.variant ? `/${this.options.variant}/` : "/"
		const path = `${this.options.cacheFolder}${this.options.name}${variant}${data['z']}/${data['x']}/${data['y']}.png`

		if (this._map && !this._map.options.crs.infinite) {
			var invertedY = this._globalTileRange.max.y - coords.y;
			if (this.options.tms) {
				data['y'] = invertedY;
			}
		}

		let url = template(this._url, extend(data, this.options));

		if (fs.existsSync(path)) {
			url = "data:image/png;base64," + fs.readFileSync(path, {encoding: 'base64'});
			//console.log("hit", path)
		} else {
			this.download(url, path);
			//console.log("miss", url)
		}

		return url
	},

	download(url: string, outputPath: string) {
		axios.get(url, {
			responseType: 'arraybuffer'
		})
			.then(function (response) {
				const dirname = path.dirname(outputPath);
				fs.mkdirSync(dirname, {recursive: true})
				fs.promises.writeFile(outputPath, Buffer.from(response.data, 'binary'))

				//console.log("download");
			})
			.catch(function (error) {
				console.log("GpxMap Download tile", error);
			})
	},

})
